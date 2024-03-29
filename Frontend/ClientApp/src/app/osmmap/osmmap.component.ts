import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import Map from 'ol/Map';
import PluggableMap from 'ol/PluggableMap';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import { defaults as defaultControls, Attribution, ScaleLine } from 'ol/control';
import { fromLonLat, toLonLat } from 'ol/proj';
import { getBottomLeft, getTopRight } from 'ol/extent';
import Feature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import Geolocation from 'ol/Geolocation';
import Point from 'ol/geom/Point';
import MapEvent from 'ol/MapEvent';
import { ObjectEvent } from 'ol/Object';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';

import { Subscription, fromEvent, timer, EMPTY } from 'rxjs';
import { debounceTime, map, switchMap, catchError } from 'rxjs/operators';

import { SensorDto } from '../service/sensor.dto';
import { DustService } from '../service/dust.service';
import { PopupComponent } from '../popup/popup.component';
import { UserLocation } from './user-location.class';
import { ConfigService } from '../service/config.service';

@Component({
  selector: 'app-osmmap',
  templateUrl: './osmmap.component.html',
  styleUrls: ['./osmmap.component.css']
})
export class OsmMapComponent implements OnInit, OnDestroy {
  private _sensors = new VectorSource();
  private _currentPosition = new Feature();
  private _mapMoveSubscription!: Subscription;
  private _resizeSubscription!: Subscription;
  @ViewChild(PopupComponent) private _popup!: PopupComponent;

  public constructor(private _dustService: DustService, private _configService: ConfigService) {}

  public ngOnInit() {
    const osmMap = new Map({
      target: 'osm-map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [this._currentPosition]
          })
        }),
        new VectorLayer({
          source: new Cluster({
            attributions: '© Dust data by <a href="https://www.betterask.erni/" target="_blank">ERNI</a> Community',
            source: this._sensors,
            distance: 30
          }),
          style: this.getStyle.bind(this)
        })
      ],
      view: new View({
        center: fromLonLat([19.696058, 48.6737532]),
        zoom: 0,
        maxZoom: 19
      }),
      controls: defaultControls({attribution: false}).extend([
        new Attribution({collapsible: true}),
        new ScaleLine(),
        new UserLocation(m =>  this.navigateMapToUsersPosition(m))
      ])
    });
    const minZoom = this.calculateMinZoom(osmMap.getTargetElement());
    osmMap.getView().setMinZoom(minZoom);
    osmMap.getView().setZoom(minZoom + 2);

    const geolocation = new Geolocation({
      tracking: true,
      trackingOptions: { enableHighAccuracy: true },
      projection: osmMap.getView().getProjection()
    });
    geolocation.on('error', err => console.error('geolocation error', err));
    geolocation.on('change', evt => this._currentPosition.setGeometry((evt.target as Geolocation)!.getAccuracyGeometry()!));
    geolocation.once('change', evt => osmMap.getView().animate({center: (evt.target as Geolocation)!.getPosition()}));

    osmMap.on('click', evt => {
      const cluster = evt.map.forEachFeatureAtPixel(evt.pixel, (ft, layer) => ft);
      if (cluster?.get('features')?.length === 1) {
        this._popup.open(cluster.get('features')[0].get('data'));
      }
    });

    this._mapMoveSubscription = fromEvent<MapEvent>(osmMap, 'moveend').pipe(
      debounceTime(1000),
      map(evt => [toLonLat(getBottomLeft(evt.frameState!.extent!)), toLonLat(getTopRight(evt.frameState!.extent!))]),
      switchMap(extent => timer(0, this._configService.autorefreshInterval).pipe( // emit immediatelly, then every configured refresh period
        map(_ => extent)
      )),
      switchMap(extent => this._dustService.getSensors(extent[0][0], extent[0][1], extent[1][0], extent[1][1]).pipe(
        catchError(e => {
          console.warn('getting sensors failed', e);
          return EMPTY; // if call to server fails just ignore it
        })
      )),
    ).subscribe({
      next: result => this.drawMarkers(result),
      error: err => console.error('mapMoveSubscription fail', err)
    });

    this._resizeSubscription = fromEvent<ObjectEvent>(osmMap, 'change:size').pipe(
      debounceTime(100),
      map(evt => this.calculateMinZoom((evt.target as Map).getTargetElement()))
    ).subscribe({
      next: zoom => osmMap.getView().setMinZoom(zoom),
      error: err => console.error('resizeSubscription fail', err)
    });
  }

  private drawMarkers(dtos: SensorDto[]) {
    this._sensors.clear();
    this._sensors.addFeatures(dtos.map(x => new Feature({
      geometry: new Point(fromLonLat([x.longitude, x.latitude])),
      data: x
    })));
  }

  private navigateMapToUsersPosition(m: PluggableMap) {
    m.getView().fit(this._currentPosition.getGeometry()!.getExtent(), { duration: 1000 });
  }

  // calculate minimal zoom level that allows to see only one world at given map size
  private calculateMinZoom(elem: HTMLElement) {
    const width = elem.clientWidth;
    return Math.ceil(Math.LOG2E * Math.log(width / 256));
  }

  public ngOnDestroy(): void {
    this._mapMoveSubscription.unsubscribe();
    this._resizeSubscription.unsubscribe();
  }

  private getStyle(feature: RenderFeature | Feature<any>, resolution: number): Style[] {
    const features = feature.get('features');
    if (features.length === 1) {
      const data = features[0].get('data') as SensorDto;
      const matter25 = data.particulateMatter25;
      const matter100 = data.particulateMatter100;
      return [
        matter25 ? new Style({
          image: new Circle({
            radius: 20,
            stroke: new Stroke({
              color: this.getColor25(matter25),
              width: 12.5
            })
          }),
          text: new Text({
            text: matter25?.toFixed(1),
            scale: 1.2,
            offsetY: 20
          })
        }) : new Style(),
          new Style({
          image: new Circle({
            radius: 12.5,
            fill: new Fill({
              color: this.getColor100(matter100),
            })
          }),
          text: new Text({
            text: matter100?.toFixed(1),
            scale: 1.2
          })
        })
      ];
    } else {
      return [
        new Style({
          image: new Circle({
            radius: 20,
            stroke: new Stroke({
              color: this.getColor25(this.getAverage(features, 'particulateMatter25')),
              width: 12.5
            })
          }),
        }),
        new Style({
          image: new Circle({
            radius: 12.5,
            fill: new Fill({
              color: this.getColor100(this.getAverage(features, 'particulateMatter100')),
            })
          }),
          text: new Text({
            text: features.length.toString(),
            scale: 1.7
          })
        })
      ];
    }
  }

  private getColor25(matterDensity: number) {
    if (!matterDensity) {
      return [0, 0, 0, 0.5];
    }
    switch (true) {
      case matterDensity < 25:
        return [0, 255, 0, 0.5];
      case matterDensity < 50:
        return [255, 255, 0, 0.5];
      default:
        return [255, 0, 0, 0.5];
    }
  }

  private getColor100(matterDensity: number) {
    if (!matterDensity) {
      return [0, 0, 0, 0.5];
    }
    switch (true) {
      case matterDensity < 50:
        return [0, 255, 0, 0.5];
      case matterDensity < 100:
        return [255, 255, 0, 0.5];
      default:
        return [255, 0, 0, 0.5];
    }
  }

  private getAverage(matterDensities: any[], key: string): number {
    return matterDensities.reduce((a, b) => a + b.get('data')[key], 0) / matterDensities.length;
  }
}
