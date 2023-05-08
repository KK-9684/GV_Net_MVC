import { Component, Input, OnInit } from '@angular/core';
import { MatAccordion } from "@angular/material/expansion";
import { generateMomentumGraphConfig } from '../../util';
@Component({
  selector: 'app-icon-information-popup',
  templateUrl: './icon-information-popup.component.html',
  styleUrls: ['./icon-information-popup.component.scss']
})
export class IconInformationPopupComponent implements OnInit {

  constructor() { }
  
  @Input() strategy: any;

  icon_information = [
    {
      title: 'OVERALL',
      icons: [
        { src: 'assets/img/sort-arrow.png', text: 'Sort Arrow (ASC or DESC)'},
        { src: 'assets/img/note.png', text: 'You have made some notes here'},
        { src: 'assets/img/prevstats.png', text: 'All stats in the last X minutes'},
      ] 
    },
    {
      title: 'STAT ICONS',
      icons: [
        { src: 'assets/img/psd/shots_on.png', text: 'Shots on target'},
        { src: 'assets/img/psd/shots_off.png', text: 'Shots off target'},
        { src: 'assets/img/psd/attack.png', text: 'Attacks Total'},
        { src: 'assets/img/psd/d_attack.png', text: 'Dangerous Attacks'},
        { src: 'assets/img/psd/corner.png', text: 'Corners'},
        { src: 'assets/img/psd/game_time.png', text: 'Game time'},
        { src: 'assets/img/psd/possession.png', text: 'Possession'},
        { src: 'assets/img/psd/red_card.png', text: 'Red cards'},
        { src: 'assets/img/psd/yellow_card.png', text: 'Yellow cards'},
      ] 
    },
    {
      title: 'PREV STATS',
      icons: [
        { src: 'assets/img/psd/shots_on.png', text: 'Last Shots on target'},
        { src: 'assets/img/psd/shots_off.png', text: 'Last Shots off target'},
        { src: 'assets/img/psd/attack.png', text: 'Last Attacks Total'},
        { src: 'assets/img/psd/d_attack.png', text: 'Last Dangerous Attacks'},
        { src: 'assets/img/psd/corner.png', text: 'Last Corners'},
        { src: 'assets/img/psd/ball.png', text: 'Last Goals'},
        { src: 'assets/img/psd/pressure.png', text: 'Pressure'},
      ] 
    },
    {
      title: 'STATS AREA HIGHLIGHTS',
      icons: [
        { src: 'assets/img/high-stats.png', text: 'One team has dominating stats(> 2.7x)'},
        { src: 'assets/img/medium-stats.png', text: 'One team has much better stats(> 1.9x)'},
        { src: 'assets/img/low-stats.png', text: 'One team has slightly better stats(> 1.4x)'},
      ]
    }
  ];

  chartSettings: any;
  statisticsInfo = [
    { key: 'yellowCard', text: 'Yellow Card' },
    { key: 'redCard', text: 'Red Card' },
    { key: 'offTarget', text: 'Shots off Target' },
    { key: 'onTarget', text: 'Shots on Target' },
    { key: 'corner', text: 'Corner' },
    { key: 'goal', text: 'Goal' },
  ];

  ngOnInit(): void {
    this.chartSettings = generateMomentumGraphConfig(this.strategy);
  }
}
