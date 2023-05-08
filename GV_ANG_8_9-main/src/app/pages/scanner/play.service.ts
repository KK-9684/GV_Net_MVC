import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ENDPOINTS } from './endpoints'
import { map, mergeMap, tap } from "rxjs/operators"
import * as moment from 'moment'; // add this 1 of 4
import { ApiService } from 'src/app/core/services/api.service';
import { StateService } from 'src/app/core/services/state.service';
import { ScannerStoreService } from './scanner-store.service';

@Injectable({
  providedIn: 'root'
})
export class PlayService {

  constructor(private readonly _api: ApiService, private http: HttpClient, private _rootStore: StateService, private _localStore: ScannerStoreService) { }

  getPlayResults(){
    return this.http.get(ENDPOINTS.GET_ALL_PLAY_URL).pipe(
      map((data)=>{
        data['kickOffTime'] = moment(data['kickOffTime']);
        return data;
      })
    ).toPromise()
  }

  getPredictionsManagerResults(){
    return this.http.get(ENDPOINTS.GET_PREDICTION_PLAY_URL).pipe(
      map((data)=>{
        data['kickOffTime'] = moment(data['kickOffTime']);
        return data;
      })
    )
  }

  getStrategyResults() {
    return this.http.get(ENDPOINTS.GET_STRATEGY).pipe(
      map((data)=>{
        return data['strategies'].strategies;
      })
    )
  }

  getHistoricalMatches(data){
    let httpParams = new HttpParams();

    httpParams = data.homeId ? httpParams.append('homeId',data.homeId) : httpParams;
    httpParams = data.awayId ? httpParams.append('awayId',data.awayId) : httpParams;
    return this.http.get(ENDPOINTS.GET_HISTORICAL_MATCHES_URL,{ params: httpParams }).pipe(
      map((data)=>{
        data['kickOffTime'] = moment(data['kickOffTime']).toDate();
        return data;
      })
    )
  }

  getStartupData() {
    return this.http.get(ENDPOINTS.GET_STARTUP).pipe(
      map(data => data['scannerStartup']),
      tap(data => {
        // this._localStore.setStrategies(data['strategies']);
        this._localStore.setStrategyMatches(data['strategyMatches']);
        return data['strategyMatches']
      })
    );
  }

  getStrategies() {
    return this._api.get('/strategies').pipe(
      map((res) => res.body),
      tap(({ strategies: { strategies } }) => {
        this._localStore.setStrategies(strategies);
        this._rootStore.setStrategies(strategies);
        this._rootStore.targetStrategy.subscribe((res)=>{})
      })
    );
  }

  getFavouriteMatches() {
    return this.http.get(ENDPOINTS.GET_FAVOURITE).pipe(
      map(data => data['favouriteMatches']['favouriteMatches'])
    );
  }

  saveStrategy(strategy) {
    return this.http.post(ENDPOINTS.SAVE_STRATEGY, strategy);
  }

  addFavouriteMatch(match) {
    return this.http
      .post(ENDPOINTS.GET_FAVOURITE, match)
      .pipe(mergeMap(() => this.getFavouriteMatches()))
      .toPromise();
  }

  deleteFavouriteMatch(favouriteMatchId) {
    return this.http
      .delete(`${ENDPOINTS.GET_FAVOURITE}?favouriteMatchId=${favouriteMatchId}`)
      .pipe(mergeMap(() => this.getFavouriteMatches()))
      .toPromise();
  }

  getCustomLayouts() {
    return this.http.get(ENDPOINTS.GET_LAYOUT).pipe(
      map((res) => res['layouts']['layouts']),
      tap((layouts) => {
        layouts.forEach(layout => {
          layout.structure = JSON.parse(layout.structure);
        });
        this._rootStore.setScannerLayouts(layouts);
      })
    )
  }

  deleteCustomLayout(id){
    return this.http
      .delete(`${ENDPOINTS.GET_LAYOUT}?layoutId=${id}`)
      .pipe(mergeMap(() => this.getCustomLayouts()));
  }

  saveCustomLayout(customLayout) {
    return this.http
      .post(`${ENDPOINTS.GET_LAYOUT}`, customLayout)
      .pipe(
        mergeMap(() => this.getCustomLayouts())
      );

    // return this._api
    //   .post('/layouts', customLayout)
    //   .pipe(
    //     mergeMap(() => this.getCustomLayouts())
    //   );
  }
}
