import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _notes$: BehaviorSubject<any> = new BehaviorSubject(null);
  notes = this._notes$.asObservable();

  private _predictions$: BehaviorSubject<any> = new BehaviorSubject(null);
  predictions = this._predictions$.asObservable();

  private _strategies$: BehaviorSubject<any> = new BehaviorSubject(null);
  strategies = this._strategies$.asObservable();

  private _upcomingMatches$: BehaviorSubject<any> = new BehaviorSubject(null);
  upcomingMatches = this._upcomingMatches$.asObservable();

  private _teamImages$: BehaviorSubject<any> = new BehaviorSubject(null);
  teamImages = this._teamImages$.asObservable();

  private _targetMatch$: BehaviorSubject<any> = new BehaviorSubject(null);
  targetMatch = this._targetMatch$.asObservable();

  private _targetPrediction$: BehaviorSubject<any> = new BehaviorSubject(null);
  targetPrediction = this._targetPrediction$.asObservable();

  private _targetStrategy$: BehaviorSubject<any> = new BehaviorSubject(null);
  targetStrategy = this._targetStrategy$.asObservable();

  private _strategyMatches$: BehaviorSubject<any> = new BehaviorSubject(null);
  strategyMatches = this._strategyMatches$.asObservable();

  private _favouriteMatches$: BehaviorSubject<any> = new BehaviorSubject(null);
  favouriteMatches = this._favouriteMatches$.asObservable();

  private _leagues$: BehaviorSubject<any> = new BehaviorSubject(null);
  leagues = this._leagues$.asObservable();

  private _alertsHistory$: BehaviorSubject<any> = new BehaviorSubject(null);
  alertsHistory = this._alertsHistory$.asObservable();

  private _sampleStrategies$: BehaviorSubject<any> = new BehaviorSubject(null);
  sampleStrategies = this._sampleStrategies$.asObservable();

  private _scannerLayouts$: BehaviorSubject<any> = new BehaviorSubject(null);
  scannerLayouts = this._scannerLayouts$.asObservable();

  private _filters$: BehaviorSubject<any> = new BehaviorSubject(null);
  Filters = this._filters$.asObservable();

  constructor() {}

  setNotes(notes) {
    this._notes$.next(notes);
  }

  setPredictions(predictions) {
    this._predictions$.next(predictions);
  }

  setStrategies(strategies) {
    this._strategies$.next(strategies);
  }

  setUpcomingMatches(matches) {
    this._upcomingMatches$.next(matches);
  }

  setTeamImages(teamImages) {
    this._teamImages$.next(teamImages);
  }

  setTargetMatch(match) {
    this._targetMatch$.next(match);
  }

  setTargetPrediction(prediction): void {
    this._targetPrediction$.next(prediction);
  }

  setTargetStrategy(strategy): void {
    this._targetStrategy$.next(strategy);
  }

  setStrategyMatches(strategyMatches): void {
    this._strategyMatches$.next(strategyMatches);
  }

  setFavouriteMatches(favouriteMatches): void {
    this._favouriteMatches$.next(favouriteMatches);
  }

  setLeagues(leagues): void {
    this._leagues$.next(leagues);
  }

  setAlertsHistory(alerts): void {
    this._alertsHistory$.next(alerts);
  }

  setSampleStrategies(strategies): void {
    this._sampleStrategies$.next(strategies);
  }

  setScannerLayouts(layouts): void {
    this._scannerLayouts$.next(layouts);
  }

  setFilters(option): void {
    this._filters$.next(option);
  }
}
