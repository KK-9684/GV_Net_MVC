import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList,
  Input,
} from '@angular/core';

import { Subject } from 'rxjs';
import {
  filter,
  tap,
  takeUntil
} from 'rxjs/operators';

import {
  Val,
  Operand,
  Filter
} from 'src/app/shared/strategy-filters-operand/filters';

import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';

import { StateService } from 'src/app/core/services';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { StrategyFiltersOperandComponent } from 'src/app/shared/strategy-filters-operand/strategy-filters-operand.component';
@Component({
  selector: 'app-strategy-filters',
  templateUrl: './strategy-filters.component.html',
  styleUrls: ['./strategy-filters.component.scss'],
})
export class StrategyFiltersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mygrid', { static: false }) myGrid: jqxGridComponent;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('leftOperand') leftOperand: StrategyFiltersOperandComponent;
  @ViewChild('rightOperand') rightOperand: StrategyFiltersOperandComponent;
  @ViewChildren(MatExpansionPanel) panels: QueryList<MatExpansionPanel>;
  @Input() disabled;
  type_left = 'left';
  type_right = 'right';
  filterdata: Filter;

  private _stop$: Subject<any>;

  strategy: any;

  filters: string[];
  statTypes: string[];
  filterTypes: any;
  statType: any;
  statFilterType: any;
  statFilterValue: any;

  goalsArr: number[];
  homeGoals: any;
  awayGoals: any;

  _leagues: any[] = [];
  leagueFilters: any[] = [];
  leagueFilterTypeId: any;
  leagueFilterQuery: string;
  isOriginFilters: Boolean = false;

  leaguesTabTitle: string;
  selectedTabTitle: string = "Selected (0)";

  // source for dataAdapter
  source = {
    localdata: [],
    dataFields: [{
      name: 'name',
      type: 'string'
    }],
    datatype: 'array',
    totalrecords: 0
  };

  // dataAdapter for the jqxGrid
  dataAdapter = new jqx.dataAdapter(this.source);

  // columns defining
  columns = [{
    text: 'name',
    datafield: 'name',
    width: '100%'
  }];

  selectedStatFilterType: string;
  presetRules: [];

  leftObject: Operand;
  rightObject: Operand;
  lVal1: Val;
  lVal2: Val;
  rVal1: Val;
  rVal2: Val;

  leftVal1_pre1(){return};
  leftVal1_pre2(){return};
  leftVal1_pre3(){return};
  leftVal2_pre1(){return};
  leftVal2_pre2(){return};
  leftVal2_pre3(){return};

  rightVal1_pre1(){return};
  rightVal1_pre2(){return};
  rightVal1_pre3(){return};
  rightVal2_pre1(){return};
  rightVal2_pre2(){return};
  rightVal2_pre3(){return};

  leftVal1(){return };
  leftVal2(){return };
  leftOperator(){return};
  rightVal1(){return };
  rightVal2(){return };
  rightOperator(){return};

  constructor(private readonly _store: StateService) {
    this._setVariables();
    this._getLeagues();
  }

  ngOnInit(): void {
    this._getTargetStrategy();
    this._getPresetRules();
  }

  ngOnDestroy(): void {
    this._stop$.next();
    this._stop$.complete();
  }

  ngAfterViewInit(): void {
    // Select origin league filters on the jqxGrid
    if (0 === this.myGrid.getboundrows().length)
      this.myGrid.updatebounddata();
    this.selectOriginFilters();
    // bind operand data from child component
    setTimeout(() => {
      this.leftVal1 = ()=> this.leftOperand.Val1;
      this.leftVal1_pre1 = ()=>this.leftOperand.Val1.previewStr1!=''?this.leftOperand.Val1.previewStr1:'?';
      this.leftVal1_pre2 = ()=>this.leftOperand.Val1.previewStr2;
      this.leftVal1_pre3 = ()=>this.leftOperand.Val1.previewStr3;
      this.leftVal2 = ()=> this.leftOperand.Val2;
      this.leftVal2_pre1 = ()=>this.leftOperand.Val2.previewStr1;
      this.leftVal2_pre2 = ()=>this.leftOperand.Val2.previewStr2;
      this.leftVal2_pre3 = ()=>this.leftOperand.Val2.previewStr3;
      this.leftOperator = ()=> this.leftOperand.operator;

      this.rightVal1 = ()=> this.rightOperand.Val1;
      this.rightVal1_pre1 = ()=>this.rightOperand.Val1.previewStr1!=''?this.rightOperand.Val1.previewStr1:'?';
      this.rightVal1_pre2 = ()=>this.rightOperand.Val1.previewStr2;
      this.rightVal1_pre3 = ()=>this.rightOperand.Val1.previewStr3;
      this.rightVal2 = ()=> this.rightOperand.Val2;
      this.rightVal2_pre1 = ()=>this.rightOperand.Val2.previewStr1;
      this.rightVal2_pre2 = ()=>this.rightOperand.Val2.previewStr2;
      this.rightVal2_pre3 = ()=>this.rightOperand.Val2.previewStr3;
      this.rightOperator = ()=> this.rightOperand.operator;
    }, 0);
  }

  private _setVariables(): void {
    this._stop$ = new Subject();
    this.statTypes = [
      'Time',
      'Home Shots on Target',
      'Home Shots off Target',
      'Home Attacks',
      'Home Dangerous Attacks',
      'Home Corners',
      'Home Possession',
      'Home Yellow Cards',
      'Home Red Cards',
      'Home Goals',
      'Away Shots on Target',
      'Away Shots off Target',
      'Away Attacks',
      'Away Dangerous Attacks',
      'Away Corners',
      'Away Possession',
      'Away Yellow Cards',
      'Away Red Cards',
      'Away Goals',
      'Total Shots on Target',
      'Total Shots off Target',
      'Total Attacks',
      'Total Dangerous Attacks',
      'Total Corners',
      'Total Possession',
      'Total Yellow Cards',
      'Total Red Cards',
      'Total Goals',
    ];
    // this.filterTypes = [{ value: '≥', viewValue: '≥ (Greater or equal)' },
    //   { value: '>', viewValue: '> (Greater than)' },
    //   { value: '≤', viewValue: '≤ (Less or equal)' },
    //   { value: '<', viewValue: '< (Less than)' },
    //   { value: '=', viewValue: '= (Equal)' },
    //   { value: '≠', viewValue: '≠ (Not equal)' }];

    this.filterTypes = ['≥', '>', '≤', '<', '=', '≠'];
    this.statType = '';
    this.statFilterType = '';
    // this.selectedStatFilterType = this.filterTypes[0].value;
    this.selectedStatFilterType = this.filterTypes[0];
    this.statFilterValue = '';

    this.goalsArr = new Array(10).fill(1);
    this.homeGoals = 0;
    this.awayGoals = 0;

    this.leftObject = new Operand();
    this.rightObject = new Operand();

  }

  //todo: change samplestrategies to presetrule
  private _getPresetRules(): void {
    this._store.sampleStrategies
      .pipe(
        filter(Boolean),
        tap((strategies: any) => {
          this.presetRules = strategies;
          // this._cdRef.detectChanges();
        }),
        takeUntil(this._stop$)
      )
      .subscribe(() => { });
  }

  private _getTargetStrategy(): void {
    this._store.targetStrategy
      .pipe(
        filter(Boolean),
        tap(this._setTargetStrategy.bind(this)),
        takeUntil(this._stop$)
      )
      .subscribe((res) => { });
  }

  private _setTargetStrategy(strategy): void {
    this.strategy = strategy;
    const { correctScoreFiltersList, statsFiltersList, filtersConfig } = this.strategy;
    let ffiltersConfig = filtersConfig?JSON.parse(filtersConfig):[];
    const correctScoreFilters = (correctScoreFiltersList || []).map(
      ({ homeGoals, awayGoals }) => `${homeGoals} - ${awayGoals}`
    );
    const statFilters = (statsFiltersList || []).map(
      ({ statType, operator, value }) => [statType, operator, value].join(' ')
    );
    const additionalFilters = (ffiltersConfig || []).map(
      ({filterString}) => `${filterString}`
    );
    // console.log(additionalFilters);
    this.filters = [...statFilters, ...correctScoreFilters, ...additionalFilters];
    // Set origin leagueFilters and leagueFilterTypeId
    let _leagueFilters = [];
    if (this.strategy.leagueFilters) {
      _leagueFilters = JSON.parse(
        this.strategy.leagueFilters
      );
    } else {
      _leagueFilters = [];
    }
    this.leagueFilterTypeId = (this.strategy.leagueFilterTypeId)?this.strategy.leagueFilterTypeId.toString():'';
    if (this.myGrid && this.compare(this.leagueFilters, _leagueFilters)) {
      this.leagueFilters = _leagueFilters;
      this.selectOriginFilters();
    }
  }

  private _getLeagues(): void {
    this._store.leagues.subscribe(leagues => {
      if (leagues) {
        // Get leagues from the store
        this._leagues = leagues;

        this.source.localdata = this._leagues;
        this.leaguesTabTitle = `Leagues (${this._leagues.length})`;
      }
    });
  }

  compare(filterA: any[], filterB: any[]) {
    if (filterA.length !== filterB.length)
      return true;

    let diff = false;

    filterA.forEach(filter => {
      const contains = filterB.includes(filter);
      if (!contains)
        diff = true;
    });
    return diff;
  }

  /**
   *
   * @param obj Object to be copied
   * @returns Deep copy of the param object
   */
  deepCopy(obj): any {
    return JSON.parse(JSON.stringify(obj));
  }

  onClickFilter(selectedFilter): void {
    this.filters = this.filters.filter((el) => el !== selectedFilter);
    let statsFilters = this.strategy.statsFiltersList;
    let correctFilters = this.strategy.correctScoreFiltersList;
    let additionalFilters = JSON.parse(this.strategy.filtersConfig);
    if (statsFilters)
      statsFilters = statsFilters.filter((el) => {
        const { statType, operator, value } = el;
        return [statType, operator, value].join(' ') !== selectedFilter;
      });

    if (correctFilters)
      correctFilters = correctFilters.filter(
        ({ homeGoals, awayGoals }) => `${homeGoals} - ${awayGoals}` !== selectedFilter
      );
    if (additionalFilters)
        additionalFilters = additionalFilters.filter((el) =>{
          const {filterString} = el;
          return filterString !== selectedFilter;
        });
    this._store.setTargetStrategy({
      ...this.strategy,
      statsFiltersList: statsFilters,
      correctScoreFiltersList: correctFilters,
      filtersConfig: JSON.stringify(additionalFilters),
    });
  }

  onChangeStatType(event): void {
    this.statType = event.target.value;
  }

  onChangeStatFilterType(event): void {
    var filterType = event.target.value;
    var value = '';
    switch(filterType){
      case '≥':
        value = '>=';break;
      case '≤':
        value = '<=';break;
      case '=':
        value = '==';break;
      case '≠':
        value = '!=';break;
      default:
        value = filterType;
    }
    this.statFilterType = value;
  }

  onChangeStatFilterValue(event): void {
    this.statFilterValue = event.target.value;
  }

  onAddStatFilter(): void {
    if (!this.statType || !this.statFilterType || !this.statFilterValue) {
      return;
    }

    if (
      this.statType === 'Stat Type' ||
      this.statFilterType === 'Filter Type'
    ) {
      return;
    }

    if (Number.isNaN(Number(this.statFilterValue))) {
      return;
    }

    const newItem = `${this.statType} ${this.statFilterType} ${this.statFilterValue}`;
    if ([...(this.filters || [])].some((el) => el === newItem)) {
      return;
    }

    this.filters = [
      ...(this.filters || []),
      `${this.statType} ${this.statFilterType} ${this.statFilterValue}`,
    ];

    const newStrategyFiltersList = [
      ...(this.strategy.statsFiltersList || []),
      {
        statType: this.statType,
        operator: this.statFilterType,
        value: Number(this.statFilterValue),
      },
    ];

    this._store.setTargetStrategy({
      ...this.strategy,
      statsFiltersList: newStrategyFiltersList,
    });
  }

  onChangeHomeGoals(event): void {
    this.homeGoals = Number(event.target.value);
  }

  onChangeAwayGoals(event): void {
    this.awayGoals = Number(event.target.value);
  }

  onAddCorrectScoreFilter(): void {
    const newItem = `${this.homeGoals} - ${this.awayGoals}`;
    if ([...(this.filters || [])].some((el) => el === newItem)) {
      return;
    }

    this.filters = [
      ...(this.filters || []),
      `${this.homeGoals} - ${this.awayGoals}`,
    ];
    this._store.setTargetStrategy({
      ...this.strategy,
      correctScoreFiltersList: [
        ...(this.strategy.correctScoreFiltersList || []),
        { homeGoals: this.homeGoals, awayGoals: this.awayGoals },
      ],
    });
  }

  //Method for rule button
  onSaveRule():void {
    this.lVal1 = this._processFiltersConfig(this.leftOperand.Val1);
    this.lVal2 = this._processFiltersConfig(this.leftOperand.Val2);
    this.rVal1 = this._processFiltersConfig(this.rightOperand.Val1);
    this.rVal2 = this._processFiltersConfig(this.rightOperand.Val2);

    if(!this.lVal1.constant && !this.lVal1.reference) return;
    if(!this.rVal1.constant && !this.rVal1.reference) return;
    this.leftObject = {
      Operator:this.leftOperand.operator,
      Val1: this.lVal1,
      Val2: this.lVal2,
    }
    this.rightObject = {
      Operator:this.rightOperand.operator,
      Val1: this.rVal1,
      Val2: this.rVal2,
    }
    let filterString = `${this.leftVal1_pre1()}${this.leftVal1_pre2()}${this.leftVal1_pre3()}
      ${this.leftOperator()}
      ${this.leftVal2_pre1()}${this.leftVal2_pre2()}${this.leftVal2_pre3()}
      ${this.selectedStatFilterType}
      ${this.rightVal1_pre1()}${this.rightVal1_pre2()}${this.rightVal1_pre3()}
      ${this.rightOperator()}
      ${this.rightVal2_pre1()}${this.rightVal2_pre2()}${this.rightVal2_pre3()}`;
    filterString = filterString.replace(/undefined/g,'');
      this.filterdata = {
      Comparator: this.selectedStatFilterType,
      Left: this.leftObject,
      Right: this.rightObject,
      filterString: filterString,
    }
    let ffiltersConfig = this.strategy.filtersConfig?JSON.parse(this.strategy.filtersConfig):[];
    if ([...(ffiltersConfig || [])].some((el) => JSON.stringify(this.filterdata) == JSON.stringify(el))) return;
    this.filters = [
      ...(this.filters || []),
      filterString,
    ];
    this._store.setTargetStrategy({
      ...this.strategy,
      filtersConfig: JSON.stringify([
        ...(ffiltersConfig || []),
        this.filterdata,
      ]),
    });
    this.accordion.closeAll();
    // console.log(this.strategy);
  }

  private _processFiltersConfig(value):Val {
    let returnVal:Val = {reference:''};
    if(value.reference!='') {
      returnVal.reference = value.reference;
      if(value.team!='') {
        returnVal.team = value.team;
        switch(value.rangeValue){
          case 'offset':
            returnVal.timerOffset = value.timerOffset;
            break;
          case 'fh':
          case 'sh':
          case 'ht':
          case 'ft':
          case 'disablied':
            returnVal.timerPeriod = value.timerPeriod;
            break;
          case 'range':
            returnVal.timeRangeFrom = value.timeRangeFrom;
            returnVal.timeRangeTo = value.timeRangeTo;
            break;
          default:
            returnVal[value.rangeValue] = value[value.rangeValue];
            break;
        }
      }
    }
    else{
      returnVal.constant = value.constant;
    }

    return returnVal;
  }

  onSaveAnotherRule():void {
    this.onSaveRule();
    // console.log("onSaveAnotherRule");
  }
  onCancelRule(): void {
    this.accordion.closeAll();
    // this._setVariables();
    // console.log("onCancelRule");
  }
  onClickMenuItem(menuItem ){
    // console.log('onClickMenuItem');
    menuItem.statsFiltersList.forEach(statFilter => {
      if(!statFilter) return;
      this.statType = statFilter.statType;
      this.statFilterType = statFilter.operator;
      this.statFilterValue = statFilter.value;
      this.onAddStatFilter();
    });
  }
  closeOtherPanels(openPanel: MatExpansionPanel) {
      this.panels.forEach(panel => {
          if (panel !== openPanel) {
              panel.close();
          }
      });
  }
  /**
   * Method for handling when clicked `Select All` button
   */
  handleSelectAll(): void {
    this.myGrid.selectallrows();
  }

  /**
   * Method for handling when clicked 'Unselect All` button
   */
  handleUnselectAll(): void {
    this.myGrid.clearselection();
  }

  /**
   * Method for handling when clicked `Clear Filter` button
   */
  handleClearFilter(): void {
    this.leagueFilterQuery = '';
    this.handleSearchLeague();
  }

  /**
   * Method for handling changes of leagueFilterTypeId
   */
  handleTypeIdChange(event: any) {
    this._store.setTargetStrategy({
      ...this.strategy,
      leagueFilterTypeId: parseInt(this.leagueFilterTypeId)
    });
  }

  /**
   * Method for saving league filters to the store
   */
  saveLeagueFilter(): void {
    if (this.isOriginFilters)
      return;
    this._store.setTargetStrategy({
      ...this.strategy,
      leagueFilters: JSON.stringify(this.leagueFilters)
    });
  }

  /**
   * selects origin league filters
   */
  selectOriginFilters() {
    this.isOriginFilters = true;
    const temp = this.deepCopy(this.leagueFilters);
    this.myGrid.clearselection();
    this.leagueFilters = [];
    temp.forEach(leagueName => {
      const index = this.source.localdata.findIndex(
        league => league.name === leagueName
      );
      if (-1 !== index)
        this.myGrid.selectrow(index);
    });
    this.isOriginFilters = false;
  }

  /**
   * Method for searching leagues that matches the search value
   */
  handleSearchLeague(): void {
    const filterGroup = new jqx.filter();
    const filter = filterGroup.createfilter('stringfilter', this.leagueFilterQuery, 'CONTAINS');
    filterGroup.addfilter(0, filter);
    this.myGrid.removefilter('name', false);
    this.myGrid.addfilter('name', filterGroup, true);
  }

  /**
   * Method for handing row select on jqxGrid
   * @param event Event object for row selecting
   * Contains index and details for the unselected rows
   */
  handleRowSelect(event: any): void {
    const rowindex = event.args.rowindex;
    if (Array.isArray(rowindex)) {
      this.leagueFilters = this.source.localdata.map(league => league.name);
    } else {
      this.leagueFilters.push(event.args.row.name);
    }
    this.selectedTabTitle = `Selected (${this.leagueFilters.length})`;
    this.saveLeagueFilter();
  }

  /**
   * Method for handling row unselect on jqxGrid
   * @param event Event object for row unselecting
   * Contains index and details for the unselected rows
   */
  handleRowunselect(event: any): void {
    const rowindex = event.args.rowindex;
    if (Array.isArray(rowindex)) {
      this.leagueFilters = [];
    } else {
      const leagueName = event.args.row.name;
      const filterIndex = this.leagueFilters.indexOf(leagueName);
      if (-1 !== filterIndex)
        this.leagueFilters.splice(filterIndex, 1);
    }
    this.selectedTabTitle = `Selected (${this.leagueFilters.length})`;
    this.saveLeagueFilter();
  }

  /**
   * Method for handling tab changes between `Leagues` and `Selected` Tabs
   * When selected `Leagues` tab, set the grid's localdata as _leagues and
   * for `Selected` tab, set the grid's localdata as leagueFilters
   * @param event Contains selected tab index
   */
  handleTabChange(event: any) {
    if (0 === event.index) {
      this.source.localdata = this._leagues;
    } else {
      this.source.localdata = this.leagueFilters.map(league => ({ name: league }));
    }
    this.myGrid.updatebounddata();
    this.selectOriginFilters();
  }
}
