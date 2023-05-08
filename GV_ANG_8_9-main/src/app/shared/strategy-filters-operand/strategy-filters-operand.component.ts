import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MATCH_METRIC,
  METRIC_TEAMS,
  ODDS,
  TEMPORAL_RANGE,
  Val,
} from './filters';

@Component({
  selector: 'app-strategy-filters-operand',
  templateUrl: './strategy-filters-operand.component.html',
  styleUrls: ['./strategy-filters-operand.component.scss']
})
export class StrategyFiltersOperandComponent implements OnInit {

  @Input() type: string;

  Val1: Val;
  Val2: Val;
  metrics = MATCH_METRIC;
  teams = METRIC_TEAMS;
  ranges = TEMPORAL_RANGE;
  odds = ODDS;

  valueType: string;
  metricSelected: boolean ;
  teamSelected: boolean ;
  rangeFrom: boolean ;
  rangeTo: boolean ;
  rangeSecondFrom: boolean ;
  rangeSecondTo: boolean ;
  oddSelected: boolean ;
  extend: string ;
  secondValueType:string ;
  metricSecondSelected: boolean ;
  teamSecondSelected: boolean ;
  oddSecondSelected: boolean ;
  operator: string;
  val1from: string ;
  val2from: string ;
  val1to: string;
  val2to: string;

  constructor(public dialog:MatDialog) { }

  ngOnInit(): void {
    this._setVariables();
  }

  private _setVariables():void {
    this.valueType = this.type=='left'?'2':'1';
    this.Val1 = new Val();
    this.Val2 = new Val();
    this.operator = '';
    this.metricSelected= false;
    this.teamSelected = false;
    this.rangeFrom = false;
    this.rangeTo = false;
    this.rangeSecondFrom = false;
    this.rangeSecondTo = false;
    this.oddSelected = false;
    this.extend = '1';
    this.secondValueType = '1';
    this.metricSecondSelected = false;
    this.teamSecondSelected = false;
    this.oddSecondSelected = false;
    this.operator = '';
    this.val1from = '';
    this.val2from = '';
    this.val1to = '';
    this.val2to = '';
  }

  //Method for handle selectionChange
  handleMetricSelect(event, valstr) {
    let val = event.value;
    let valString = event.source.triggerValue;
    if (valstr == 'Val1') this.metricSelected = true;
    else  this.metricSecondSelected = true;
    if (val == 'timer' ) {
      if (valstr == 'Val1'){
        this.metricSelected = false;
        this.teamSelected = false;
      }
      else {
        this.metricSecondSelected = false;
        this.teamSecondSelected = false;
      }
    }
    this[valstr].previewStr1 = valString;
  }

  handleTeamSelect(event, valstr) {
    let val = event.value;
    let valString = event.source.triggerValue;
    if (val == 's') this[valstr].previewStr2 = '';
    else this[valstr].previewStr2 = ' of '+valString;
    if (valstr == 'Val1') this.teamSelected = true;
    else this.teamSecondSelected = true;
  }

  handleOddChange(event) {
    let val = event.value;
    let valString = event.source.triggerValue;
    this.oddSelected = true;
    if (val.includes('Tie')) {
      this.oddSelected = false;
    }
    this.Val1.previewStr1 = valString;
  }
  handleSecondOddChange(event) {
    let val = event.value;
    let valString = event.source.triggerValue;
    this.oddSecondSelected = true;
    if (val.includes('Tie')) {
      this.oddSecondSelected = false;
    }
    this.Val2.previewStr1 = valString;
  }

  handleConstantChange(value, valstr) {
    this[valstr].reference = '';
    this[valstr].previewStr1 = value;
    this[valstr].previewStr2 = '';
    this[valstr].previewStr3 = '';
  }

