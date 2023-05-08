import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScannerStoreService {
  private _strategies$: BehaviorSubject<any> = new BehaviorSubject(null);
  strategies = this._strategies$.asObservable();

  private _sortInfo$: BehaviorSubject<any> = new BehaviorSubject(null);
  sortInfo = this._sortInfo$.asObservable();

  private _strategyMatches$: BehaviorSubject<any> = new BehaviorSubject(null);
  strategyMatches = this._strategyMatches$.asObservable();

  private _scrollPosition$: BehaviorSubject<any> = new BehaviorSubject(null);
  scrollPosition = this._scrollPosition$.asObservable();

  private _searchValue$: BehaviorSubject<any> = new BehaviorSubject(null);
  searchValue = this._searchValue$.asObservable();

  private _lastTimeSelection$: BehaviorSubject<any> = new BehaviorSubject(null);
  lastTimeSelection = this._lastTimeSelection$.asObservable();

  private _graphType$: BehaviorSubject<any> = new BehaviorSubject(null);
  graphType = this._graphType$.asObservable();

  setStrategies(strategies): void {
    this._strategies$.next(strategies);
  }

  setStrategyMatches(strategyMatches): void {
    this._strategyMatches$.next(strategyMatches);
  }

  setSortInfo(sortInfo): void {
    this._sortInfo$.next(sortInfo);
  }

  setScrollPosition(position): void {
    this._scrollPosition$.next(position);
  }

  setSearchValue(value): void {
    this._searchValue$.next(value);
  }

  setLastTimeSelection(value): void {
    this._lastTimeSelection$.next(value);
  }

  setGraphType(type): void {
    this._graphType$.next(type);
  }

}
