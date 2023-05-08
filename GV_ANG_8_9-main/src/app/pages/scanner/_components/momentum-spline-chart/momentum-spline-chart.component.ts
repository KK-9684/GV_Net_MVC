import {
  OnChanges,
  SimpleChanges,
  NgZone,
  PLATFORM_ID,
  Inject,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Component, Input, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4plugins_bullet from '@amcharts/amcharts4/plugins/bullets';

import { MAX_SPLINE_WIDTH } from '../config/grid-settings-config';
declare var $: any;

@Component({
  selector: 'app-momentum-spline-chart',
  templateUrl: './momentum-spline-chart.component.html',
  styleUrls: ['./momentum-spline-chart.component.scss'],
})
export class MomentumSplineChartComponent
  implements OnChanges, AfterViewInit, OnDestroy {
  // value injection
  @Input() dataOptions = {
    home: [],
    away: [],
    labels: [],
    homeName: '',
    awayName: '',
    gameTime: 0,
    statsTimeInfo: null
  };

  @Input() labels = [];
  @Input() strategy: any;
  @Input() graphNumber: string;
  @Input() position: any;

  homeColor = '#52B030';
  awayColor = '#006DCC';
  background = 'white';
  goal = '';

  // @ViewChild('chart') chart: Chart;
  private chart: am4charts.XYChart;

  constructor(
    public ref: ElementRef,
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone
  ) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  canvasWidth: number = 600;

  ngAfterViewInit(): void {
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create(`chartdiv${this.graphNumber}`, am4charts.XYChart);

      chart.data = [];

      // Creat Time Axis
      let timeAxis = chart.xAxes.push(new am4charts.CategoryAxis());

      timeAxis.dataFields.category = 'time';
      timeAxis.renderer.minGridDistance = 20;

      // Create Attack Pressure Asix
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      valueAxis.tooltip.disabled = true;

      const configNumber = this.graphNumber[this.graphNumber.length - 1];
      const configName = `p${configNumber}GraphConfig`;

      if (this.strategy && this.strategy[configName]) {
        const graphConfig = JSON.parse(
          this.strategy[configName]
        );
        const configKeys = [
          { local: 'homeColor', remote: 'Home' },
          { local: 'awayColor', remote: 'Away' },
          { local: 'background', remote: 'Background' },
          { local: 'goal', remote: 'Goal' },
        ];

        configKeys.forEach(key => {
          if (0 !== graphConfig[key.remote].length) {
            this[key.local] = graphConfig[key.remote];
          }
        });
      }

      // Create series for Team 1
      const attr = {
        color: this.homeColor,
        strokeWidth: 3,
        datafield: 'value1',
        xAxis: timeAxis,
        yAxis: valueAxis,
        goal: 'homeGoal'
      }
      let series1 = chart.series.push(new am4charts.LineSeries());

      this.setSeriesAttributes(series1, attr);

      // Create series for Team 2
      let series2 = chart.series.push(new am4charts.LineSeries());

      attr.datafield = 'value2';
      attr.color = this.awayColor;
      attr.goal = 'awayGoal';
      this.setSeriesAttributes(series2, attr);

      // Set cursor behaviour none to disable zoom in
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = 'none';

      // Set Chart Legend Type
      chart.legend = new am4charts.Legend();
      chart.legend.useDefaultMarker = true;

      let markerTemplate = chart.legend.markers.template;

      markerTemplate.width = 10;
      markerTemplate.height = 10;
      markerTemplate.stroke = am4core.color("#ccc");
      markerTemplate.valign = "top";

      // Disable zoom out/in function
      chart.zoomOutButton.disabled = true;
      chart.logo.setVisibility(false);
      chart.paddingLeft = 0;
      chart.background.fill = am4core.color(this.background);

      this.chart = chart;
    });
  }

  setSeriesAttributes(series: am4charts.LineSeries, attr: any): void {
    const { color, strokeWidth, datafield, xAxis, yAxis, goal } = attr;

    series.dataFields.categoryX = 'time';
    series.dataFields.valueY = datafield;
    series.xAxis = xAxis;
    series.yAxis = yAxis;
    series.tooltipText = 'Value: {valueY}';
    series.fill = am4core.color(color);
    series.strokeWidth = strokeWidth;
    series.stroke = am4core.color(color);

    let bullet = series.bullets.push(new am4charts.Bullet());

    bullet.disabled = true;
    bullet.propertyFields.disabled = goal;

    let image = bullet.createChild(am4core.Image);

    image.href = `assets//img//psd//goal.png`;
    image.width = 10;
    image.height = 10;
    image.horizontalCenter = "middle";
    image.verticalCenter = "middle";
    image.dom.style.fill = color;
    image.adapter.add('verticalCenter', (center, target) => {
      if (!target.dataItem) {
        return center;
      }

      let values = target.dataItem.values;

      if (values.valueY.value > 5) {
        return 'middle';
      }
      return 'bottom';
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  isGoal(time: number, isHome: boolean) : boolean {
    const key = isHome ? 'homeGoals' : 'awayGoals';
    const goalTime = this.dataOptions.statsTimeInfo[key];
    const index = goalTime.findIndex(val => val === time);

    if (index === -1) {
      return false;
    }
    return true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.dataOptions) {
      let i;
      const gameTime = this.dataOptions.gameTime;
      const maxTime = Math.max(gameTime, 90);

      this.canvasWidth = (MAX_SPLINE_WIDTH / 120) * maxTime;

      this.browserOnly(() => {
        if (this.chart) {
          let data = [];

          for (i = 0; i <= maxTime; i++) {
            if (i < gameTime) {
              data.push({
                value1: this.dataOptions.home[i],
                value2: this.dataOptions.away[i],
                time: i
              });
            } else {
              data.push({ value1: 0, value2: 0, time: i });
            }
            data[i].homeGoal = !this.isGoal(i, true);
            data[i].awayGoal = !this.isGoal(i, false);
          }
          this.chart.data = data;
          this.chart.series.getIndex(0).name = this.dataOptions.homeName;
          this.chart.series.getIndex(1).name = this.dataOptions.awayName;
        }
      });
    }

    if (this.position == undefined) {
      return;
    }

    let tri_left = this.position.pos - 15;

    $('head').append(
      '<style>.info-panel:before{left:' + tri_left + 'px !important;}</style>'
    );
    $('head').append(
      '<style>.info-panel:after{left:' +
        (tri_left + 1) +
        'px !important;}</style>'
    );

    if (this.position.state == 0) {
      $('head').append(
        '<style>.info-panel:before, .info-panel:after{bottom: 100% !important; top: auto !important;}</style>'
      );
      $('head').append(
        '<style>.info-panel:before{border-bottom: 25px solid #146853 !important; border-top: none !important;}</style>'
      );
      $('head').append(
        `<style>.info-panel:after{border-bottom: 23px solid ${this.background} !important; border-top: none !important;}</style>`
      );
    } else {
      $('head').append(
        '<style>.info-panel:before, .info-panel:after{top: 100% !important; bottom: auto !important;}</style>'
      );
      $('head').append(
        '<style>.info-panel:before{border-top: 25px solid #146853 !important; border-bottom: none !important;}</style>'
      );
      $('head').append(
        `<style>.info-panel:after{border-top: 23px solid ${this.background} !important; border-bottom: none !important;}</style>`
      );
    }
  }
}
