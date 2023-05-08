import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';
import ChartistThreshold from 'chartist-plugin-threshold'

export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  selector: 'app-momentum-line-chart',
  templateUrl: './momentum-line-chart.component.html',
  styleUrls: ['./momentum-line-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MomentumLineChartComponent implements OnInit {
  @Input() dataOptions: any;

  public chart: Chart;
  private _infoKeys = [
    { key: 'awayGoals', team: 'away', code: 'goal' },
    { key: 'awayCorners', team: 'away', code: 'corner' },
    { key: 'awayRedCards', team: 'away', code: 'redCard' },
    { key: 'awayYellowCards', team: 'away', code: 'yellowCard' },
    { key: 'awayShotsOffTarget', team: 'away', code: 'offTarget' },
    { key: 'awayShotsOnTarget', team: 'away', code: 'onTarget' },
    { key: 'homeGoals', team: 'home', code: 'goal' },
    { key: 'homeCorners', team: 'home', code: 'corner' },
    { key: 'homeRedCards', team: 'home', code: 'redCard' },
    { key: 'homeYellowCards', team: 'home', code: 'yellowCard' },
    { key: 'homeShotsOffTarget', team: 'home', code: 'offTarget' },
    { key: 'homeShotsOnTarget', team: 'home', code: 'onTarget' },
  ];
  dataSeriesArray: any = [];

  constructor() { }

  ngOnInit(): void {
    let {gameTime} = this.dataOptions;
    if (gameTime > 90) gameTime = 90;
    // filter value of main game time (<=90 min)
    const dataSeries1 = this.dataOptions.chart.filter((data,index) =>
      (index <= gameTime));
    // set graph value using maxvalue
    let maxValue = -1;
    maxValue = this.findMax(dataSeries1, maxValue);
    let dataSeries = dataSeries1.
      map(val => Number(val)/maxValue);
    dataSeries.push(0);
    // set grey line
    let data = [];
    for(var i = 0; i <= 90; i++) {
      if(i > gameTime){
        data.push(0.05);
      }
      else data.push(null);
    }
    this.dataSeriesArray.push({
      name: 'greyline',
      data: data,
      className: 'greyline'
    });

    // get additional info
    const {statsTimeInfo} = this.dataOptions;
    this._infoKeys.forEach(value => {
      let data = [];
      if(statsTimeInfo[value.key].length){
        for(var i = 0; i <= 90; i++) {
          if(statsTimeInfo[value.key].includes(i)){
            (value.team == 'home')?data.push(1):data.push(-1);
          }
          else data.push(null);
      }
      this.dataSeriesArray.push({
        name: value.code,
        data: data,
        className: value.code,
      });
      }

    })

    this.dataSeriesArray.push({
      name: 'momentum',
      data: dataSeries,
      className: 'momentum'
    });
    this.chart = {
      data: {series: this.dataSeriesArray},
      options: {
        series: {
          'greyline': {
            showPoint: false
          },
          'goal': {
            showPoint: true
          },
          'corner': {
            showPoint: true
          },
          'redCard': {
            showPoint: true
          },
          'yellowCard': {
            showPoint: true
          },
          'offTarget': {
            showPoint: true
          },
          'onTarget': {
            showPoint: true
          },
          'momentum': {
            showPoint: false
          }
        },
        // width: '500px',
        height: '80px',
        showArea: false,
        axisY: {
          showLabel: false,
          showGrid: false,
          onlyInteger: true
        },
        showLine: true,
        fullWidth: true,
        axisX: {
          showLabel: false,
          showGrid: false
        },
        plugins: [
          ChartistThreshold({
            threshold: 0
          })
        ],
      },
      type: 'Line'

    };
  }

  findMax(array: any, current: number): number {
    let maxValue = current;

    array.forEach(value => {
      if (maxValue < Math.abs(value)) {
        maxValue = Math.abs(value);
      }
    });
    return maxValue;
  }

}
