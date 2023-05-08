import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { StateService } from 'src/app/core/services';

@Component({
  selector: 'app-strategy-appearance',
  templateUrl: './strategy-appearance.component.html',
  styleUrls: ['./strategy-appearance.component.scss'],
})
export class StrategyAppearanceComponent implements OnInit, OnDestroy {
  @Input() disabled;
  private _stop$: Subject<any>;

  targetStrategy: any;
  strategyName: string;
  strategyColor: string;
  disableQuickFilters: boolean;
  showOnScanner: boolean;
  _momentumGraphConfig = {
    GraphType: 'Bar',
    ShotsOffTarget: '',
    ShotsOnTarget: '',
    YellowCard: '',
    RedCard: '',
    Corner: '',
    Goal: '',
    Home: '',
    Away: '',
    Background: '',
  };
  momentumGraphConfig: any;
  momentumColors = [
    { key: 'ShotsOnTarget', value: 'Shots On Target' },
    { key: 'ShotsOffTarget', value: 'Shots Off Target' },
    { key: 'YellowCard', value: 'Yellow Card' },
    { key: 'RedCard', value: 'Red Card' },
    { key: 'Corner', value: 'Corner' },
    { key: 'Goal', value: 'Goal' },
    { key: 'Home', value: 'Home' },
    { key: 'Away', value: 'Away' },
    { key: 'Background', value: 'Background' },
  ];

  p1GraphConfig: any;
  p2GraphConfig: any;
  _P1P2GraphConfig = {
    Goal: '',
    Home: '',
    Away: '',
    Background: ''
  };

  P1P2GraphColors = ['Goal', 'Home', 'Away', 'Background'];

  _iconsConfig = {
    StatsFilter: false,
    QuickFilters: false,
    Information: false,
    ResetColumnOrder: false,
    Undo: false
  }
  iconsConfig: any;
  iconNames = [
    'Stats Filter',
    'Quick Filters',
    'Information',
    'Reset Column Order',
    'Undo',
  ];

  _gridDisplayConfig = {
    gridHeightByMatches: 0,
    rowHeight: 0
  };
  gridDisplayConfig: any;
  gridConfigNames = [
    { key: 'gridHeightByMatches', value: 'Grid Height By Matches' },
    { key: 'rowHeight', value: 'Row Height' }
  ];

  constructor(private readonly _store: StateService) {
    this._setVariables();
  }

  ngOnInit(): void {
    this._getTargetStrategy();
  }

  ngOnDestroy(): void {
    this._stop$.next();
    this._stop$.complete();
  }

  private _setVariables(): void {
    this._stop$ = new Subject();
    this.strategyName = null;
    this.strategyColor = null;
    this.disableQuickFilters = false;
    this.momentumGraphConfig = JSON.parse(
      JSON.stringify(this._momentumGraphConfig)
    );
    this.p1GraphConfig = JSON.parse(
      JSON.stringify(this._P1P2GraphConfig)
    );
    this.p2GraphConfig = JSON.parse(
      JSON.stringify(this._P1P2GraphConfig)
    );
    this.iconsConfig = JSON.parse(
      JSON.stringify(this._iconsConfig)
    );
    this.gridDisplayConfig = JSON.parse(
      JSON.stringify(this._gridDisplayConfig)
    );
  }

  private _getTargetStrategy(): void {
    this._store.targetStrategy
      .pipe(
        filter(Boolean),
        tap((strategy) => {
          this.targetStrategy = strategy;
          this.strategyName = this.targetStrategy.name || '';
          this.strategyColor = this.targetStrategy.colour || '';
          this.disableQuickFilters =
            this.targetStrategy.disableQuickFilters || false;
          this.showOnScanner =
            this.targetStrategy.showOnScanner || false;

          // Initialize momentumGraphConfig
          if (this.targetStrategy.momentumGraphConfig) {
            this.momentumGraphConfig = JSON.parse(
              this.targetStrategy.momentumGraphConfig
            );
          } else {
            this.momentumGraphConfig = JSON.parse(
              JSON.stringify(this._momentumGraphConfig)
            );
          }

          // Initialize P1GraphConfig
          if (this.targetStrategy['p1GraphConfig']) {
            this.p1GraphConfig = JSON.parse(
              this.targetStrategy['p1GraphConfig']
            );
          } else {
            this.p1GraphConfig = JSON.parse(
              JSON.stringify(this._P1P2GraphConfig)
            );
          }

          // Initialize P2GraphConfig
          if (this.targetStrategy['p2GraphConfig']) {
            this.p2GraphConfig = JSON.parse(
              this.targetStrategy['p2GraphConfig']
            );
          } else {
            this.p2GraphConfig = JSON.parse(
              JSON.stringify(this._P1P2GraphConfig)
            );
          }

          if(this.targetStrategy.iconsConfig) {
            this.iconsConfig = JSON.parse(this.targetStrategy.iconsConfig)
          } else {
            this.iconsConfig = JSON.parse(
              JSON.stringify(this._iconsConfig)
            );
            delete this.iconsConfig['QuickFilter'];
            delete this.iconsConfig['ResetColumn Order'];
          }

          if(this.targetStrategy.gridDisplayConfig) {
            this.gridDisplayConfig = JSON.parse(this.targetStrategy.gridDisplayConfig);
          } else {
            this.gridDisplayConfig = JSON.parse(
              JSON.stringify(this._gridDisplayConfig)
            );
          }
        })
      )
      .subscribe(() => {});
  }

  onChangeName(event): void {
    this.strategyName = event.target.value;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      name: this.strategyName,
    });
  }

  onChangeDisableStatus(event): void {
    this.disableQuickFilters = event.target.checked;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      disableQuickFilters: this.disableQuickFilters,
    });
  }

  onChangeShowOnScannerStatus(event): void {
    this.showOnScanner = event.target.checked;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      showOnScanner: this.showOnScanner,
    });
  }

  updateStrategyColor(value) {
    this.strategyColor = value;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      colour: this.strategyColor,
    });
  }

  updateMomentumGraphType(value) {
    this.momentumGraphConfig['GraphType'] = value;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      momentumGraphConfig: JSON.stringify(this.momentumGraphConfig)
    });
  }

  updateMomentumColor(value, key) {
    this.momentumGraphConfig[key] = value;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      momentumGraphConfig: JSON.stringify(this.momentumGraphConfig)
    });
  }

  updateP1GraphColor(value, key) {
    const graphConfig = this.p1GraphConfig;
    graphConfig[key] = value;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      p1GraphConfig: JSON.stringify(graphConfig)
    });
  }

  updateP2GraphColor(value, key) {
    const graphConfig = this.p2GraphConfig;
    graphConfig[key] = value;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      p2GraphConfig: JSON.stringify(graphConfig)

    });
  }

  updateIconsConfig(event, icon) {
    const key = icon.replaceAll(' ', '');

    this.iconsConfig[key] = event.target.checked;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      iconsConfig: JSON.stringify(this.iconsConfig)
    });
  }

  updateGridDisplayConfig(event, key) {
    this.gridDisplayConfig[key] = event.target.valueAsNumber;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      gridDisplayConfig: JSON.stringify(this.gridDisplayConfig)
    });
  }
}
