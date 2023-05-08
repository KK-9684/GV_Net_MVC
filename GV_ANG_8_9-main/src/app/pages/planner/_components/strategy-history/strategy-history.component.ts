import { Component, Input, OnInit } from '@angular/core';
import { filter, tap } from 'rxjs/operators';

import { StateService } from 'src/app/core/services/state.service';
@Component({
  selector: 'app-strategy-history',
  templateUrl: './strategy-history.component.html',
  styleUrls: ['./strategy-history.component.scss']
})
export class StrategyHistoryComponent implements OnInit {
  @Input() disabled;
  alertsHistory: any;
  displayedColumns = [
    'alertId',
    'league',
    'home',
    'away',
    'alertTime'
  ]
  targetStrategy: boolean;

  constructor(private _store: StateService) {
  }

  ngOnInit(): void {
    this._getTargetStrategy();
    this._store.alertsHistory.subscribe(alerts => {
      let _alertsHistory = JSON.parse(JSON.stringify(alerts));
      _alertsHistory.forEach(history => {
        let datetimeStr:string = history.alertTime;
        let datetime = new Date(datetimeStr);
        history.alertTime = datetime.toLocaleString('en-GB', { timeZone: 'UTC' });
      });
      this.alertsHistory = _alertsHistory;
    });
  }

  private _getTargetStrategy(): void {
    this._store.targetStrategy
      .pipe(
        filter(Boolean),
        tap((strategy) => {
          this.targetStrategy = (strategy)?true:false;

        })
      )
      .subscribe(() => {});
  }
}
