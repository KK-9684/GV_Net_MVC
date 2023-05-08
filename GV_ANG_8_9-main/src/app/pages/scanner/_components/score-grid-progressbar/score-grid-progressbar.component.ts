import { Component, Input, OnInit } from '@angular/core';
import { ScannerStoreService } from '../../scanner-store.service';

@Component({
  selector: 'app-score-grid-progressbar',
  templateUrl: './score-grid-progressbar.component.html',
  styleUrls: ['./score-grid-progressbar.component.scss']
})
export class ScoreGridProgressbarComponent implements OnInit {

  @Input()
  str;
  @Input()
  valHome;
  @Input()
  valAway;
  @Input()
  opacity;

  max: number;
  width: number;
  opt: number;
  strategies: any = [];

  constructor(
    private _localStore: ScannerStoreService
  ) {
    this.getStrategies();
  }

  ngOnInit(): void {
    this.max = Number(this.valHome) + Number(this.valAway);
    this.width = this.valHome / this.max * 100;
    this.opt = (this.opacity)? .2:1;

  }

  getStrategies(): void {
    this._localStore.strategies.subscribe(strategies => {
      this.strategies = JSON.parse(strategies[0].imageExportConfig.replace("/\/g", ""));
    });
  }

}
