import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class RunningRequestService {
  private _runningRequestsCount = 0;
  private _subject = new Subject<boolean>();

  public watcher = this._subject.asObservable();

  public constructor() { }

  public requestStarted() {
    this._runningRequestsCount++;
    if (this._runningRequestsCount === 1) {
      this._subject.next(true);
    }
  }

  public requestFinished() {
    this._runningRequestsCount--;
    if (this._runningRequestsCount === 0) {
      this._subject.next(false);
    }
  }
}
