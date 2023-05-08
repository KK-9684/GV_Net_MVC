import { Component, Input, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-column-visibility-show',
  templateUrl: './column-visibility-show.component.html',
  styleUrls: ['./column-visibility-show.component.scss']
})
export class ColumnVisibilityShowComponent implements OnInit {

  constructor() {
    this._setVariables();
  }

  @Input() selectedStrategy: any;
  mainColumns: any[];
  prevStatsColumns: any[];
  miscColumns: any[];
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century'
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
  }

  private _setVariables(): void {
    this.selectedStrategy = {};

    this.mainColumns = [
      { label: 'Time', key: 'mainTime' },
      { label: 'Score', key: 'mainScore' },
      { label: 'Teams', key: 'mainTeams' },
      { label: 'Live Odds', key: 'mainOdds' },
      { label: 'Shots on Target', key: 'mainSonT' },
      { label: 'Shots off Target', key: 'mainSoffT' },
      { label: 'Attacks', key: 'mainAttacks' },
      { label: 'Dangerous Attacks', key: 'mainDangerousAttacks' },
      { label: 'Attack Conversion', key: 'mainAttackConversion' },
      { label: 'Corners', key: 'mainCorners' },
      { label: 'Possessions', key: 'mainPossession' },
      { label: 'Yellow Cards', key: 'mainYellowCards' },
    ];
    this.prevStatsColumns = [
      { label: 'Shots on Target', key: 'previousSonT' },
      { label: 'Shots off Target', key: 'previousSoffT' },
      { label: 'Attacks', key: 'previousAttacks' },
      { label: 'Dangerous Attacks', key: 'previousDangerousAttacks' },
      { label: 'Corners', key: 'previousCorners' },
      { label: 'Goals', key: 'previousGoals' },
      { label: 'Intensity', key: 'previousIntensity' },
    ];
    this.miscColumns = [
      { label: 'Momentum', key: 'miscMomentum' },
      { label: 'Alerts', key: 'miscAlerts' },
      { label: 'Delete', key: 'miscDelete' },
    ];
  }
}
