import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SensorDto } from '../service/sensor.dto';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  @ViewChild('content') private _content!: TemplateRef<any>;

  public id = 0;
  public name: string | undefined;
  public latitude: number | undefined;
  public longitude: number | undefined;
  public timestamp: string | undefined;
  public particulateMatter25: number | undefined;
  public particulateMatter100: number | undefined;

  public constructor(private _modalService: NgbModal) { }

  public open(data: SensorDto) {
    this.id = data.id;
    this.name = data.name;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.timestamp = data.timestamp;
    this.particulateMatter25 = data.particulateMatter25;
    this.particulateMatter100 = data.particulateMatter100;
    this._modalService.open(this._content, {size: 'lg'});
  }
}
