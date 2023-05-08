import { Component, OnInit } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { StateService } from 'src/app/core/services';

@Component({
  selector: 'app-strategy-tab',
  templateUrl: './strategy-tab.component.html',
  styleUrls: ['./strategy-tab.component.scss'],
})
export class StrategyTabComponent implements OnInit {
  strategies: any;
  targetStrategy: any;
  constructor(private readonly _store: StateService) {}

  ngOnInit(): void {
    // this._getTargetStrategy();
    this._getStrategies();
  }

  private _getTargetStrategy(): void {
    this._store.targetStrategy
      .pipe(
        filter(Boolean),
        tap((strategy) => {
          this.targetStrategy = strategy;
        })
      )
      .subscribe(() => {

        if(this.targetStrategy.emptyStrategy){
        //  console.log('in');
        this.strategies = false;
        } else {
          // console.log('out');
          this.strategies = true;
        }
      });
  }

  private _getStrategies(): void {
    this._store.strategies
      .pipe(
        filter(Boolean),
        tap((strategies: any) => {
          this.strategies = (strategies.length)?true:false;
        }),
      )
      .subscribe(() => {
        if(!this.strategies) this._getTargetStrategy();
      });
  }
}
