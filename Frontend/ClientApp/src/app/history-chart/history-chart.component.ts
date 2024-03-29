import { Component, Input, OnInit, } from '@angular/core';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { IChartistData } from 'chartist';

import { DustService } from '../service/dust.service';

@Component({
  selector: 'app-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.css']
})
export class HistoryChartComponent implements OnInit {
  private _id = 0;
  private _dateFrom: BehaviorSubject<Date>;
  private _dateTo: BehaviorSubject<Date>;
  public data!: IChartistData;

  @Input() public set id(value: number) {
    this._id = value;
  }

  public set dateFrom(value: string) {
    this._dateFrom.next(new Date(value));
  }
  public get dateFrom(): string {
    return this.formatForDateInput(this._dateFrom.value);
  }

  public set dateTo(value: string) {
    this._dateTo.next(new Date(value));
  }
  public get dateTo(): string {
    return this.formatForDateInput(this._dateTo.value);
  }

  public constructor(private _dustService: DustService) {
    const now = new Date();
    this._dateFrom = new BehaviorSubject<Date>(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 20, 0, 0, 0, 0));
    this._dateTo = new BehaviorSubject<Date>(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0 , 0, 0, 0));
  }

  public ngOnInit(): void {
    combineLatest([this._dateFrom, this._dateTo]).pipe(
      switchMap(([from, to]) => this._dustService.getDustHistory(this._id, from, to))
    )
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

  private formatForDateInput(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }
}
