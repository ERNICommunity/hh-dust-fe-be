import { Component, Input, OnInit } from '@angular/core';

import { IChartistData } from 'chartist';

import { DustService } from '../service/dust.service';

@Component({
  selector: 'app-prediction-chart',
  templateUrl: './prediction-chart.component.html',
  styleUrls: ['./prediction-chart.component.css']
})
export class PredictionChartComponent implements OnInit {
  private _id = 0;
  public data!: IChartistData;

  @Input() public set id(value: number) {
    this._id = value;
  }

  public constructor(private _dustService: DustService) { }

  public ngOnInit(): void {
    this._dustService.getDustPrediction(this._id)
    .subscribe({
      next: results => {
        const labels: Date[] = [], serie1: number[] = [], serie2: number[] = [];
        results.forEach(r => {
          labels.push(new Date(r.timestamp));
          serie1.push(r.particulateMatter25);
          serie2.push(r.particulateMatter100);
        });
        this.data = { labels, series: [ serie1, serie2 ] };
      },
      error: err => console.error(err)
    });
  }
}
