import { Component, OnInit, OnDestroy } from '@angular/core';
import { RunningRequestService } from './service/running-request.service';
import { Subscription } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _requestWatcherSubscription!: Subscription;

  public constructor(
    private _requestService: RunningRequestService,
    private _loadingBar: LoadingBarService
  ) {}

  public ngOnInit(): void {
    this._requestWatcherSubscription = this._requestService.watcher.subscribe(
      (x) => (x ? this._loadingBar.useRef().start() : this._loadingBar.useRef().complete())
    );
  }

  public ngOnDestroy(): void {
    this._requestWatcherSubscription.unsubscribe();
  }
}
