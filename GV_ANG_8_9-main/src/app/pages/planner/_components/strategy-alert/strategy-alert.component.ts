import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { filter, tap } from 'rxjs/operators';

import { StateService } from 'src/app/core/services/state.service';

@Component({
  selector: 'app-strategy-alert',
  templateUrl: './strategy-alert.component.html',
  styleUrls: ['./strategy-alert.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StrategyAlertComponent implements OnInit {
  @Input() disabled;
  public telegramAlertTypeId: any;
  public soundAlerts: boolean;
  public targetStrategy: any;
  constructor(private _store: StateService) { }

  ngOnInit(): void {
    this._getTargetStrategy();
  }

  private _getTargetStrategy(): void {
    this._store.targetStrategy
      .pipe(
        filter(Boolean),
        tap((strategy) => {
          this.targetStrategy = strategy;
          const alertValue = this.targetStrategy.telegramAlertTypeId;
          alertValue !== null && (this.telegramAlertTypeId = alertValue);
          this.soundAlerts =
            this.targetStrategy.soundAlerts || false;
        })
      )
      .subscribe(() => {});
  }

  handleSoundAlertsChange(event) {
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      soundAlerts: this.soundAlerts
    });
  }
  handleAlertValueChange(value) {
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      telegramAlertTypeId: this.telegramAlertTypeId
    });
  }
}