  handleRangeChange(event, valstr) {
    let val = event.value;
    let valString = event.source.triggerValue;
    this[valstr].rangeValue = val;

    if (val == 'disabled' || val == 'fh'|| val == 'sh'|| val == 'ht'|| val == 'ft' ) {
      if(valstr == 'Val1'){
        this.rangeFrom = false;
        this.rangeTo = false;
      }
      else {
        this.rangeSecondFrom = false;
        this.rangeSecondTo = false;
      }
      this[valstr].timerPeriod = val;
    }
    else if (val == 'range') {
      if(valstr == 'Val1'){
        this.rangeFrom = true;
        this.rangeTo = true;
        this.val1from = '';
        this.val1to = '';
      }
      else {
        this.rangeSecondFrom = true;
        this.rangeSecondTo = true;
        this.val2from = '';
        this.val2to = '';
      }
    }
    else {
      if(valstr == 'Val1'){
        this.rangeFrom = true;
        this.rangeTo = false;
        this.val1from = '';
        this.val1to = '';
      }
      else {
        this.rangeSecondFrom = true;
        this.rangeSecondTo = false;
        this.val2from = '';
        this.val2to = '';
      }
    }
    this._setPreviewStr3(valstr, val, valString);
  }

  private _setPreviewStr3(valstr: string, val: string, valString?: string){
    if(valstr == 'Val1')
      this[valstr].previewStr3 = this._getPreviewStr3(val, valString, this.val1from, this.val1to);
    else
      this[valstr].previewStr3 = this._getPreviewStr3(val, valString, this.val2from, this.val2to);
  }

  private _getPreviewStr3(val: string, valString?: string, valfrom?:string, valto?:string): string {
    if (val == 'disabled')
      return '';
    else if (val == 'fh' || val == 'sh' || val == 'ht' || val == 'ft')
      return ' ' + valString;
    else if (val == 'range')
      return ' between the minutes ' + valfrom + ' and ' + valto;
    else if(val == 'exm')
      return ' at minute ' + valfrom;
    else if(val == 'mag')
      return ' '+valfrom+' minute(s) ago';
    else if(val == 'offset')
      return ' in the past ' + valfrom + ' minutes';
    else if(val == 'cof')
      return ' since minute ' + valfrom;
    else if(val == 'cot')
      return ' until minute '+ valfrom;
  }

  handleFrom(event, valstr, selectval) {
    let val = Number(event.target.value);
    let rangeValue = this[valstr].rangeValue;
    if (rangeValue == 'range') this[valstr].timeRangeFrom = val;
    else if(rangeValue == 'offset') this[valstr].timerOffset = val;
    else this[valstr][rangeValue] = val;
    this._setPreviewStr3(valstr, selectval.value, selectval.triggerValue);
  }
  handleTo(event, valstr, selectval){
    let val = Number(event.target.value);
    this[valstr].timeRangeTo = val;
    this._setPreviewStr3(valstr, selectval.value, selectval.triggerValue);
  }

  handleExtend(event) {
    let val = event.value;
    if (val == '1') {
      this.operator = '';
      this.Val2.previewStr1 = '';
      this.Val2.previewStr2 = '';
      this.Val2.previewStr3 = '';
    }
    else if (val == '+') this.operator = '+';
    else if (val == '-') this.operator = '-';
    else if (val == '*') this.operator = 'x';
    else if (val == '/') this.operator = '÷';
    else if (val == '^') this.operator = '^';
    // else if (val == 'rt') this.operator = '√';
    else if (val == '%') this.operator = 'mod';
  }
  handleValueTypeChange(value,valstr){
    if(value == '1') {
      this[valstr].reference = '';
      this[valstr].previewStr1 = this.Val1.constant;
      this[valstr].previewStr2 = '';
      this[valstr].previewStr3 = '';
      this.operator = '';
    }
    else {
      this[valstr].previewStr1 = '';
      this[valstr].previewStr2 = '';
      this[valstr].previewStr3 = '';
    }
  }
  // Method for dialog
  openTeamDialog() {
    this.dialog.open(TeamDialog);
  }

  openRangeDialog() {
    this.dialog.open(RangeDialog);
  }

}
@Component({
  selector: 'team-dialog',
  templateUrl: 'team-dialog.html',
})
export class TeamDialog { }

@Component({
  selector: 'range-dialog',
  templateUrl: 'range-dialog.html',
})
export class RangeDialog {}
