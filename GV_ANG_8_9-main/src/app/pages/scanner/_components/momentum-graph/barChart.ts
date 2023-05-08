import { generateMomentumGraphConfig } from '../../util';

let CHART_SETTINGS: any;
/**
 * Method for drawing bar chart for given data
 * @param data chart data
 * @param ctx canvas context
 * @param chartOptions options for bar chart
 */
export function drawSplineChart(data, ctx, chartOptions) {
  const { offsetX, barWidth, barHeight, centerY, gameTime, strategy } = chartOptions;
  const lineColor = 'gray';
  const chart = data.chart;
  let i, length = chart.length;
  let maxValue = -1;

  CHART_SETTINGS = generateMomentumGraphConfig(strategy);

  // Find max value among the home and away values
  maxValue = findMax(chart, maxValue);

  const chartWidth = barWidth * gameTime;
  const chartHeight = barHeight * 2;
  const offsetY = centerY - barHeight;

  // Draw chart background
  ctx.save();
  ctx.fillStyle = CHART_SETTINGS.chartBackground;
  ctx.globalAlpha = 0.8;
  ctx.fillRect(offsetX, offsetY, chartWidth, chartHeight);
  ctx.restore();

  // Draw bar chart for home and away teams
  drawBarChart(data, ctx, chartOptions);

  // Draw center horizontal line and chartBorder
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.strokeRect(offsetX, centerY, chartWidth, 1);

  // ctx.strokeRect(offsetX, offsetY, chartWidth, chartHeight);
  ctx.restore();


  // Draw time line
  // ctx.save();
  // ctx.lineWidth = 1;
  // ctx.globalAlpha = 0.5;
  // ctx.setLineDash([10, 5]);
  // for (i = 1; i < length; i++) {
  //   if (i % 15 === 0) {
  //     const startX = offsetX + barWidth * i;

  //     ctx.beginPath();
  //     ctx.moveTo(startX, centerY - barHeight);
  //     ctx.lineTo(startX, centerY + barHeight);
  //     ctx.stroke();
  //     ctx.closePath();
  //   }
  // }
  // ctx.restore();

  // Draw Statistics Timings
  drawStatisticsTimings(data, ctx, chartOptions);

}

/**
 * Draws info circles for statisticsTimings on the bar chart
 * @param {Object} data chart data
 * @param {Object} ctx canvas context
 * @param {Object} chartOptions options for drawing barChart
 * @returns {void}
 */
function drawStatisticsTimings(data, ctx, chartOptions) {
  const { chart, statsTimeInfo } = data;
  const { barHeight, barWidth, centerY, offsetX } = chartOptions;
  const statsLine = { home: [], away: [] };
  const infoKeys = [
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
  const length = chart.length;
  let i;

  for (i = 0; i < length; i++) {
    statsLine.home.push([]);
    statsLine.away.push([]);
  };
  for (i = 0; i < infoKeys.length; i++) {
    const info = infoKeys[i];
    const statInfo = statsTimeInfo[info.key];

    statInfo.forEach(value => {
      statsLine[info.team][value].push(info.code);
    });
  }

  let maxValue = -1;

  maxValue = findMax(chart, maxValue);
  ctx.save();
  for (i = 0; i < length; i++) {
    const currentHeight = Math.abs(chart[i]) / maxValue * barHeight;
    const homeHeight = chart[i] > 0 ? currentHeight : 0;
    const awayHeight = chart[i] < 0 ? currentHeight : 0;
    const homeStatLength = statsLine.home[i].length;
    const awayStatLength = statsLine.away[i].length;
    const radius = barWidth / 2;
    const circleX = offsetX + barWidth * i + radius;

    statsLine.home[i].forEach((value, index) => {
      const color = CHART_SETTINGS[value];
      const reverseIndex = homeStatLength - index;
      let circleY = centerY - homeHeight * reverseIndex / homeStatLength + radius;

      if (Math.abs(circleY - centerY) < radius) {
        circleY = centerY - radius;
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(circleX, circleY, radius - 1, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    });
    statsLine.away[i].forEach((value, index) => {
      const color = CHART_SETTINGS[value];
      const reverseIndex = awayStatLength - index;
      let circleY = centerY + awayHeight * reverseIndex / awayStatLength - radius;

      if (Math.abs(circleY - centerY) < radius) {
        circleY = centerY + radius;
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(circleX, circleY, radius - 1, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    });
  }
  ctx.restore();
}

/**
 * Method for drawing bar chart for home and away teams
 * @param data chart data
 * @param ctx canvas context
 * @param chartOptions options for bar chart
 */
function drawBarChart(data, ctx, chartOptions): void {
  const { homeColor, awayColor } = CHART_SETTINGS;
  const chart = data.chart;
  const { offsetX, barWidth, barHeight, centerY, gameTime } = chartOptions;
  let i;
  let maxValue = -1;

  // Find max value among the home and away values
  maxValue = findMax(chart, maxValue);


  // Draw bar chart for home team
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = homeColor;
  for (i = 0; i < gameTime; i++) {
    const startX = offsetX + i * barWidth;
    let startY = 0;
    const currentHeight = Math.abs(chart[i]) / maxValue * barHeight;

    if (chart[i] >= 0) {
      ctx.fillStyle = homeColor;
      startY = centerY - currentHeight;
    } else {
      ctx.fillStyle = awayColor;
      startY = centerY;
    }
    ctx.fillRect(startX, startY, barWidth - 1, currentHeight)
  }

  ctx.restore();
}

function findMax(array: any, current: number): number {
  let maxValue = current;

  array.forEach(value => {
    if (maxValue < Math.abs(value)) {
      maxValue = Math.abs(value);
    }
  });
  return maxValue;
}

function getComplementoryColor(color): string {
  let textColor: string = 'black';

  if ('transparent' !== color && color && 0 !== color.length) {
    const textColorHex = 0xffffff - parseInt(color.slice(1), 16);
    textColor = '#' + textColorHex.toString(16);
  }
  return textColor;
}
