import { Component, Input } from '@angular/core';
import { DustService } from '../service/dust.service';
import { DustDto } from '../service/DustDto';
import { DatePipe } from '@angular/common';
import { Chart } from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-prediction-chart',
  templateUrl: './prediction-chart.component.html',
  styleUrls: ['./prediction-chart.component.css']
})
export class PredictionChartComponent {
  private _id: number;
  private _dateTo: Date;

  @Input() set id(value: number) {
    this._id = value;
    this.dateTo = this.dateToStr;
    this.updateDustData();
  }

  dateToStr: string = moment().add(5, 'days').endOf('day').format('YYYY-MM-DD');

  set dateTo(value: string) {
    this._dateTo = moment(this.dateToStr).endOf('day').toDate();
  }

  constructor(private dustService: DustService) { }

  dateRangeChanged() {
    this.dateTo = this.dateToStr;
    this.updateDustData();
  }

  private updateDustData(): void {
    this.dustService.getDustPrediction(this._id).subscribe(
      result => this.drawChart(result),
      err => console.error(err)
    );
  }

  private drawChart(prediction: DustDto[]): void {
    const pipe = new DatePipe('en-US');
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    const green_red_gradient_25 = context.createLinearGradient(0, 400, 0, 0);
    green_red_gradient_25.addColorStop(0, 'green');
    green_red_gradient_25.addColorStop(0.25, 'yellow');
    green_red_gradient_25.addColorStop(0.5, 'red');

    const green_red_gradient_100 = context.createLinearGradient(0, 400, 0, 0);
    green_red_gradient_100.addColorStop(0, 'green');
    green_red_gradient_100.addColorStop(0.5, 'yellow');
    green_red_gradient_100.addColorStop(1, 'red');

    const chart = new Chart(context, {
      type: 'line',
      data: {
        // hacked backend behaviour that should be limitable
        labels: prediction.filter(data => moment(data.timestamp).isBefore(this._dateTo)).map(dustdata => pipe.transform(dustdata.timestamp, 'medium')),
        datasets: [
          {
            label: 'Dust 2.5',
            data: (prediction.filter(data => moment(data.timestamp).isBefore(this._dateTo)).map(dustdata => dustdata.particulateMatter25)),
            fill: false,
            borderColor: 'grey',
            pointBorderColor: green_red_gradient_25,
            pointBackgroundColor: green_red_gradient_25,
            pointHoverBackgroundColor: green_red_gradient_25,
            pointHoverBorderColor: green_red_gradient_25,
            pointRadius: 5,
            pointHoverRadius: 8
          },
          {
            label: 'Dust 10',
            data: (prediction.filter(data => moment(data.timestamp).isBefore(this._dateTo)).map(dustdata => dustdata.particulateMatter100)),
            fill: false,
            borderColor: 'darkgreen',
            pointBorderColor: green_red_gradient_100,
            pointBackgroundColor: green_red_gradient_100,
            pointHoverBackgroundColor: green_red_gradient_100,
            pointHoverBorderColor: green_red_gradient_100,
            pointRadius: 5,
            pointHoverRadius: 8
          }]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true,
            ticks: {
              max: 100,
              min: 0
            }
          }],
        }
      }
    });
  }

}