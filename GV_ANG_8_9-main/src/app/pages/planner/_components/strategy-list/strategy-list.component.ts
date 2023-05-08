import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import {
  filter,
  tap,
  takeUntil,
  mergeMap,
  take,
  finalize,
} from 'rxjs/operators';
import { Subject } from 'rxjs';

import { StateService, PlannerService } from 'src/app/core/services';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { StrategyDialogComponent } from '../dialog/strategy-dialog/strategy-dialog.component';
import StrategySkel from './strategy-skel';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-strategy-list',
  templateUrl: './strategy-list.component.html',
  styleUrls: ['./strategy-list.component.scss'],
})
export class StrategyListComponent implements OnInit, OnDestroy {
  private _stop$: Subject<any>;

  strategies: any[];
  selectedStrategy: any;

  isSavingStrategy: boolean;
  sampleStrategies = [];
  _iconsConfig = {
    StatsFilter: true,
    QuickFilters: true,
    Information: true,
    ResetColumnOrder: false,
    Undo: true
  };
  _gridDisplayConfig = {
    gridHeightByMatches: 12,
    rowHeight: 60
  };
  deletingStrategy = [];
  constructor(
    public dialog: MatDialog,
    private readonly _cdRef: ChangeDetectorRef,
    private readonly _store: StateService,
    private readonly _plannerService: PlannerService,
    private http: HttpClient,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    this._setVariables();
    iconRegistry.addSvgIcon(
      'document-upload',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/document-upload.svg'));
  }

  ngOnInit(): void {
    this._getStrategies();
    this._getSampleStrategies();
  }

  ngOnDestroy(): void {
    this._stop$.next();
    this._stop$.complete();
  }

  private _setVariables(): void {
    this._stop$ = new Subject();
    this.selectedStrategy = Object.create(null);
    this.isSavingStrategy = false;
  }

  private _getStrategies(): void {
    this._store.strategies
      .pipe(
        filter(Boolean),
        tap((strategies: any) => {
          this.strategies = strategies;

          if (this.strategies.length > 0 && !this.isSavingStrategy) {
            this.selectedStrategy = this.strategies[0];
            this._store.setTargetStrategy(this.selectedStrategy);
          }

          if (this.isSavingStrategy) {
            this.isSavingStrategy = false;
          }

          this._cdRef.detectChanges();
        }),
        takeUntil(this._stop$)
      )
      .subscribe(() => { });
    this._store.targetStrategy
      .pipe(
        filter(Boolean),
        tap((strategy: any) => {
          this.selectedStrategy = strategy;
          this._cdRef.detectChanges();
        }),
        takeUntil(this._stop$)
      )
      .subscribe(() => { });
  }

  private _getSampleStrategies(): void {
    this._store.sampleStrategies
      .pipe(
        filter(Boolean),
        tap((strategies: any) => {
          this.sampleStrategies = strategies;
          this._cdRef.detectChanges();
        }),
        takeUntil(this._stop$)
      )
      .subscribe(() => { });
  }

  onChangeTargetStrategy(strategy): void {
    this.selectedStrategy = strategy;
    this._store.setTargetStrategy(this.selectedStrategy);
    this._cdRef.detectChanges();
  }

  onCreateStrategy(): void {
    const strategyProto = Object.entries(StrategySkel).reduce(
      (acc, cur) => {
        const [key, value] = cur;

        if (key === 'strategyId' || key === 'userId') {
          return { ...acc };
        }

        if (key === 'statsFiltersList' || key === 'correctScoreFiltersList') {
          return { ...acc, [key]: [] };
        }

        if (typeof value === 'boolean') {
          return { ...acc, [key]: true };
        }

        if (typeof value === 'string') {
          return { ...acc, [key]: '' };
        }

        if ([undefined, null].includes(value)) {
          return { ...acc, [key]: '' };
        }
      },
      {}
    );
    const strategy = {
      ...strategyProto,
      active: true,
      showOnScanner: true,
      iconsConfig: JSON.stringify(this._iconsConfig),
      gridDisplayConfig: JSON.stringify(this._gridDisplayConfig),
    }
    this._store.setTargetStrategy(strategy);
  }

  onSaveStrategy() {
    this.isSavingStrategy = true;
    this._store.targetStrategy
      .pipe(
        take(1),
        mergeMap((strategy) => this._plannerService.saveStrategy(strategy)),
        tap(async ({ strategyId }) => {
          const {
            strategies: { strategies },
          } = await this._plannerService.getStrategies().toPromise();

          const savedStrategy = strategies.find(
            (el) => el.strategyId === strategyId
          );
          this.selectedStrategy = savedStrategy;
          this._store.setTargetStrategy(savedStrategy);
        }),
        finalize(() => {
          this._cdRef.detectChanges();
        })
      )
      .subscribe(() => { });
  }

  onDeleteStrategy(strategy) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = '176px';
    dialogConfig.position = { top: '32px' };
    dialogConfig.data = {
      msg: `Are you sure you want to delete strategy ${strategy.name}?`,
      operation: 'delete',
    };
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'confirm-dialog';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(() => {
          this.deletingStrategy.push(strategy.strategyId);
        }),
        mergeMap(() =>
          this._plannerService.deleteStrategy(strategy.strategyId)
        ),
        mergeMap(() => this._plannerService.getStrategies()),
        finalize(() => {
          this._cdRef.detectChanges();

          if(!this.strategies.length){
            this._store.setTargetStrategy({emptyStrategy: true});
          }
        })
      )
      .subscribe(() => {this.deletingStrategy = []});
  }

  openStrategyDialog(): void {
    const dialogConfig = new MatDialogConfig();

    if (window.innerWidth > 1024) {
      dialogConfig.width = '1024px';
    } else {
      dialogConfig.width = '800px';
    }
    // dialogConfig.maxWidth = '90%';
    dialogConfig.height = '800px';
    dialogConfig.position = { top: '32px' };
    dialogConfig.data = {
      strategies: this.sampleStrategies
    };
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'strategy-dialog';

    const dialogRef = this.dialog.open(StrategyDialogComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        finalize(() => {
          this._cdRef.detectChanges();
        })
      )
      .subscribe(({ result }) => {
        delete result.userId;
        delete result.strategyId;
        result.statsFilter = JSON.stringify(result.statsFiltersList);

        this.strategies.push(result);
        this.selectedStrategy = result;
        this._store.setTargetStrategy(result);
        this.onSaveStrategy();
      }, error => {
        console.error(error);
      });
  }

  isActiveStrategy(strategy): boolean {
    if (this.selectedStrategy && strategy) {
      return this.selectedStrategy.strategyId === strategy.strategyId;
    }
    return false;
  }

  isTargetStrategyChanged(): boolean {
    if (!this.strategies) {
      return false;
    }

    return this.strategies.findIndex(val => {
      return JSON.stringify(val) == JSON.stringify(this.selectedStrategy);
    }) == -1;
  }
}
