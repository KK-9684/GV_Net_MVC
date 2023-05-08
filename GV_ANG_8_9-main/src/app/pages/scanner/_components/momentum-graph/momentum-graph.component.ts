import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';

import { ChartOptions, ChartType, ChartDataSets, Chart } from 'chart.js';
import { Label } from 'ng2-charts';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { environment } from 'src/environments/environment';
import { drawSplineChart } from './barChart';
import { MOMENTUM_WIDTH, CHART_SETTINGS, GRID_ROW_HEIGHT } from '../config/grid-settings-config';

@Component({
  selector: 'app-momentum-graph',
  templateUrl: './momentum-graph.component.html',
  styleUrls: ['./momentum-graph.component.scss']
})
export class MomentumGraphComponent implements AfterViewInit, OnInit {
  @Input() dataOptions: any;
  @Input() graphWidth: any;
  @ViewChild('canvas') canvas: ElementRef;

  public barChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: { enabled: false },
    hover: {},
    scales: {
      xAxes: [
        {
          display: false,
        }
      ],
      yAxes: [{
        display: false,
        ticks: {
          suggestedMin: -5,
          suggestedMax: 5
      }
      }],
    },
    annotation: {
      annotations: [{
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: 0,
        borderColor: 'gray',
        borderWidth: 1,
        label: {
          enabled: false,
          content: 'Test label'
        }
      }]
    }
  };

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[] = [
    {
      data: [65, 59, 80, 81, 56],
      backgroundColor: ['#00b894', '#00b894', '#00b894', '#00b894', '#00b894']
    }
  ];

  offsetX = 20;
  offsetY = 10;
  barWidth = 11;
  barHeight = 80;
  centerY = this.offsetY + this.barHeight;

  momentumWidth;
  momentumHeight = GRID_ROW_HEIGHT;
  canvasWidth = this.barWidth * 120 + this.offsetX * 2;
  canvasHeight = (this.barHeight + this.offsetY) * 2;

  constructor() { }

  isLight() {
    return environment.theme == 'light'
  }

  ngOnInit(): void {
    this.momentumWidth = this.graphWidth ? this.graphWidth : MOMENTUM_WIDTH;
    let namedChartAnnotation = ChartAnnotation;

    namedChartAnnotation["id"]="annotation";
    Chart.pluginService.register( namedChartAnnotation);
    // Sets Momentum Height
    if (this.dataOptions.rowHeight) {
      this.momentumHeight = this.dataOptions.rowHeight;
    }

    if (this.dataOptions) {
      const { chart, gameTime } = this.dataOptions;
      let colors = [], index = 0;
      let maxVal = 0;

      this.barChartData[0].data = chart;
      this.barChartData[0].backgroundColor = colors;
      // this.barChartData[0].barPercentage=2.0
      this.barChartData[0].categoryPercentage = 0.5;

      for (index = 0; index <= 90; index ++) {
        this.barChartLabels.push(index + '');
        if (chart[index] < 0) {
          colors.push('red');
        } else {
          colors.push('#00b894');
        }
        if (Math.abs(chart[index]) > maxVal) {
          maxVal = Math.abs(chart[index]);
        }
      }

      // set min and max val for chart
      this.barChartOptions.scales.yAxes[0].ticks.suggestedMin = -maxVal;
      this.barChartOptions.scales.yAxes[0].ticks.suggestedMax = maxVal;

      // draw annotations
      // this.barChartOptions.annotation.annotations.push()

    }
  }

  ngAfterViewInit(): void {
    const element = this.canvas.nativeElement;
    const context = element.getContext('2d');
    let gameTime = this.dataOptions.gameTime;

    // if (gameTime > 90) {
      gameTime = 90;
    // }

    this.barWidth = (this.canvasWidth - this.offsetX * 2) / gameTime;

    const { offsetX, offsetY, barWidth, barHeight, centerY } = this;
    const { strategy } = this.dataOptions;

    drawSplineChart(this.dataOptions, context, { offsetX, offsetY, barWidth, barHeight, centerY, gameTime, strategy});
  }


}
