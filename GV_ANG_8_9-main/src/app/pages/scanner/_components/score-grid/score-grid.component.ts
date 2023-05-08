import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild, 
  EventEmitter,
  Output
} from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import html2canvas from 'html2canvas';
import * as util from 'util';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { saveAs } from 'file-saver';
import { ScannerStoreService } from './../../scanner-store.service';

import {
  MAIN_COLUMN_VISIBILITY_FIELD,
  MISC_VISIBILITY_FIELD,
  PREV_SELECT_OPTIONS,
  PREVIOUS_COLUMN_VISIBILITY_FIELD,
  QUICK_FILTERS_GAMES_CURRENTLY_IN_CONFIG,
  QUICK_FILTERS_MISC_CONFIG,
  STATS_FILTER_STAT_TYPE_OPTIONS,
  STAT_FILTER_COMPARARISON_TYPES,
  COLUMN_KEYS,
  HIGHLIGHT_INFO,
  MOMENTUM_WIDTH,
  GRID_ROW_HEIGHT,
  MAX_SPLINE_WIDTH
} from './../config/grid-settings-config';
import { MessageService } from '../../message.service';
import { environment } from 'src/environments/environment';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { MomentumGraphComponent } from '../momentum-graph/momentum-graph.component';
import { MomentumLineChartComponent } from '../momentum-line-chart/momentum-line-chart.component';
import { PlayService } from 'src/app/pages/scanner/play.service';
import { StateService } from 'src/app/core/services';
import { Filter } from 'src/app/shared/strategy-filters-operand/filters';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';

declare var $: any;
const MOMENT_TIMEOUT = 0;
const TOTAL_RECORDS = 10000;
const STD_TIMEOUT = 300;

@Component({
  selector: 'app-score-grid',
  templateUrl: './score-grid.component.html',
  styleUrls: ['./score-grid.component.scss'],
})

export class ScoreGridComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;
  public static components: ScoreGridComponent[] = [];
  @ViewChild('mygrid', { static: false }) mygrid: jqxGridComponent;
  @ViewChild('homeformPopover') homeFormPop: ElementRef;
  @ViewChild('awayformPopover') awayFormPop: ElementRef;
  @ViewChild('matchMomentum1') matchMomentum1: ElementRef;
  @ViewChild('matchMomentum2') matchMomentum2: ElementRef;
  @ViewChild('predictionPopup') predictionPopup: ElementRef;
  @ViewChild('notePopup') notePopup: ElementRef;
  @ViewChild('oddPopup') oddPopup: ElementRef;
  @ViewChild('highlightPopup') highlightPopup: ElementRef;
  @ViewChild('screenShot') screenShot:ElementRef;

  _filter: boolean;
  curMatch: any;
  componentRef: any;
  defaultMainColumnVisibility = MAIN_COLUMN_VISIBILITY_FIELD;
  previousStatsColumnVisibility = PREVIOUS_COLUMN_VISIBILITY_FIELD;
  miscStatsColumnVisibility = MISC_VISIBILITY_FIELD;
  options = PREV_SELECT_OPTIONS;
  defaultGamesCurrentlyInFilters = QUICK_FILTERS_GAMES_CURRENTLY_IN_CONFIG;
  defaultMiscFilters = QUICK_FILTERS_MISC_CONFIG;
  gamesCurrentlyInFilters = [];
  miscFilters = [];
  searchValue;
  activeMainColumnVisibility = [];
  activePreviousStatsColumnVisibility = [];
  activeMiscStatsColumnVisibility = [];
  activeFilters = [];
  scoreFilters = [];
  additionalFilters = [];
  closeResult = '';
  graphType: string = '';

  @Input() grid;
  @Input() gridName;
  @Input() gridNumber;
  @Input() strategy;
  @Input() linkedMatches;
  @Input() userPredictions;
  @Input() favouriteMatches;
  @Input() gridOptions;
  @Input() searchVal;


  tableHeight = 700; // set default height of the grid table
  rowHeight = GRID_ROW_HEIGHT;
  sortedData = [];

  before_sortedData = [];

  before_sorted_flag = false;

  __originalData = [];
  lastTimeSelection = PREV_SELECT_OPTIONS[0];
  hide = false;
  type;
  gridNameEdit = false;
  color = "#1b6853";
  bells = [];

  popover_pos: any;
  clubSearchId: string;
  myGridId: string;
  prevStatId: string;
  currentPredictionId = 0;
  currentNoteId = 0;
  currentOdds = null;
  currentHighlight = '';

  sortInfo: {
    active: '',
    direction: ''
  };

  momentinumTimer: any = {};
  clubNameTimer: any = {};
  chart1Timer: any = {};
  chart2Timer: any = {};
  scrollRefreshTimer: any = null;
  momentumComponents: any = {};
  lastDeletedMatch: any = null;

  iconsConfig = {
    QuickFilters: true,
    StatsFilter: true,
    Information: true,
    ResetColumnOrder: true,
    Undo: true
  };

  highlightConfig: any = {
    statsDifferenceHighColour: "red",
    statsDifferenceHighValue :5,
    statsDifferenceMediumColour: "orange",
    statsDifferenceMediumValue: 3,
    statsDifferenceLowColour: "yellow",
    statsDifferenceLowValue: 1,
    attackConversionHighColour: "darkgreen",
    attackConversionHighValue: 0.7,
    attackConversionLowColour: "lightblue",
    attackConversionLowValue: 0.2,
    shape: "rect"
  };
  columnVisibilityConfig: any = {};
  customColumnConfig: any;
  source: any =
    {
      datatype: 'array',
      localdata: [],
      totalrecords: TOTAL_RECORDS,
      cache: false,
      // used when virtual mode = false
      datafields:
        [
          { name: 'gameTime', type: 'any' },
          { name: 'score', type: 'any' },
          { name: 'clubName', type: 'any' },
          { name: 'liveHomeOdds', type: 'any' },
          { name: 'liveDrawOdds', type: 'any' },
          { name: 'liveAwayOdds', type: 'any' },
          { name: 'onTarget', type: 'any' },
          { name: 'offTarget', type: 'any' },
          { name: 'attacks', type: 'any' },
          { name: 'dangerousAttacks', type: 'any' },
          { name: 'attackConversion', type: 'any' },
          { name: 'corners', type: 'any' },
          { name: 'possession', type: 'any' },
          { name: 'yellowCards', type: 'any' },
          { name: 'redCards', type: 'any' },
          { name: 'graphicalData1', type: 'any' },
          { name: 'graphicalData2', type: 'any' },
          { name: 'lastOnTarget', type: 'any' },
          { name: 'lastOffTarget', type: 'any' },
          { name: 'lastAttacks', type: 'any' },
          { name: 'lastDangerousAttacks', type: 'any' },
          { name: 'lastCorners', type: 'any' },
          { name: 'goals', type: 'any' },
          { name: 'pressureIndex', type: 'any' },
          { name: 'momentum', type: 'any' },
          { name: 'bell', type: 'any' },
          { name: 'remove', type: 'any' },
        ],

      sort: (col_name, sortDirection) => this.sortTable(col_name, sortDirection),
      deleterow: (rowid, commit) => commit(true),
    };
  dataAdapter: any = new jqx.dataAdapter(this.source);
  graphId: string;
  isDefault: boolean;
  selectedRow: any;
  filterInfo: any;
  constructor(
    private modalService: NgbModal,
    private messageService: MessageService,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private playService: PlayService,
    private _localStore: ScannerStoreService,
    private _rootStore: StateService
  ) {
    ScoreGridComponent.components.push(this);
  }

  public static setColorFromHeader(color) {
    ScoreGridComponent.components[0].color = color;
  }

  sortTable(col_name, sortDirection) {
    const sort_information: any = {
      direction: '',
      active: col_name,
    };

    if (sortDirection === true) {
      sort_information.direction = 'asc';
    } else if (sortDirection === false) {
      sort_information.direction = 'desc';
    } else if (sortDirection === null) {
      sort_information.direction = '';
    }
    this.sortInfo = sort_information;
    this._localStore.setSortInfo(sort_information);
    this.sortData(sort_information);
  }

  sortData(sort: any, updateGrid = true) {
    if (this.before_sorted_flag === false) {
      this.before_sortedData = this.sortedData;
      this.before_sorted_flag = true;
    }

    const noSortingDefinedYet = !sort.active || sort.direction === '';
    if (noSortingDefinedYet) {
      this.sortedData = this.before_sortedData;
      this.setTableDataSource(updateGrid, true);
      return;
    }
    const data = this.sortedData.slice();
    const isAsc = (sort.direction === 'asc');

    this.sortedData = data.sort((a, b) => this.gridSortComparator(a, b, sort.active, isAsc));
    this.setTableDataSource(updateGrid, true);
  }

  searchValueFilter(sortedData = [], value) {
    return sortedData.filter((res) => {
      const shouldSearchV = value.toLowerCase();
      if (res.battleWith.toLowerCase().includes(shouldSearchV)) {
        return true;
      }
      return false;
    });
  }

  attachClubSearchEvent() {
    let searchTimer = null;
    const that = this;
    $('#' + this.myGridId).delegate('#' + this.clubSearchId, 'keyup', function () {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
      const domThis = this;
      that.searchValue = domThis.value;
      searchTimer = setTimeout(() => {
        const value = domThis.value;
        searchTimer = null;
        that.sortedData = that.__originalData;

        if (!value) {
          that.setTableDataSource(true, true);
          return;
        }

        that.sortedData = that.searchValueFilter(that.sortedData, value);

        that.setTableDataSource(true, true);
        $('#' + that.clubSearchId).focus();
        that.hidePopups();
      }, STD_TIMEOUT);
    });
  }

  attachPredictionHoverEvent() {
    $('#' + this.myGridId).delegate('img[src*="prediction.png"]', 'mouseenter mouseleave', { parent: this }, function (e) {
      const parent = e.data.parent;
      const dom = $(this);
      const predictionId = dom.data('pred-id');
      const boundRect: any = dom.get(0).getBoundingClientRect();

      const dom_pos = { x: boundRect.left + boundRect.width / 2, y: boundRect.top + boundRect.height / 2 };
      const param = {
        type: 'prediction',
        predictionId,
        position: dom_pos
      };
      if (e.type === 'mouseenter') {
        parent.showPopup(param);
      } else if (e.type === 'mouseleave') {
        parent.hidePopups();
      }
    });
  }

  attachClubNoteHoverEvent() {
    $('#' + this.myGridId).delegate('img[src*="note.png"]', 'mouseenter mouseleave', { parent: this }, function (e) {
      const parent = e.data.parent;
      const dom = $(this);
      const predictionId = dom.data('note-id');
      const boundRect: any = dom.get(0).getBoundingClientRect();
      const dom_pos = { x: boundRect.left + boundRect.width / 2, y: boundRect.top + boundRect.height / 2 };
      const param = {
        type: 'note',
        noteId: predictionId,
        position: dom_pos
      };
      if (e.type === 'mouseenter') {
        parent.showPopup(param);
      } else if (e.type === 'mouseleave') {
        parent.hidePopups();
      }
    });
  }

  attachOddHoverEvent() {
    $('#' + this.myGridId).delegate('#id_grid_odd', 'mouseenter mouseleave', { parent: this }, function (e) {
      const parent = e.data.parent;
      const dom = $(this);
      const oddIndex = dom.data('odd-index');
      if(parent.sortedData[oddIndex].odds) {
        const boundRect: any = dom.get(0).getBoundingClientRect();
        const dom_pos = { x: boundRect.left + boundRect.width / 2, y: boundRect.top + boundRect.height / 2 };
        const param = {
          type: 'odd',
          oddsInfo: parent.sortedData[oddIndex].odds,
          position: dom_pos
        };
        if (e.type === 'mouseenter') {
          parent.showPopup(param);
        } else if (e.type === 'mouseleave') {
          parent.hidePopups();
        }
      }
    });
  }

  attachHighlightHoverEvent() {
    $('#' + this.myGridId).delegate('.stats', 'mouseenter mouseleave', { parent: this }, function (e) {
      const parent = e.data.parent;
      const dom = $(this);
      const boundRect: any = dom.get(0).getBoundingClientRect();
      const dom_pos = { x: boundRect.left + boundRect.width / 2, y: boundRect.top + boundRect.height / 2 };
      const statsType = dom.data('stats-type');
      const previousStats = JSON.parse(decodeURIComponent(dom.data('previous-stats')));
      if(previousStats && (typeof previousStats === 'object' && ((JSON.parse(previousStats.homeGoals).length || JSON.parse(previousStats.awayGoals).length)) || (typeof previousStats === 'string' && JSON.parse(previousStats).length))) {
        let param = {
          type: 'previousStats',
          position: dom_pos,
          statsType,
          previousStats
        };

        if (dom.get(0).classList.contains('stats-highlight')) {
          const highlightType = dom.data('highlight');

          param['highlightType'] = highlightType;
        }
        if (e.type === 'mouseenter') {
          parent.showPopup(param);
        } else if (e.type === 'mouseleave') {
          parent.hidePopups();
        }
      }
    });
  }

  attachPreviousStatsChangeEvent() {
    // prev state
    $('#' + this.prevStatId).change({ state: this.lastTimeSelection }, (e) => {
      const name = e.target.value;
      const value = e.target.value;
      e.data.state = { name, value };
      this.lastTimeSelection = e.data.state;
      if (this.sortInfo && this.sortInfo.active !== '' && this.sortInfo.direction !== '') {
        const sortedField: string = this.sortInfo.active;
        const isLastFieldSorted = sortedField.includes('last') || sortedField === 'goals' || sortedField === 'pressureIndex';
        if (isLastFieldSorted) {
          this.sortData(this.sortInfo, true);
        }
      } else {
        this.setTableDataSource(true, true);
      }
    });
  }

  attachGraphTypeChangeEvent() {
    $('#'+this.graphId).change(e => {
      this.graphType = e.target.value+'';
      this._localStore.setGraphType(this.graphType);
      this.mygrid.refresh();
    });
  }

  attachClubInfoClickedEvent() {
    // club info click event
    $('#' + this.myGridId).delegate('#id_club_info', 'click', { parent: this }, function (event) {
      const parent = event.data.parent;
      const dom = $(this);
      const boundRect: any = dom.get(0).getBoundingClientRect();

      const dom_pos = { x: boundRect.left + boundRect.width / 2, y: boundRect.top + boundRect.height / 2 };

      const club_key = dom.data('club-key');

      const club_type = dom.data('club-type');

      const club_info = JSON.parse(decodeURIComponent(dom.data('club-info')));

      const param = { match: club_info, value: club_type, position: dom_pos };

      const timerKey: string = 'clubName-' + club_key;
      if (parent.clubNameTimer[timerKey]) {
        clearTimeout(parent.clubNameTimer[timerKey]);
      }
      parent.clubNameTimer[timerKey] = setTimeout(() => {
        delete parent.clubNameTimer[timerKey];
        parent.onClubInfoClick(param);
      }, 1);
    });
  }

  attachChartInfo1ClickedEvent() {
    // chart info click event
    $('#' + this.myGridId).delegate('#id_chart_info1', 'click', { parent: this }, function (event) {
      const parent = event.data.parent;
      const dom = $(this);
      const boundRect: any = dom.get(0).getBoundingClientRect();

      const dom_pos = { x: boundRect.left + boundRect.width / 2, y: boundRect.top + boundRect.height / 2 };

      const chart_key = dom.data('chart-key');

      const chart_type = dom.data('chart-type');

      const chart_info = JSON.parse(decodeURIComponent(dom.data('chart-info')));

      const param = { match: chart_info, value: chart_type, position: dom_pos };

      const timerKey: string = 'chart1Name-' + chart_key;
      if (parent.chart1Timer[timerKey]) {
        clearTimeout(parent.chart1Timer[timerKey]);
      }
      parent.chart1Timer[timerKey] = setTimeout(() => {
        delete parent.chart1Timer[timerKey];
        parent.onGraph1InfoClick(param);
      }, 1);
    });
  }

  attachChartInfo2ClickedEvent() {
    $('#' + this.myGridId).delegate('#id_chart_info2', 'click', { parent: this }, function (event) {
      const parent = event.data.parent;
      const dom = $(this);
      const boundRect: any = dom.get(0).getBoundingClientRect();

      const dom_pos = { x: boundRect.left + boundRect.width / 2, y: boundRect.top + boundRect.height / 2 };

      const chart_key = dom.data('chart-key');

      const chart_type = dom.data('chart-type');

      const chart_info = JSON.parse(decodeURIComponent(dom.data('chart-info')));

      const param = { match: chart_info, value: chart_type, position: dom_pos };

      const timerKey: string = 'chart2Name-' + chart_key;
      if (parent.chart2Timer[timerKey]) {
        clearTimeout(parent.chart2Timer[timerKey]);
      }

      parent.chart2Timer[timerKey] = setTimeout(() => {
        delete parent.chart2Timer[timerKey];
        parent.onGraph2InfoClick(param);
      }, 1);
    });
  }

  attachGridEvents() {
    this.attachClubSearchEvent();
    this.attachPredictionHoverEvent();
    this.attachClubNoteHoverEvent();
    this.attachPreviousStatsChangeEvent();
    this.attachGraphTypeChangeEvent();
    this.attachClubInfoClickedEvent();
    this.attachChartInfo1ClickedEvent();
    this.attachChartInfo2ClickedEvent();
    this.attachFavouriteMatchesChangedEvent();
    this.attachOddHoverEvent();
    this.attachHighlightHoverEvent();
  }

  ngAfterViewInit(): void {
    this._localStore.lastTimeSelection.subscribe((value)=>{
      if (value.name) {
        $('#' + this.prevStatId).val(value.name);
        this.lastTimeSelection = value;
      }
    })
    this.initColumns();
    this.initCustomColumns();
    this.attachGridEvents();
    // load initial data after adding grid
    this.setTableDataSource(true, true);
    this.autoHideHorizontalScrollBar();
    
  }

  getStrategies(): void {
    this._localStore.sortInfo.subscribe(sortInfo => {
      this.sortInfo = sortInfo;
    });
    this._rootStore.targetStrategy.subscribe(strategy => {
      if (strategy) {
        this.filterInfo = JSON.parse(strategy.filtersConfig);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getStrategies()
    if (this.sortInfo && this.sortInfo.active !== '' && this.sortInfo.direction !== '') {
      this.sortData(this.sortInfo);
    }
    if (changes.favouriteMatches) {
      this.initialiseBellStatus();
    }
    this.setTableDataSource(true, true);
  }

  autoHideHorizontalScrollBar() {
    // scroll bar is injected by jqxgrid updatebounddata('sort') routine
    const setGridWidth = (that = this, width = '100%') => that.mygrid.width(width);
    setGridWidth(this, '99.99%');
    setTimeout(setGridWidth, MOMENT_TIMEOUT);
  }

  onScroll() {
    // console.log('scrolled');
  }

  setTableDataSource(refreshGrid = true, onlySorting = false) {
    this.source.localdata = this.generateTableSourceData();
    if (refreshGrid) {
      this.updateGrid(onlySorting);
    }
    return;
  }

  attachColumnVisibiltyChangedEvent() {
    this.messageService.publishVisibilityEvent.subscribe((publishData) => {
      if (this.gridNumber === publishData.gridNumber) {
        this.activeMainColumnVisibility = publishData.activeMainColumnVisibility;
        this.activeMiscStatsColumnVisibility = publishData.activeMiscStatsColumnVisibility;
        this.activePreviousStatsColumnVisibility = publishData.activePreviousStatsColumnVisibility;

        setTimeout(() => {
          this.activeMainColumnVisibility.forEach(item => {
            if (item.visible === false) {
              this.mygrid.hidecolumn(item.key);
            } else {
              this.mygrid.showcolumn(item.key);
            }
          });

          this.activeMiscStatsColumnVisibility.forEach(item => {
            if (item.visible === false) {
              this.mygrid.hidecolumn(item.key);
            } else {
              this.mygrid.showcolumn(item.key);
            }
          });

          this.activePreviousStatsColumnVisibility.forEach(item => {
            if (item.visible === false) {
              this.mygrid.hidecolumn(item.key);
            } else {
              this.mygrid.showcolumn(item.key);
            }
          });

          this.mygrid.updatebounddata();
        }, STD_TIMEOUT);
      }
    });
  }

  attachQuickFiltersChangedEvent() {
    this.messageService.publishQuickFiltersEvent.subscribe((data) => {
      if (this.gridNumber === data.gridNumber) {
        this.gamesCurrentlyInFilters = data.gamesCurrentlyInFilters;
        this.miscFilters = data.miscFilters;

        this.applyQuickFilters();
        this.before_sorted_flag = false;
        this.setTableDataSource();
      }
    });
  }

  attachPreviousStatsFiltersChangedEvent() {
    this.messageService.statsFilterEvent.subscribe((data) => {
      if (data.gridNumber === this.gridNumber) {
        this.activeFilters = data.filters;
        this.scoreFilters = data.scoreFilters;
        this.additionalFilters = data.additionalFilters;
        this.sortedData = this.applyFilters(data.filters, this.sortedData);
        this.sortedData = this.applyScoreFilters(data.scoreFilters, this.sortedData);
        this.sortedData = this.applyAdditionalFilters(data.additionalFilters, this.sortedData);
        if (this._filter && this.filterInfo) this.sortedData = this.applyAdditionalFilters(this.filterInfo, this.sortedData);
        if(this.strategy && this.strategy.leagueFilters)
        this.sortedData = this.applyLeagueFilters(this.strategy.leagueFilters, this.sortedData);
        this.before_sorted_flag = false;
        this.setTableDataSource();

        let statsFilters = [];
        this.activeFilters.forEach(filter => {
          const StatType: string = filter.statType.value;
          const Operator: string = filter.filterType.value;
          const Value: number = parseInt(filter.filterValue);
          statsFilters.push({ StatType, Operator, Value });
        });

        let scoreFilters = [];
        this.scoreFilters.forEach(filter => {
          const scores = filter.split('-');
          scoreFilters.push({
            HomeGoals: parseInt(scores[0]),
            AwayGoals: parseInt(scores[1])
          });
        });

        let additionalFilters = [];
        this.additionalFilters.forEach(filter => {
          additionalFilters.push(filter);
        });

        if (data.saveOption === '2' && this.strategy) {
          this.playService.saveStrategy({
            ...this.strategy,
            statsFiltersList: statsFilters,
            correctScoreFiltersList: scoreFilters,
            filtersConfig: JSON.stringify(additionalFilters),
          }).subscribe(response => this.strategy = response);
        }
      }
    });
  }
  applyAdditionalFilters(additionalFilters: any, sortedData: any[]): any[] {
    let filteredData = sortedData.filter((match) => match);

    if (additionalFilters && additionalFilters.length) {
      additionalFilters.forEach(filter => {
        filteredData = this._generateAdditionalFilteredData(filter, filteredData);
      })
    }

    return filteredData;
  }

  private _generateAdditionalFilteredData(filter, data){

    return data.filter((match) => {
      //assign values from additional filter
      let left = filter.Left; let right = filter.Right;
      let left1 = left.Val1; let left2 = left.Val2;
      let right1 = right.Val1; let right2 = right.Val2;

      let leftval1;let leftval2;let rightval1;let rightval2;
      let leftval; let rightval;
      leftval1 = this._calc(left1, match);
      if(isNaN(leftval1)) return false;

      if (Object.keys(left2).length != 0 && left.Operator != '') {
        leftval2 = this._calc(left2, match);
        if(isNaN(leftval2)) return false;
        switch(left.Operator){
          case '+':
            leftval = leftval1 + leftval2;break;
          case '-':
            leftval = leftval1 - leftval2;break;
          case 'x':
            leftval = leftval1 * leftval2;break;
          case '÷':
            leftval = leftval1 / leftval2;break;
          case '^':
            leftval = leftval1 ^ leftval2;break;
          case 'mod':
            leftval = leftval1 % leftval2;break;
        }
      }
      else leftval = leftval1;
      rightval1 = this._calc(right1, match);
      if(isNaN(rightval1)) return false;
      if (Object.keys(right2).length === 0 && right.Operator != '') {
        rightval2 = this._calc(right2, match);
        if(isNaN(rightval2)) return false;
        switch(right.Operator){
          case '+':
            rightval = rightval1 + rightval2;break;
          case '-':
            rightval = rightval1 - rightval2;break;
          case 'x':
            leftval = rightval1 * rightval2;break;
          case '÷':
            leftval = rightval1 / rightval2;break;
          case '^':
            leftval = rightval1 ^ rightval2;break;
          case 'mod':
            leftval = rightval1 % rightval2;break;
        }
      }
      else rightval = rightval1;
      
      switch(filter.Comparator){
        case '≥':
          return leftval >= rightval;
        case '>':
          return leftval > rightval;
        case '≤':
          return leftval <= rightval;
        case '<':
          return leftval < rightval;
        case '=':
          return leftval == rightval;
        case '≠':
          return leftval != rightval;

      }
      return true;
    });
  }

  // get value from match array
  private _calc(val, match){
    let returnVal;
    let time = match.gameTime;
    const match_stat = match.statisticsTimings;
    switch(val.reference){
      case 'timer':
        returnVal = time;break;
      case 'goals':
        if(val.team){
          switch(val.team){
            case 'h':
              returnVal = this._calcTimings(match_stat.homeGoals, val, time);break;
            case 'a':
              returnVal = this._calcTimings(match_stat.awayGoals, val, time);break;
            case 'w':
              if(this.getGoals(match_stat.awayGoals) > this.getGoals(match_stat.homeGoals))
                returnVal = this._calcTimings(match_stat.awayGoals, val, time);
              else if (this.getGoals(match_stat.awayGoals) < this.getGoals(match_stat.homeGoals))
                returnVal =  this._calcTimings(match_stat.homeGoals, val, time);
              break;
            case 'l':
              if(this.getGoals(match_stat.awayGoals) < this.getGoals(match_stat.homeGoals))
                returnVal = this._calcTimings(match_stat.awayGoals, val, time)
              else if(this.getGoals(match_stat.awayGoals) > this.getGoals(match_stat.homeGoals))
               returnVal = this._calcTimings(match_stat.homeGoals, val, time);
              break;
            default:
              returnVal = this.getGoals(match_stat.homeGoals) + this.getGoals(match_stat.awayGoals);
          }
        } else {
          returnVal = this.getGoals(match_stat.homeGoals) + this.getGoals(match_stat.awayGoals);
        }
        break;
      case 'shotsOnTarget':
        if(val.team){
          switch(val.team){
            case 'h':
              returnVal = this._calcTimings(match_stat.homeShotsOnTarget, val, time);break;
            case 'a':
              returnVal = this._calcTimings(match_stat.awayShotsOnTarget, val, time);break;
            case 'w':
              if(this.getGoals(match_stat.awayGoals) > this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.awayShotsOnTarget, val, time)
              else if(this.getGoals(match_stat.awayGoals) < this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.homeShotsOnTarget, val, time);
              break;
            case 'l':
              if(this.getGoals(match_stat.awayGoals) < this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.awayShotsOnTarget, val, time)
              else if(this.getGoals(match_stat.awayGoals) > this.getGoals(match_stat.homeGoals))
               this._calcTimings(match_stat.homeShotsOnTarget, val, time); break;
            default:
              returnVal = this.getGoals(match_stat.awayShotsOnTarget) + this.getGoals(match_stat.homeShotsOnTarget);
          }
        }else {
          returnVal = this.getGoals(match_stat.awayShotsOnTarget) + this.getGoals(match_stat.homeShotsOnTarget);
        }
        break;
      case 'shotsOffTarget':
        if(val.team){
          switch(val.team){
            case 'h':
              returnVal = this._calcTimings(match_stat.homeShotsOffTarget, val, time);break;
            case 'a':
              returnVal = this._calcTimings(match_stat.awayShotsOffTarget, val, time);break;
            case 'w':
              if(this.getGoals(match_stat.awayGoals) > this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.awayShotsOffTarget, val, time)
              else if(this.getGoals(match_stat.awayGoals) < this.getGoals(match_stat.homeGoals))
               this._calcTimings(match_stat.homeShotsOffTarget, val, time); break;
            case 'l':
              if(this.getGoals(match_stat.awayGoals) < this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.awayShotsOffTarget, val, time)
              else if(this.getGoals(match_stat.awayGoals) > this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.homeShotsOffTarget, val, time); break;
            default:
              returnVal = this.getGoals(match_stat.awayShotsOffTarget)+this.getGoals(match_stat.homeShotsOffTarget);
          }
        }else {
          returnVal = this.getGoals(match_stat.awayShotsOffTarget)+this.getGoals(match_stat.homeShotsOffTarget);
        }
        break;

      case 'corners':
        if(val.team){
          switch(val.team){
            case 'h':
              returnVal = this._calcTimings(match_stat.homeCorners, val, time);break;
            case 'a':
              returnVal = this._calcTimings(match_stat.awayCorners, val, time);break;
            case 'w':
              if(this.getGoals(match_stat.awayGoals) > this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.awayCorners, val, time)
              else if(this.getGoals(match_stat.awayGoals) < this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.homeCorners, val, time); break;
            case 'l':
              if(this.getGoals(match_stat.awayGoals) < this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.awayCorners, val, time)
              else if(this.getGoals(match_stat.awayGoals) > this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.homeCorners, val, time); break;
            default:
              returnVal = this.getGoals(match_stat.homeCorners)+this.getGoals(match_stat.awayCorners);
          }
        }else {
          returnVal = this.getGoals(match_stat.homeCorners)+this.getGoals(match_stat.awayCorners);
        }
        break;

      case 'redCards':
        if(val.team){
          switch(val.team){
            case 'h':
              returnVal = this._calcTimings(match_stat.homeRedCards, val, time);break;
            case 'a':
              returnVal = this._calcTimings(match_stat.awayRedCards, val, time);break;
            case 'w':
              if(this.getGoals(match_stat.awayGoals) > this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.awayRedCards, val, time)
              else if(this.getGoals(match_stat.awayGoals) > this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.homeRedCards, val, time); break;
            case 'l':
              if(this.getGoals(match_stat.awayGoals) < this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.awayRedCards, val, time)
              else if(this.getGoals(match_stat.awayGoals) > this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.homeRedCards, val, time); break;
            default:
              returnVal = this.getGoals(match_stat.homeRedCards)+this.getGoals(match_stat.awayRedCards);
          }
        }else {
          returnVal = this.getGoals(match_stat.homeRedCards)+this.getGoals(match_stat.awayRedCards);
        }
        break;
      case 'yellowCards':
        if(val.team){
          switch(val.team){
            case 'h':
              returnVal = this._calcTimings(match_stat.homeYellowCards, val, time);break;
            case 'a':
              returnVal = this._calcTimings(match_stat.awayYellowCards, val, time);break;
            case 'w':
              if(this.getGoals(match_stat.awayGoals) > this.getGoals(match_stat.homeGoals))
              returnVal =  this._calcTimings(match_stat.awayYellowCards, val, time)
              else if(this.getGoals(match_stat.awayGoals) < this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.homeYellowCards, val, time); break;
            case 'l':
              if(this.getGoals(match_stat.awayGoals) < this.getGoals(match_stat.homeGoals))
              returnVal =  this._calcTimings(match_stat.awayYellowCards, val, time)
              else if(this.getGoals(match_stat.awayGoals) > this.getGoals(match_stat.homeGoals))
              returnVal = this._calcTimings(match_stat.homeYellowCards, val, time); break;
            default:
              returnVal = this.getGoals(match_stat.homeYellowCards)+this.getGoals(match_stat.awayYellowCards);
          }
        }else {
          returnVal = this.getGoals(match_stat.homeYellowCards)+this.getGoals(match_stat.awayYellowCards);
        }
        break;
      default:
        returnVal = val.constant;
    }

    return parseInt(returnVal);
  }

  // calculate value with statisticsTimings Array
  private _calcTimings(valueArray, val, time){

    let valArray = (valueArray)?JSON.parse(valueArray):[];
    let returnVal = 0;

    if(val.exm){
      valArray.forEach(element => {
        if(element == val.exm) returnVal++;
      });
    } else if(val.mag) {
      valArray.forEach(element => {
        if(time-element >= val.mag) returnVal++;
      });
    } else if(val.timeRangeFrom) {
      valArray.forEach(element => {
        if(element >= val.timeRangeFrom && element <= val.timeRangeTo) returnVal++;
      });
    }else if(val.offset) {
      valArray.forEach(element => {
        if(time-element <= val.offset && time-element >= 0) returnVal++;
      });
    }
    else if(val.cof) {
      valArray.forEach(element => {
        if(time >= element && element >= val.cof) returnVal++;
      });
    }
    else if(val.cot) {
      valArray.forEach(element => {
        if(element <= val.cot && element <= time && element >= 0) returnVal++;
      });
    }
    else if(val.timerPeriod) {
      switch(val.timerPeriod){
        case 'fh':
        case 'ht':
          valArray.forEach(element => {
            if(element <= 45 && element >= 0) returnVal++;
          }); break;
        case 'sh':
          valArray.forEach(element => {
            if(element >= 45 && element <= 90) returnVal++;
          }); break;
        case 'ft':
          valArray.forEach(element => {
            if(element >= 0 ) returnVal++;
          }); break;
        default:
          break;
      }
    }
    else{
      returnVal = valArray.length;
    }
    return returnVal;
  }

  attachGridColorChangedEvent() {
    this.messageService.applyColorToGridEvent.subscribe((colorPublishData) => {
      if (colorPublishData.gridNumber === this.gridNumber) {
        this.color = colorPublishData.color;
      }
    });
  }

  attachFavouriteMatchesChangedEvent() {
    this.messageService.favouriteMatchesChangedEvent.subscribe((_favouriteMatches) => {
      if (this.isDifferent(_favouriteMatches)) {
        this.favouriteMatches = _favouriteMatches;
        this.initialiseBellStatus();
        this.setTableDataSource(true, true);
      }
    })
  }

  isDifferent(_favouriteMatches: any): Boolean {
    let index;
    const length = this.favouriteMatches.length;

    if (_favouriteMatches.length !== length)
      return true;
    for (index = 0; index < length; index++) {
      const _f = _favouriteMatches[index], f = this.favouriteMatches[index];

      if (_f.favouriteMatchId !== f.favouriteMatchId)
        return true;
    }
    return false;
  }

  setGridIds() {
    this.clubSearchId = 'id_clubsearch_' + this.gridNumber;
    this.myGridId = 'mygrid_' + this.gridNumber;
    this.prevStatId = 'id_prevstate_' + this.gridNumber;
    this.graphId = 'id_graph_' + this.gridNumber;
  }

  setGridFilters() {
    this.activeMainColumnVisibility = this.defaultMainColumnVisibility;
    this.activePreviousStatsColumnVisibility = this.previousStatsColumnVisibility;
    this.activeMiscStatsColumnVisibility = this.miscStatsColumnVisibility;
    this.gamesCurrentlyInFilters = this.defaultGamesCurrentlyInFilters;
    this.miscFilters = this.defaultMiscFilters;
  }

  setGridColor() {
    if (this.isLight()) {
      if (
        this.strategy &&
        this.strategy.colour &&
        '' !== this.strategy.colour
      ) {
        this.color = this.strategy.colour;
      } else {
        this.color = '#146853';
      }
    } else {
      this.color = '#ffd000';
    }
  }

  gridHeaderWidth() {
    environment.headerWidth = 'responsive';
  }

  initialiseGridData() {
    this.__originalData = JSON.parse(JSON.stringify(this.grid.matches));
    this.initialiseBellStatus();
    this._localStore.searchValue.subscribe((value)=>{
      this.searchValue = value;
    })
    if (this.searchValue) {
      this.sortedData = this.searchValueFilter(this.__originalData, this.searchValue);
    } else {
      this.sortedData = this.__originalData;
    }
    const gridtype = this.gridOptions.gridtype;
    this.isDefault = (gridtype == 'default' || gridtype == 'favourites')?true:false;
    if ('strategy' === gridtype && this.strategy) { // For Strategy grid view
      if ('linked' === this.gridOptions.match) { // If Linked is selected
        this.sortedData = this.sortedData.filter(
          data => -1 !== this.linkedMatches.findIndex(
            linked => linked.matchId === data.matchId
          )
        );
      } else { // If Any is selected
        this.sortedData = this.sortedData;
        const statsFilter = this.strategy.statsFilter;
        const correctScoreFilter = this.strategy.correctScoreFilter;
        const additionalFilter = JSON.parse(this.strategy.filtersConfig);
        // for dev
        // const additionalFilter = [{
        //   Comparator:"≥",
        //   Left:{Operator:"",
        //         Val1:{reference:"goals",
        //               team:"h",
        //               mag:20},
        //         Val2:{}
        //       },
        //   Right:{Operator:"",
        //         Val1:{reference:"",
        //             constant:3},
        //         Val2:{}
        //       }
        //   }];
        // end dev
        // Get the stats filters and applies to the matches
        if (this._filter && this.filterInfo) this.sortedData = this.applyAdditionalFilters(this.filterInfo, this.sortedData);
        if (statsFilter && 0 !== statsFilter.length) {
          const filters = JSON.parse(statsFilter);

          filters.forEach(filter => {
            const statType = STATS_FILTER_STAT_TYPE_OPTIONS.find(option => {
              return option.value === filter.StatType;
            });
            const filterType = STAT_FILTER_COMPARARISON_TYPES.find(type => {
              return type.value === filter.Operator;
            });
            const filterValue = filter.Value;

            if (statType && filterType)
              this.activeFilters.push({ statType, filterType, filterValue });
          });
          this.sortedData = this.applyFilters(this.activeFilters, this.sortedData);
        }

        // Applies correct score filters
        if (correctScoreFilter && 0 !== correctScoreFilter.length) {
          const filters = JSON.parse(correctScoreFilter);

          filters.forEach(filter => {
            const filterStr = `${filter.HomeGoals}-${filter.AwayGoals}`;
            this.scoreFilters.push(filterStr);
          });
          this.sortedData = this.applyScoreFilters(this.scoreFilters, this.sortedData);
        }

        //Applies additional filters
        if (additionalFilter && 0 !== additionalFilter.length) {
          const filters = JSON.parse(JSON.stringify(additionalFilter));

          filters.forEach(filter => {
            this.additionalFilters.push(filter);
          });
          this.sortedData = this.applyAdditionalFilters(this.additionalFilters, this.sortedData);
        }

        this.sortedData = this.applyLeagueFilters(this.strategy.leagueFilters, this.sortedData);
      }
    } else if (
      'favourites' === gridtype &&
      0 !== this.favouriteMatches.length
    ) { // For Favourites grid view
      this.sortedData.forEach(match => {
        const favIndex = this.favouriteMatches.findIndex(
          favourite => match.matchId === favourite.matchId
        );
        if (-1 !== favIndex)
          this.sortedData.push(match);
      });
    } else { // For Default and Custom grid view
      this.sortedData = this.sortedData;
      if (this._filter && this.filterInfo) this.sortedData = this.applyAdditionalFilters(this.filterInfo, this.sortedData);
    }
    this.source.totalrecords = this.sortedData.length;
    // set current Match
    this.curMatch = this.sortedData[0];
  }

  initialiseBellStatus() {
    this.__originalData.forEach(match => {
      match.bell = -1 !== this.favouriteIndex(match);
    });
    this.sortedData.forEach(match => {
      match.bell = -1 !== this.favouriteIndex(match);
    });
  }

  ngOnInit(): void {
    this._rootStore.Filters.subscribe((res)=> {
      this._filter = res;
      if (this.filterInfo) {
        this.applyQuickFilters();
        this.before_sorted_flag = false;
        this.setTableDataSource();
      }
    });
    this.getCustomColumnConfig();
    this.initialiseGridData();
    this.setIconVisibility();
    this.setGridIds();
    this.setGridHeight();
    this.setGridFilters();
    this.setHighlightConfig();
    this.setGridColor();
    this.attachColumnVisibiltyChangedEvent();
    this.attachQuickFiltersChangedEvent();
    this.attachPreviousStatsFiltersChangedEvent();
    this.attachGridColorChangedEvent();
    this.gridHeaderWidth();
    this.setGridRowClickColor();
    this.getColumnVisibilityConfig();
    if (this.sortInfo && this.sortInfo.active !== '' && this.sortInfo.direction !== '') {
      this.sortData(this.sortInfo);
    }
  }

  ngOnDestroy(): void {
    if (this.mygrid) {
      this._localStore.setScrollPosition(this.mygrid.scrollposition());
      this._localStore.setSearchValue(this.searchValue);
      this._localStore.setLastTimeSelection(this.lastTimeSelection);
      this._localStore.setGraphType(this.graphType);
    }
    $(`[id*="style_${this.myGridId}"`).remove();
  }

  setIconVisibility(): void {
    if (this.strategy && this.strategy.iconsConfig) {
      this.iconsConfig = JSON.parse(
        this.strategy.iconsConfig
      );
    }
  }

  setHighlightConfig(): void {
    if (this.strategy) {
      if (this.strategy.highlightConfig) {
        this.highlightConfig = JSON.parse(
          this.strategy.highlightConfig
        );
      } else {
        this.highlightConfig = null;
      }
    }

  }

  getColumnVisibilityConfig(): void {
    if (this.strategy && this.strategy.columnVisibilityConfig) {
      this.columnVisibilityConfig = JSON.parse(
        this.strategy.columnVisibilityConfig
      );

    }
  }

  getCustomColumnConfig(): void {
    if (this.strategy && this.strategy.customColumnConfig) {
      this.customColumnConfig = JSON.parse(
        this.strategy.customColumnConfig
      );
    }
  }

  initCustomColumns():void{
    if(this.customColumnConfig){
      this.customColumnConfig.forEach(element => {
        this.source.datafields.push(
          { name: element.key, type:'any'}
        )
        this.columns.push(
          {
            text: element.key,
            datafield: element.key,
            columngroup: 'custom',
            menu: false,
            width: 35,
            renderer: this.headerrenderer,
            cellsrenderer:this.cellsRendererCustom,
            sortable: false,
          }
        )
      });
      this.updateGrid();
    }
  }

  generateCustomData(value, scale, gametime, statisticsTimingsArray):any{
    let count = 0;
    let timingValue = statisticsTimingsArray[value] ? JSON.parse(statisticsTimingsArray[value]) : [];
    if(timingValue){
      timingValue.forEach(val => {
        if(gametime-val >=0 && gametime-val <= scale ) count += 1;
      });
    }

    return count;
  }

  setGridHeight(): void {
    if (this.strategy && this.strategy.gridDisplayConfig) {
      const gridDisplayConfig = JSON.parse(
        this.strategy.gridDisplayConfig
      );
      const { gridHeightByMatches, rowHeight } = gridDisplayConfig;

      this.rowHeight = rowHeight;
      this.tableHeight = rowHeight * gridHeightByMatches + 100;

      if (rowHeight < 50) {
        // Limit the height of club container div
        const styleTag = $(`
          <style id="style_${this.myGridId}_rowHeight">
            #${this.myGridId} .club-wrap {
              max-height: ${rowHeight / 2}px
            }
          </style>
        `);

        $('html > head').append(styleTag);
      }
    }
  }

  setGridRowClickColor(): void {
    if (this.strategy && this.strategy.gridDisplayConfig) {
      const gridDisplayConfig = JSON.parse(
        this.strategy.gridDisplayConfig
      );

      if (gridDisplayConfig) {
        // Add Style tag for selected Row
        const { RowClickPrimary, RowClickSecondary, RowHoverColour } = gridDisplayConfig;
        const styleTag = $(`
          <style id="style_${this.myGridId}_rowColour">
            #${this.myGridId} .first-selected {
              background: ${RowClickPrimary} !important
            }
            #${this.myGridId} div[role="row"]:hover :not(.jqx-grid-cleared-cell):not(.jqx-grid-empty-cell).jqx-grid-cell {
              background: ${RowHoverColour} !important
            }
            #${this.myGridId} .second-selected {
              background: ${RowClickSecondary} !important
            }
          </style>
        `);

        $('html > head').append(styleTag);
      }
    }
  }

  showPopup(param: any): void {
    let elem = null;

    if ('prediction' === param.type) {
      this.currentPredictionId = param.predictionId;
      elem = this.predictionPopup.nativeElement;
    } else if ('note' === param.type) {
      elem = this.notePopup.nativeElement;
      this.currentNoteId = param.noteId;
    } else if ('odd' === param.type) {
      let oddsInfo = {
        preMatchHomeOdds: '-',
        preMatchDrawOdds: '-',
        preMatchAwayOdds: '-'
      };

      if (param.oddsInfo) {
        oddsInfo = param.oddsInfo
      }

      this.currentOdds = {
        home: oddsInfo.preMatchHomeOdds,
        draw: oddsInfo.preMatchDrawOdds,
        away: oddsInfo.preMatchAwayOdds,
      }
      elem = this.oddPopup.nativeElement;
    } else if ('previousStats' === param.type) {
      const { statsType, previousStats } = param;
      let text = '';

      // Generate Text for prevous stats
      if (previousStats) {
        if ('score' == statsType) { // If Goal
          const { homeGoals, awayGoals } = previousStats;

          if (JSON.parse(homeGoals).length) text += `Home Goals on Minute: ${this.changeBracket(homeGoals)}`;
          if (JSON.parse(awayGoals).length) text += `\nAway Goals on Minute: ${this.changeBracket(awayGoals)}`;
        } else {

          text += `Minute: ${this.changeBracket(previousStats)}`;
        }
      }

      // Generate Text for highlight
      if (param.highlightType) {
        const highlightIndex = param.highlightType - 1;
        const { highlightConfig } = this;

        const {
          attackConversionLowValue,
          attackConversionHighValue,
          statsDifferenceLowValue,
          statsDifferenceMediumValue,
          statsDifferenceHighValue
        } = highlightConfig;

        const highlightArray = [
          { type: 'Low', value: attackConversionLowValue },
          { type: 'High', value: attackConversionHighValue },
          { type: 'Low', value: statsDifferenceLowValue },
          { type: 'Medium', value: statsDifferenceMediumValue },
          { type: 'High', value: statsDifferenceHighValue },
        ];
        let highlightText = '';

        if (text.length) {
          text += '\n';
        }

        if (1 >= highlightIndex) {
          text += `Attack Conversion %s By (x %d)`;
        } else {
          text += `Stats Difference %s By (x %d)`;
        }

        text = util.format(
          text,
          highlightArray[highlightIndex].type,
          highlightArray[highlightIndex].value
        );
      }
      this.currentHighlight = text;

      if (this.currentHighlight.length) {
        elem = this.highlightPopup.nativeElement;
      }
    }

    if (null !== elem) {
      elem.style.display = 'block';

      setTimeout(() => {
        this.fitDOMPosition(elem, param.position);
      }, 10);
    }
  }

  changeBracket(input:string) {
    const output = input.replace('[', '(').replace(']', ')');

    return output;
  }

  hidePopups() {
    let elem;

    if (this.predictionPopup.nativeElement) {
      elem = this.predictionPopup.nativeElement;
      elem.style.display = 'none';
    }
    if (this.notePopup.nativeElement) {
      elem = this.notePopup.nativeElement;
      elem.style.display = 'none';
    }
    if (this.oddPopup.nativeElement) {
      elem = this.oddPopup.nativeElement;
      elem.style.display = 'none';
    }
    if (this.highlightPopup.nativeElement) {
      elem = this.highlightPopup.nativeElement;
      elem.style.display = 'none';
    }
  }

  applyScoreFilters(filters, data) {
    let filteredData = data.filter((match) => {
      if (filters && filters.length) {
        return filters.indexOf(match.score) > -1;
      }
      return true;
    });

    return filteredData;
  }

  applyQuickFilters() {
    if (this._filter && this.filterInfo){
      this.sortedData = this.applyAdditionalFilters(this.filterInfo, this.__originalData);
    } else {
      this.sortedData = this.__originalData;
    }
    this.sortedData = this.applyFilters(this.activeFilters, this.sortedData);
    this.sortedData = this.applyScoreFilters(this.scoreFilters, this.sortedData);
    this.sortedData = this.applyAdditionalFilters(this.additionalFilters, this.sortedData);
    if (this.strategy) {
      this.sortedData = this.applyLeagueFilters(this.strategy.leagueFilters, this.sortedData);
    }
    const sortedData = JSON.parse(JSON.stringify(this.sortedData)).filter(
      (match) => match
    );

    if (this.gamesCurrentlyInFilters && this.gamesCurrentlyInFilters.length) {
      let firstHalfCheck = false;
      let secondHalfCheck = false;
      let halfTimeCheck = false;
      let showAllCheck = true;
      this.gamesCurrentlyInFilters.forEach((filterOption) => {
        if (filterOption.key === 'firstHalf') {
          firstHalfCheck = filterOption.applyFilter;
        }

        if (filterOption.key === 'secondHalf') {
          secondHalfCheck = filterOption.applyFilter;
        }

        if (filterOption.key === 'halfTime') {
          halfTimeCheck = filterOption.applyFilter;
        }

        if (filterOption.key === 'showAll') {
          showAllCheck = filterOption.applyFilter;
        }
      });

      let drawCheck = false;
      let underdogCheck = false;
      let lowMomentumCheck = false;
      let highMomentumCheck = false;
      this.miscFilters.forEach((filterOption) => {
        if (filterOption.key === 'draw') {
          drawCheck = filterOption.applyFilter;
        }

        if (filterOption.key === 'underdogWinning') {
          underdogCheck = filterOption.applyFilter;
        }

        if (filterOption.key === 'lowAp') {
          lowMomentumCheck = filterOption.applyFilter;
        }

        if (filterOption.key === 'highAp') {
          highMomentumCheck = filterOption.applyFilter;
        }
      });

      this.sortedData = sortedData.filter((match) => {
        let retValue = showAllCheck;
        const gameTime = parseInt(match.gameTime + '');
        if (halfTimeCheck) {
          retValue = gameTime === 45;
        }

        if (firstHalfCheck) {
          retValue = retValue || gameTime < 45;
        }

        if (secondHalfCheck) {
          retValue = retValue || gameTime > 45;
        }

        return retValue;
      });

      this.sortedData = this.sortedData.filter((match) => {
        if (drawCheck) {
          return (
            this.getGoals(match.statisticsTimings.awayGoals) + '' ===
            this.getGoals(match.statisticsTimings.homeGoals) + ''
          );
        }
        return true;
      });

      this.sortedData = this.sortedData.filter((match) => {
        if (underdogCheck) {
          let isReallyUnderDogPerformance = false;

          if (match && match.preMatchOdds) {
            const underdogBase1 =
              parseFloat(match.preMatchOdds.homeOdds) <= 1.5 &&
              parseFloat(match.preMatchOdds.awayOdds) >= 5.0;
            const underdogBase2 =
              parseFloat(match.preMatchOdds.awayOdds) <= 1.5 &&
              parseFloat(match.preMatchOdds.homeOdds) >= 5.0;
            if (
              underdogBase1 &&
              parseInt(this.getGoals(match.statisticsTimings.awayGoals)) >
              parseInt(this.getGoals(match.statisticsTimings.homeGoals))
            ) {
              isReallyUnderDogPerformance = true;
            } else if (
              underdogBase2 &&
              parseInt(this.getGoals(match.statisticsTimings.homeGoals)) >
              parseInt(this.getGoals(match.statisticsTimings.awayGoals))
            ) {
              isReallyUnderDogPerformance = true;
            }
          }

          return isReallyUnderDogPerformance;
        }
        return true;
      });

      this.sortedData = this.sortedData.filter((match) => {
        if (lowMomentumCheck) {
          var isReallyWithLowMomentum = false;

          if (match && match.homeLast20 && match.awayLast20) {
            if (
              parseInt(match.homeLast20.pressureIndex) <= 30 &&
              parseInt(match.awayLast20.pressureIndex) <= 30
            ) {
              isReallyWithLowMomentum = true;
            }
          }

          return isReallyWithLowMomentum;
        }
        return true;
      });

      this.sortedData = this.sortedData.filter((match) => {
        if (highMomentumCheck) {
          var isReallyWithHighMomentum = false;

          if (match && match.homeLast20 && match.awayLast20) {
            if (
              parseInt(match.homeLast20.pressureIndex) >= 60 &&
              parseInt(match.awayLast20.pressureIndex) >= 30
            ) {
              isReallyWithHighMomentum = true;
            }
          }

          return isReallyWithHighMomentum;
        }
        return true;
      });
    }
  }

  applyFilters(filters, data) {
    let filterdData = [];
    if (!filters.length) {
      filterdData = data.filter((match) => match);
    } else {
      filterdData = JSON.parse(
        JSON.stringify(data)
      ).filter((match) => match);
      filters.forEach((filter) => {
        const field = filter.statType.key;
        const operator = filter.filterType.key;
        const value = filter.filterValue;
        filterdData = this.generateFilteredData(field, operator, value, filterdData);
      });
    }
    return filterdData;
  }

  applyLeagueFilters(leagueFilters, data) {
    const leagueFilterTypeId = this.strategy.leagueFilterTypeId;

    if (null === leagueFilters || 0 === leagueFilterTypeId)
      return data;

    let filters = JSON.parse(leagueFilters);
    let sortedData = data.filter(
      (match) => {
        const isInFilter = filters.includes(match.leagueName);

        if (1 === leagueFilterTypeId)
          return true === isInFilter;
        return false === isInFilter;
      }
    );

    return sortedData;
  }

  generateFilteredData(field, operator, value, data) {
    return data.filter((match) => {
      if (operator == 'equals') {
        return match['statistics'][field] == value;
      } else if (operator == 'lessThan') {
        return parseInt(match['statistics'][field] + '') < parseInt(value + '');
      } else if (operator == 'lessThanEquals') {
        return (
          parseInt(match['statistics'][field] + '') <= parseInt(value + '')
        );
      } else if (operator == 'greaterThan') {
        return parseInt(match['statistics'][field] + '') > parseInt(value + '');
      } else if (operator == 'greaterThanEquals') {
        return (
          parseInt(match['statistics'][field] + '') >= parseInt(value + '')
        );
      }
      return true;
    });
  }

  open(popUpContent) {
    this.modalService
      .open(popUpContent, { ariaLabelledBy: 'modal-basic-title', size: 'xl', windowClass: 'stats-filter-popup' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  public isVisible(type, key) {
    var visibility = true;
    if (type === 'main') {
      this.activeMainColumnVisibility.forEach((condition) => {
        if (condition && condition.key === key) {
          visibility = condition.visible;
        }
      });
    } else if (type === 'previous') {
      this.activePreviousStatsColumnVisibility.forEach((condition) => {
        if (condition && condition.key === key) {
          visibility = condition.visible;
        }
      });
    } else if (type === 'misc') {
      this.activeMiscStatsColumnVisibility.forEach((condition) => {
        if (condition && condition.key === key) {
          visibility = condition.visible;
        }
      });
    }
    return visibility;
  }

  removeMatch(matchId) {
    this.sortedData = this.sortedData.filter((match) => {
      return match.matchId !== matchId;
    });
  }

  gridToggle() {
    this.gridNameEdit = true;
    // alert(this.gridNameEdit)
  }

  isLight() {
    return environment.theme == 'light';
  }

  selectDropdownValue(value) {
    this.lastTimeSelection = value;
  }

  saveEditable() {
    this.grid.name = this.gridName;
    this.gridNameEdit = false;
  }

  cancelEditable() {
    this.gridName = this.grid.name;
    this.gridNameEdit = false;
  }

  timeSelection(match, team, timePeriod) {
    return {
      shotsOnTarget: this.getGoalsTime(match.statisticsTimings[team+'ShotsOnTarget'], timePeriod),
      shotsOffTarget: this.getGoalsTime(match.statisticsTimings[team+'ShotsOffTarget'], timePeriod),
      attacks: this.getGoalsTime(match.statisticsTimings[team+'Attacks'], timePeriod),
      dangerousAttacks: this.getGoalsTime(match.statisticsTimings[team+'DangerousAttacks'], timePeriod),
      corners: this.getGoalsTime(match.statisticsTimings[team+'Corners'], timePeriod),
      goals: this.getGoalsTime(match.statisticsTimings[team+'Goals'], timePeriod),
      pressureIndex: match[team + this.lastTimeSelection.name].pressureIndex
    }
  }
  getLastSelectionInfo(a, b) {
    let timePeriod;
    switch (this.lastTimeSelection.name) {
      case 'Last5':
        timePeriod = 5;
        break;
      case 'Last10':
        timePeriod = 10;
        break;  
      case 'Last20':
        timePeriod = 20;
        break;
      default:
        timePeriod = 5;
    }
    const aHomeLastSelection = this.timeSelection(a, 'home', timePeriod);
    const aAwayLastSelection = this.timeSelection(a, 'away', timePeriod);
    const bHomeLastSelection = this.timeSelection(b, 'home', timePeriod);
    const bAwayLastSelection = this.timeSelection(b, 'away', timePeriod);
    return {
      aTotalLastAttacks:
        parseInt(aHomeLastSelection.attacks) +
        parseInt(aAwayLastSelection.attacks),
      bTotalLastAttacks:
        parseInt(bHomeLastSelection.attacks) +
        parseInt(bAwayLastSelection.attacks),
      aTotalLastDangerousAttacks:
        parseInt(aHomeLastSelection.dangerousAttacks) +
        parseInt(aAwayLastSelection.dangerousAttacks),
      bTotalLastDangerousAttacks:
        parseInt(bHomeLastSelection.dangerousAttacks) +
        parseInt(bAwayLastSelection.dangerousAttacks),
      aTotalLastOnTarget:
        parseInt(aHomeLastSelection.shotsOnTarget) +
        parseInt(aAwayLastSelection.shotsOnTarget),
      bTotalLastOnTarget:
        parseInt(bHomeLastSelection.shotsOnTarget) +
        parseInt(bAwayLastSelection.shotsOnTarget),
      aTotalLastOffTarget:
        parseInt(aHomeLastSelection.shotsOffTarget) +
        parseInt(aAwayLastSelection.shotsOffTarget),
      bTotalLastOffTarget:
        parseInt(bHomeLastSelection.shotsOffTarget) +
        parseInt(bAwayLastSelection.shotsOffTarget),
      aTotalLastCorners:
        parseInt(aHomeLastSelection.corners) +
        parseInt(aAwayLastSelection.corners),
      bTotalLastCorners:
        parseInt(bHomeLastSelection.corners) +
        parseInt(bAwayLastSelection.corners),
      aTotalLastGoals:
        parseInt(aHomeLastSelection.goals) +
        parseInt(aAwayLastSelection.goals),
      bTotalLastGoals:
        parseInt(bHomeLastSelection.goals) +
        parseInt(bAwayLastSelection.goals),
      aTotalLastPressureIndex:
        parseInt(aHomeLastSelection.pressureIndex) +
        parseInt(aAwayLastSelection.pressureIndex),
      bTotalLastPressureIndex:
        parseInt(bHomeLastSelection.pressureIndex) +
        parseInt(bAwayLastSelection.pressureIndex),
    };
  }

  gridSortComparator(matchObjectA: any, matchObjectB: any, strategy: string, sortAscending: boolean) {
    const lastSelectionInfo = this.getLastSelectionInfo(matchObjectA, matchObjectB);
    const match_statA = matchObjectA.statisticsTimings;
    const match_statB = matchObjectA.statisticsTimings;
    switch (strategy) {
      case 'gameTime':

        return compare(parseInt(matchObjectA.gameTime), parseInt(matchObjectB.gameTime), sortAscending);
      // case 'custom':

      // return compare(parseInt(matchObjectA.customColumn), parseInt(matchObjectB.customColumn), sortAscending);
      case 'score':

        return compare(parseInt(this.getGoals(match_statA.homeGoals))+parseInt(this.getGoals(match_statA.awayGoals)), parseInt(this.getGoals(match_statB.homeGoals))+parseInt(this.getGoals(match_statB.awayGoals)), sortAscending);
      case 'liveHomeOdds':

        return compare(parseFloat(matchObjectA.odds.liveHomeOdds), parseFloat(matchObjectB.odds.liveHomeOdds), sortAscending);
      case 'liveDrawOdds':

        return compare(parseFloat(matchObjectA.odds.liveDrawOdds), parseFloat(matchObjectB.odds.liveDrawOdds), sortAscending);
      case 'liveAwayOdds':

        return compare(parseFloat(matchObjectA.odds.liveAwayOdds), parseFloat(matchObjectB.odds.liveAwayOdds), sortAscending);
      case 'attacks':

        return compare(parseInt(this.getGoals(match_statA.homeAttacks))+parseInt(this.getGoals(match_statA.awayAttacks)), parseInt(this.getGoals(match_statB.homeAttacks))+parseInt(this.getGoals(match_statB.awayAttacks)), sortAscending);
      case 'dangerousAttacks':

        return compare(parseInt(this.getGoals(match_statA.homeDangerousAttacks))+parseInt(this.getGoals(match_statA.awayDangerousAttacks)), parseInt(this.getGoals(match_statB.homeDangerousAttacks))+parseInt(this.getGoals(match_statB.awayDangerousAttacks)), sortAscending);
      case 'offTarget':

        return compare(parseInt(this.getGoals(match_statA.homeShotsOffTarget))+parseInt(this.getGoals(match_statA.awayShotsOffTarget)), parseInt(this.getGoals(match_statB.homeShotsOffTarget))+parseInt(this.getGoals(match_statB.awayShotsOffTarget)), sortAscending);
      case 'onTarget':

        return compare(parseInt(this.getGoals(match_statA.homeShotsOnTarget))+parseInt(this.getGoals(match_statA.awayShotsOnTarget)), parseInt(this.getGoals(match_statB.homeShotsOnTarget))+parseInt(this.getGoals(match_statB.awayShotsOnTarget)), sortAscending);
      case 'corners':
        return compare(parseInt(this.getGoals(match_statA.homeCorners))+parseInt(this.getGoals(match_statA.awayCorners)), parseInt(this.getGoals(match_statB.homeCorners))+parseInt(this.getGoals(match_statB.awayCorners)), sortAscending);
      case 'yellowCards':

        return compare(parseInt(this.getGoals(match_statA.homeYellowCards))+parseInt(this.getGoals(match_statA.awayYellowCards)), parseInt(this.getGoals(match_statB.homeYellowCards))+parseInt(this.getGoals(match_statB.awayYellowCards)), sortAscending);
      case 'redCards':

        return compare(parseInt(this.getGoals(match_statA.homeRedCards))+parseInt(this.getGoals(match_statA.awayRedCards)), parseInt(this.getGoals(match_statB.homeRedCards))+parseInt(this.getGoals(match_statB.awayRedCards)), sortAscending);
      case 'attackConversion':
        const homeAttackConversionA: number = Math.round((this.getGoals(match_statA.homeDangerousAttacks) / this.getGoals(match_statA.homeAttacks)) * 100);
        const awayAttackConversionA: number = Math.round((this.getGoals(match_statA.awayDangerousAttacks) / this.getGoals(match_statA.awayAttacks)) * 100);
        const homeAttackConversionB: number = Math.round((this.getGoals(match_statB.homeDangerousAttacks) / this.getGoals(match_statB.homeAttacks)) * 100);
        const awayAttackConversionB: number = Math.round((this.getGoals(match_statB.awayDangerousAttacks) / this.getGoals(match_statB.awayAttacks)) * 100);
        let conversionA =
          (Infinity === homeAttackConversionA ? 0 : homeAttackConversionA) +
          (Infinity === awayAttackConversionA ? 0 : awayAttackConversionA);
        let conversionB =
          (Infinity === homeAttackConversionB ? 0 : homeAttackConversionB) +
          (Infinity === awayAttackConversionB ? 0 : awayAttackConversionB);

        return compare(conversionA, conversionB, sortAscending);
      case 'graphicalData1':
        return compare(
          this.getChartAverage(matchObjectA.graphicalData1.home) + this.getChartAverage(matchObjectA.graphicalData1.away),
          this.getChartAverage(matchObjectB.graphicalData1.home) + this.getChartAverage(matchObjectB.graphicalData1.away),
          sortAscending
        );
      case 'graphicalData2':
        return compare(
          this.getChartAverage(matchObjectA.graphicalData2.home) + this.getChartAverage(matchObjectA.graphicalData2.away),
          this.getChartAverage(matchObjectB.graphicalData2.home) + this.getChartAverage(matchObjectB.graphicalData2.away),
          sortAscending
        );
      case 'lastAttacks':
        return compare(
          lastSelectionInfo.aTotalLastAttacks,
          lastSelectionInfo.bTotalLastAttacks,
          sortAscending
        );
      case 'lastDangerousAttacks':
        return compare(
          lastSelectionInfo.aTotalLastDangerousAttacks,
          lastSelectionInfo.bTotalLastDangerousAttacks,
          sortAscending
        );
      case 'lastOffTarget':
        return compare(
          lastSelectionInfo.aTotalLastOffTarget,
          lastSelectionInfo.bTotalLastOffTarget,
          sortAscending
        );
      case 'lastOnTarget':
        return compare(
          lastSelectionInfo.aTotalLastOnTarget,
          lastSelectionInfo.bTotalLastOnTarget,
          sortAscending
        );
      case 'lastCorners':
        return compare(
          lastSelectionInfo.aTotalLastCorners,
          lastSelectionInfo.bTotalLastCorners,
          sortAscending
        );
      case 'goals':
        return compare(
          lastSelectionInfo.aTotalLastGoals,
          lastSelectionInfo.bTotalLastGoals,
          sortAscending
        );
      case 'pressureIndex':
        return compare(
          lastSelectionInfo.aTotalLastPressureIndex,
          lastSelectionInfo.bTotalLastPressureIndex,
          sortAscending
        );
      // case 'totalPossession': return compare(parseInt(matchObjectA.statistics.totalHomePossession)+parseInt(matchObjectA.statistics.totalAwayPossession), parseInt(matchObjectB.statistics.totalHomePossession)+parseInt(matchObjectB.statistics.totalAwayPossession), sortAscending);
      case 'bell':
        return compare(matchObjectA.bell, matchObjectB.bell, sortAscending);
      default:
        return 0;
    }
  }

  headerrenderer = (value, align, columnsheight) => {

    if (value === 'club') {
      let ret = '<div style="padding: 13px 10px;">';

      const defaultValue = this.searchValue || '';

      ret += '<input type="text" id="' + this.clubSearchId + '" value="' + defaultValue + '">';

      ret += '</div>';
      return ret;
    }

    let text: any = '';
    if (value === 'momentum') {
      text = 'Momentum';
    }
    if(value.includes('custom')) return '<div class="grid-header-column "><img src="assets/img/psd/' + 'custom' + '.png")>' + '</div>';
    else return '<div class="grid-header-column "><img src="assets/img/psd/' + value + '.png")>' + text + '</div>';
  };

  cellsRendererNormal = (row, columnfield, value, defaulthtml, columnproperties) => {
    if (value === '') {
      return '';
    }
    switch (columnfield) {
      case 'gameTime':
      case 'score':
        const goals = this.getPreviousStats(row, columnfield);

        return `
          <div class="cellfont">
            <span
              class="stats"
              data-stats-type=${columnfield}
              data-previous-stats=${goals}
            > ${value} </span>
          </div>`;
      case 'bell':
        return '<div class="grid-header-column"><img id="id_grid_bell" src="assets/img/psd/' + value + '.png"></div>';
      case 'remove':
        return '<div class="grid-header-column"><img id="id_grid_remove" src="assets/img/psd/' + value + '.png"></div>';
      case 'liveHomeOdds':
      case 'liveAwayOdds':
      case 'liveDrawOdds':
        return `
        <div class="cellfont">
          <span id="id_grid_odd" data-odd-index=${row}>
            ${'-' === value ? '-' : parseFloat(value).toPrecision(2)}
          </span>
        </div>`;
      default:
        const json_value = JSON.parse(value);
        const value1 = (json_value.value1)?json_value.value1:0;
        const value2 = (json_value.value2)?json_value.value2:0;
        let color1 = 'transparent', color2 = 'transparent';
        let highlightType1 = 0, highlightType2 = 0;
        const {
          attackLow,
          attackHigh,
          statLow,
          statMedium,
          statHigh
        } = HIGHLIGHT_INFO;
        let shape = 'rect';
        // Set highlight colour if value satisfies highlight condition
        if (this.highlightConfig ) {
          const {
            attackConversionLowValue,
            attackConversionHighValue,
            attackConversionLowColour,
            attackConversionHighColour,
            statsDifferenceLowValue,
            statsDifferenceLowColour,
            statsDifferenceMediumValue,
            statsDifferenceMediumColour,
            statsDifferenceHighValue,
            statsDifferenceHighColour,
          } = this.highlightConfig;

          shape = this.highlightConfig.shape;
          if (0 != value1 && 0 != value2) {
            if ('attackConversion' === columnfield) {
              const lowValue = attackConversionLowValue * 100;
              const highValue = attackConversionHighValue * 100;
              const lowColour = attackConversionLowColour;
              const highColour = attackConversionHighColour;

              if (highValue && value1 > highValue) {
                color1 = highColour;
                highlightType1 = attackHigh ;
              } else if (lowValue && value1 < lowValue) {
                color1 = lowColour;
                highlightType1 = attackLow;
              }
              if (highValue && value2 > highValue) {
                color2 = highColour;
                highlightType2 = attackHigh;
              } else if (lowValue && value2 < lowValue) {
                color2 = lowColour;
                highlightType2 = attackLow;
              }
            } else {
              const lowValue = statsDifferenceLowValue;
              const lowColour = statsDifferenceLowColour;
              const mediumValue = statsDifferenceMediumValue;
              const mediumColour = statsDifferenceMediumColour;
              const highValue = statsDifferenceHighValue;
              const highColour = statsDifferenceHighColour;

              if (highValue && value1 >= value2 * highValue) {
                color1 = highColour;
                highlightType1 = statHigh;
              } else if (mediumValue && value1 >= value2 * mediumValue) {
                color1 = mediumColour;
                highlightType1 = statMedium;
              } else if (lowValue && value1 >= value2 * lowValue) {
                color1 = lowColour;
                highlightType1 = statLow;
              } else if (highValue && value2 >= value1 * highValue) {
                color2 = highColour;
                highlightType2 = statHigh;
              } else if (mediumValue && value2 >= value1 * mediumValue) {
                color2 = mediumColour;
                highlightType2 = statMedium;
              } else if (lowValue && value2 >= value1 * lowValue) {
                color2 = lowColour;
                highlightType2 = statLow;
              }
            }
          }
        }

        // Get Previous Stats
        const homePreviousStats = this.getPreviousStats(row, columnfield, true);
        const awayPreviousStats = this.getPreviousStats(row, columnfield, false);

        // const textColor1 = (this.isDefault)?'black':this.getComplementoryColor(color1);
        // const textColor2 = (this.isDefault)?'black':this.getComplementoryColor(color2);
        const textColor1 = 'black';
        const textColor2 = 'black';
        return `
        <div class="cellfont">
          <div
            class="stats ${'transparent' === color1 ? '' : 'stats-highlight'}"
            style="background-color:${color1};color:${textColor1};${shape === 'circle' ? 'border-radius: 50%;': ''}"
            data-highlight=${highlightType1}
            data-stats-type=${columnfield}
            data-previous-stats = ${homePreviousStats}
          >
            <span>${value1}</span>
          </div>
          <div
            class="stats ${'transparent' === color2 ? '' : 'stats-highlight'}"
            style="background-color:${color2};color:${textColor2};${shape === 'circle' ? 'border-radius: 50%;': ''}"
            data-highlight=${highlightType2}
            data-stats-type=${columnfield}
            data-previous-stats = ${awayPreviousStats}
          >
            <span>${value2}</span>
          </div>
        </div>`;
    }
  };

  cellsRendererCustom = (row, columnfield, value, defaulthtml, columnproperties) => {
    if (value === '') {
      return '';
    }

    return `
      <div class="cellfont">
        <span
          class="stats"
          data-stats-type=${columnfield}
        > ${value} </span>
      </div>`;

  };

  getPreviousStats(index: number, columnfield: string, isHome: boolean = true) {
    const match = this.sortedData[index];
    const { statisticsTimings } = match;
    const datafield = (isHome ? 'home': 'away') + columnfield;
    const datafieldList = {
      homeonTarget: "homeShotsOnTarget",
      homeoffTarget: "homeShotsOffTarget",
      homecorners: "homeCorners",
      homeyellowCards: "homeYellowCards",
      homeredCards: "awayRedCards",
      awayonTarget: "awayShotsOnTarget",
      awayoffTarget: "awayShotsOffTarget",
      awaycorners: "awayCorners",
      awayyellowCards: "awayYellowCards",
      awayredCards: "awayRedCards",
    };

    if ('score' === columnfield) {
      const { homeGoals, awayGoals } = statisticsTimings;
      return  encodeURIComponent(JSON.stringify({ homeGoals, awayGoals }));
    }

    const statField = datafieldList[datafield];

    if (statField) {
      return encodeURIComponent(JSON.stringify(statisticsTimings[
        statField
      ]));
    } else {
      return encodeURIComponent(null);
    }

  }

  getComplementoryColor(color): string {
    let textColor: string = 'black';

    if ('transparent' !== color && color && 0 !== color.length) {
      const textColorHex = 0xffffff - parseInt(color.slice(1), 16);
      textColor = '#' + textColorHex.toString(16);
    }
    return textColor;
  }

  cellsrenderer_club = (row, columnfield, val, defaulthtml, columnproperties) => {
    if (val == '') {
      return '';
    }
    let value = JSON.parse(val);
    let match = value.match;
    let encoded_match = encodeURIComponent(JSON.stringify(value.match));
    let home: any = { Image: '', Name: '', Position: '', Prediction: '', Note: '' };
    if (match.homeImage && match.homeImage.imageUrl) {
      home.Image = '<img src="' + match.homeImage.imageUrl + '" style="width:25px !important;">';
    } else {
      home.Image = '<img src="assets//img//badge.png" style="width:25px !important">';
    }
    home.Name = match.homeName;
    if (
      match.homePosition !== undefined &&
      match.homePosition != 0
    ) {
      home.Position = '<span style="margin-left: 3px;">(' + match.homePosition + ')</span>';
    }

    let away: any = { Image: '', Name: '', Position: '', Prediction: '', Note: '' };
    if (match.awayImage && match.awayImage.imageUrl) {
      away.Image = '<img src="' + match.awayImage.imageUrl + '" style="width:25px !important;">';
    } else {
      away.Image = '<img src="assets//img//badge.png" style="width:25px !important">';
    }

    away.Name = match.awayName;
    if (
      match.awayPosition !== undefined &&
      match.awayPosition !== 0
    ) {
      away.Position = '<span style="margin-left: 3px;">(' + match.awayPosition + ')</span>';
    }

    this.userPredictions.forEach((userPrediction, index) => {
      if (match.matchId == userPrediction.matchId) {
        home.Prediction = '<img src="assets/img/psd/prediction.png" data-pred-id="' + index + '" style="width:18px !important; cursor: pointer;  margin-left: 5px;">';
        away.Prediction = '<img src="assets/img/psd/prediction.png" data-pred-id="' + index + '" style="width:18px !important; cursor: pointer;  margin-left: 5px;">';
        if (userPrediction.noteBody &&
          userPrediction.noteBody.length) {
          home.Note = '<img src="assets/img/note.png" data-note-id="' + index + '" style="width:18px !important; cursor: pointer;  margin-left: 5px;">';
          away.Note = '<img src="assets/img/note.png" data-note-id="' + index + '" style="width:18px !important; cursor: pointer;  margin-left: 5px;">';
        }
      }
    });

    let ret = '<div class="row cellfont" style="align-items: unset; margin-left: 15px;">' +
      '<div class="club-wrap">' +
      home.Image +
      home.Name +
      home.Position +
      '<img id="id_club_info" data-club-key="' + row + '" data-club-info="' + encoded_match + '" data-club-type="Home" src="assets/img/psd/info.png" style="width:18px !important; cursor: pointer;  margin-left: 15px;">' +
      home.Prediction +
      home.Note +
      '</div>' +
      '<div  class="club-wrap">' +
      away.Image +
      away.Name +
      away.Position +
      '<img id="id_club_info" data-club-key="' + row + '" data-club-info="' + encoded_match + '" data-club-type="Away" src="assets/img/psd/info.png" style="width:18px !important; cursor: pointer;  margin-left: 15px;">' +
      away.Prediction +
      away.Note +
      '</div>' +
      '</div>';
    return ret;
  };

  createGraphWidget(row: any, column: any, value: any, htmlElement: HTMLElement) {
    const boundData = row.bounddata;
    const momentumDataString = boundData.momentum;

    if (momentumDataString === '' || momentumDataString === undefined) {
      return;
    }

    const barGraphData = JSON.parse(momentumDataString);
    const boundIndex = boundData.boundindex;

    this.drawGraphWidget(boundIndex, barGraphData, htmlElement);
  }

  initialiseGraphWidget(row: number, column: any, value: any, htmlElement: HTMLElement) {
    if (value === '' || value === undefined) {
      return;
    }
    const barGraphData = JSON.parse(value);
    this.drawGraphWidget(row, barGraphData, htmlElement);
  }

  drawGraphWidget(boundIndex: number, barGraphData: number[], htmlElement: HTMLElement) {
    const createGraphElement = () => {
      htmlElement.innerHTML = '';

      const container = document.createElement('div');

      htmlElement.appendChild(container);

      const result = (this.graphType != 'Line')?
        this.loadMomentumGraphComponent(MomentumGraphComponent, container):
        this.loadMomentumGraphComponent(MomentumLineChartComponent, container);
      const momentumComponent = (this.graphType != 'Line')?
        (result.componentRef.instance as MomentumGraphComponent):
        (result.componentRef.instance as MomentumLineChartComponent);
      momentumComponent.dataOptions = {
        ...barGraphData,
        strategy: this.strategy,
        rowHeight: this.rowHeight
      };
    };
    const timerKey: string = 'momentum-' + boundIndex;
    if (this.momentinumTimer[timerKey]) {
      clearTimeout(this.momentinumTimer[timerKey]);
    }
    this.momentinumTimer[timerKey] = setTimeout(() => {
      delete this.momentinumTimer[timerKey];
      createGraphElement();
      // refresh scroll
      if (this.scrollRefreshTimer) {
        clearTimeout(this.scrollRefreshTimer);
        this.scrollRefreshTimer = null;
      }
      this.scrollRefreshTimer = setTimeout(() => {
        this.scrollRefreshTimer = null;
        const scroll = this.mygrid.scrollposition();
        if (scroll.top === 0) {
          window.dispatchEvent(new Event('resize'));
        }
      }, MOMENT_TIMEOUT);
    }, MOMENT_TIMEOUT);
  }

  cellsRendererChart = (row, columnfield, val, defaulthtml, columnproperties) => {
    if (val == '') {
      return '';
    }

    let value = JSON.parse(val);
    let match = value.match;
    let encoded_match = encodeURIComponent(JSON.stringify(value.match));
    let home: any = 0;
    let away: any = 0;
    let chart_no = 0;

    switch (columnfield) {
      case 'graphicalData1':
        home = this.getChartAverage(match.graphicalData1.home);
        away = this.getChartAverage(match.graphicalData1.away);
        chart_no = 1;
        break;
      case 'graphicalData2':
        home = this.getChartAverage(match.graphicalData2.home);
        away = this.getChartAverage(match.graphicalData2.away);
        chart_no = 2;
        break;
      default:
        break;
    }
    let ret = '<div class="row cellfont">' +
      '<span id="id_chart_info' + chart_no + '" data-chart-key="' + row + '" data-chart-info="' + encoded_match + '" data-chart-type="Home" style="cursor: pointer;">' +
      home +
      '</span>' +
      '<span id="id_chart_info' + chart_no + '" data-chart-key="' + row + '" data-chart-info="' + encoded_match + '" data-chart-type="Away" style="cursor: pointer;">' +
      away +
      '</span>' +
      '</div>';
    return ret;
  };

  _columns: any[] = [
    {
      text: 'game_time',
      datafield: 'gameTime',
      columngroup: 'matchInfo',
      menu: false,
      width: 35,
      renderer: this.headerrenderer,
      cellsrenderer: this.cellsRendererNormal,
      sortable: true,
    },
    {
      text: 'ball',
      datafield: 'score',
      columngroup: 'matchInfo',
      menu: false,
      width: 28,
      renderer: this.headerrenderer,
      cellsrenderer: this.cellsRendererNormal,
    },
    {
      text: 'club',
      datafield: 'clubName',
      columngroup: 'matchInfo',
      menu: false,
      minwidth: 220,
      filterable: true,
      renderer: this.headerrenderer,
      cellsrenderer: this.cellsrenderer_club,
      sortable: false,
    },
    {
      text: 'homeOdds',
      datafield: 'liveHomeOdds',
      columngroup: 'matchInfo',
      menu: false,
      width: 35,
      renderer: this.headerrenderer,
      cellsrenderer: this.cellsRendererNormal,
    },
    {
      text: 'drawOdds',
      datafield: 'liveDrawOdds',
      columngroup: 'matchInfo',
      menu: false,
      width: 35,
      renderer: this.headerrenderer,
      cellsrenderer: this.cellsRendererNormal,
    },
    {
      text: 'awayOdds',
      datafield: 'liveAwayOdds',
      columngroup: 'matchInfo',
      menu: false,
      width: 35,
      renderer: this.headerrenderer,
      cellsrenderer: this.cellsRendererNormal,
    },
    {
      text: 'shots_on',
      datafield: 'onTarget',
      columngroup: 'matchInfo',
      menu: false,
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer
    },
    {
      text: 'shots_off',
      datafield: 'offTarget',
      columngroup: 'matchInfo',
      menu: false,
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer
    },
    {
      text: 'attack',
      datafield: 'attacks',
      columngroup: 'matchInfo',
      width: 35,
      menu: false,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer
    },
    {
      text: 'd_attack',
      datafield: 'dangerousAttacks',
      columngroup: 'matchInfo',
      menu: false,
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer
    },
    {
      text: 'conversion',
      datafield: 'attackConversion',
      columngroup: 'matchInfo',
      menu: false,
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer
    },
    {
      text: 'corner',
      datafield: 'corners',
      columngroup: 'matchInfo',
      width: 35,
      menu: false,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer
    },
    {
      text: 'possession',
      datafield: 'possession',
      columngroup: 'matchInfo',
      menu: false,
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer,
      sortable: true
    },
    {
      text: 'yellow_card',
      datafield: 'yellowCards',
      columngroup: 'matchInfo',
      menu: false,
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer
    },
    {
      text: 'red_card',
      datafield: 'redCards',
      columngroup: 'matchInfo',
      menu: false,
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer
    },
    {
      text: 'chart1',
      datafield: 'graphicalData1',
      columngroup: 'matchInfo',
      menu: false,
      width: 35,
      renderer: this.headerrenderer,
      cellsrenderer: this.cellsRendererChart,
      sortable: true
    },
    {
      text: 'chart2',
      datafield: 'graphicalData2',
      columngroup: 'matchInfo',
      menu: false,
      width: 35,
      renderer: this.headerrenderer,
      cellsrenderer: this.cellsRendererChart,
      cellclassname: 'borderlessRow',
      classname: 'borderlessRow',
      sortable: true
    },
    {
      text: 'shots_on',
      datafield: 'lastOnTarget',
      columngroup: 'previousStats',
      menu: false,
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer,
      sortable: true
    },
    {
      text: 'shots_off',
      datafield: 'lastOffTarget',
      columngroup: 'previousStats',
      menu: false,
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer,
      sortable: true
    },
    {
      text: 'attack',
      datafield: 'lastAttacks',
      columngroup: 'previousStats',
      menu: false,
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer,
      sortable: true
    },
    {
      text: 'd_attack',
      datafield: 'lastDangerousAttacks',
      menu: false,
      columngroup: 'previousStats',
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer,
      sortable: true
    },
    {
      text: 'corner',
      datafield: 'lastCorners',
      menu: false,
      columngroup: 'previousStats',
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer,
      sortable: true
    },
    {
      text: 'ball',
      datafield: 'goals',
      columngroup: 'previousStats',
      menu: false,
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer,
      sortable: true
    },
    {
      text: 'pressure',
      datafield: 'pressureIndex',
      columngroup: 'previousStats',
      menu: false,
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer,
      cellclassname: 'borderlessRow',
      classname: 'borderlessRow',
      sortable: true
    },
    {
      text: 'momentum',
      datafield: 'momentum',
      columngroup: 'momentumGraph',
      menu: false,
      width: MOMENTUM_WIDTH,
      createwidget: (row: any, column: any, value: any, htmlElement: HTMLElement): void => this.createGraphWidget(row, column, value, htmlElement),

      initwidget: (row: any, column: any, value: any, htmlElement: HTMLElement) => this.initialiseGraphWidget(row, column, value, htmlElement),
      renderer: this.headerrenderer,
      sortable: false
    },
    {
      text: 'bell',
      datafield: 'bell',
      columngroup: 'momentumGraph',
      menu: false,
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer,
      sortable: false
    },
    {
      text: 'trash',
      datafield: 'remove',
      columngroup: 'momentumGraph',
      menu: false,
      width: 35,
      cellsrenderer: this.cellsRendererNormal,
      renderer: this.headerrenderer,
      sortable: false
    },
  ];

  columns = [];
  columnOrderConfig = [];
  isResettingColumns = false;

  getChartAverage(data): any {
    let avg = 0;
    if (data.length) {
      for (let i = 0; i < data.length; i++) {
        avg += data[i];
      }
      avg /= data.length;
    }
    return Math.ceil(avg);
  }

  loadMomentumGraphComponent(component: any, ownerElement: any) {
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector, ownerElement);

    this.appRef.attachView(componentRef.hostView);


    const domElement = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    if (ownerElement) {
      ownerElement.appendChild(domElement);
    }

    this.componentRef = componentRef;

    return { componentRef, domElement };
  }

  fitDOMPosition(dom: any, position, isSplineChart = false) {
    const boundRect: any = dom.getBoundingClientRect();
    let width;
    let state: any = 0;

    if (isSplineChart) {
      width = Math.max(MAX_SPLINE_WIDTH / 120 * 90, boundRect.width);
    } else {
      width = boundRect.width;
    }

    dom.style.left = Math.max(position.x - width / 2, 0) + 'px';

    dom.style.top = (position.y + 35) + 'px';


    const dom_bottom = parseInt(dom.style.top) + dom.offsetHeight;

    const window_bottom = window.innerHeight;
    if (dom_bottom > window_bottom) {
      dom.style.top = (position.y - dom.offsetHeight - 35) + 'px';
      state = 1;
    }

    return { pos: Math.min(width / 2, position.x), state };
  }

  onClubInfoClick(res: any) {
    this.curMatch = res.match;
    let elem: any;
    if (res.value == 'Home') {
      elem = this.homeFormPop.nativeElement;
      elem.style.display = 'block';

    } else if (res.value == 'Away') {
      elem = this.awayFormPop.nativeElement;
      elem.style.display = 'block';
    }

    this.popover_pos = this.fitDOMPosition(elem, res.position);
  }

  onGraph1InfoClick(res: any) {
    this.curMatch = res.match;
    let elem: any;

    elem = this.matchMomentum1.nativeElement;
    elem.style.display = 'block';

    this.popover_pos = this.fitDOMPosition(elem, res.position, true);
  }

  onGraph2InfoClick(res: any) {
    this.curMatch = res.match;
    let elem: any;

    elem = this.matchMomentum2.nativeElement;
    elem.style.display = 'block';
    this.popover_pos = this.fitDOMPosition(elem, res.position, true);
  }

  // getRealColumnIndex(index: number): number {
  //   let i, realIndex = 0;

  //   for (i = 0; i <= index; ) {
  //     const currentColumn = this.draggableColumns[
  //       this.columnOrder[realIndex]
  //     ];

  //     if (this.isVisibleColumn(currentColumn)) {
  //       i ++;
  //     }
  //     realIndex ++;
  //   }
  //   return realIndex - 1;
  // }

  handleColumnDragAndDrop(event: any): void {
    if (!this.strategy || this.isResettingColumns)
      return;

    // const oldIndex = event.args.oldindex - 3;
    // const newIndex = event.args.newindex - 3;
    // let realOldIndex = this.getRealColumnIndex(oldIndex);
    // let realNewIndex = this.getRealColumnIndex(newIndex);
    // let temp, direction = 1, i;

    // if (realNewIndex < realOldIndex) {
    //   direction = -1;
    // }
    // temp = this.columnOrder[realOldIndex];
    // for (i = realOldIndex; i != realNewIndex; i += direction) {
    //   this.columnOrder[i] = this.columnOrder[i + direction];
    // }
    // this.columnOrder[i] = temp;
    // this.saveColumnOrder();
  }

  initColumns(): void {
    // inits column order from strategy
    this.columnOrderConfig = [];

    if (this.strategy && this.strategy.columnOrderConfig) {
      const _columnOrderConfig = JSON.parse(
        this.strategy.columnOrderConfig
      );
      this.columnOrderConfig = _columnOrderConfig;
    } else {
      // init column order as default
      this._columns.forEach(column => {
        const key = COLUMN_KEYS[column.datafield];

        if ( -1 === this.columnOrderConfig.indexOf(key)) {
          this.columnOrderConfig.push(key);
        }
      });
    }

    // Add columns in configured column order
    this.columnOrderConfig.forEach(key => {
      const columnIndexes: number[] = this.findMatchingColumnIndexes(key);

      if (columnIndexes.length !== 0) {
        columnIndexes.forEach(columnIndex => {
          const column = this._columns[columnIndex];
          const isVisibleColumn = this.isVisibleColumn(column);

          if (isVisibleColumn) {
            this.columns.push(this._columns[columnIndex]);
          }
        });
      }
    })

    this._localStore.graphType.subscribe((type)=>{
      this.graphType = type;
    })
    // for momentumGraph type
    if(!this.graphType && this.strategy && this.strategy.momentumGraphConfig){
      const momentumGraphConfig =  JSON.parse(this.strategy.momentumGraphConfig);
      this.graphType = momentumGraphConfig.GraphType;
    } else if (!this.graphType) {
      this.graphType = 'Bar';
    }
    this._localStore.setGraphType(this.graphType);
    this.mygrid.columns(this.columns);
    this.updateGrid();
  }

  findMatchingColumnIndexes(key: string): number[] {
    const result: number[] = [];
    const index = this._columns.forEach((column, index) => {
      if (key === COLUMN_KEYS[column.datafield]) {
        result.push(index);
      }
    });
    return result;
  }

  isVisibleColumn(column: any) {
    const dataField = column.datafield;
    const visibilityKey = COLUMN_KEYS[dataField];

    if (undefined === visibilityKey) {
      return true;
    }

    const visibility = this.columnVisibilityConfig[visibilityKey];

    if (undefined === visibility || visibility) {
      return true;
    }
    return false;
  }

  resetColumnOrder(): void {
    let columnIndex = 0;

    this.isResettingColumns = true;
    this.columnOrderConfig = [];
    this._columns.forEach(column => {
      const key = COLUMN_KEYS[column.datafield];

      this.columnOrderConfig.push(key);
      if (this.isVisibleColumn(column)) {
        this.mygrid.setcolumnindex(column.datafield, columnIndex);
        columnIndex ++;
      }
    });

    this.saveColumnOrder();
    this.isResettingColumns = false;
  }

  saveColumnOrder(): void {
    if (!this.strategy) {
      return;
    }
    this.strategy.columnOrderConfig = JSON.stringify(this.columnOrderConfig);
    this.playService.saveStrategy(this.strategy).subscribe(response => {
      this.strategy = response;
    });
  }

  columngrouprenderer = (value) => {
    let result: any = `<div class="column-group-content"><span>${value}</span>`;

    if (value === 'Previous Stats') {
      result += '<select id="' + this.prevStatId + '">' +
        '<option value="Last5">Last 5 mins</option>' +
        '<option value="Last10">Last 10 mins</option>' +
        '<option value="Last20">Last 20 mins</option>' +
        '</select>';
    }else if(value === 'Momentum Graph'){
      result += (this.graphType == 'Line')? '<select id="' + this.graphId + '">' +
        '<option value="Bar">Bar</option>' +
        '<option value="Line" selected>Line</option>' +
        '</select>':'<select id="' + this.graphId + '">' +
        '<option value="Bar" selected>Bar</option>' +
        '<option value="Line">Line</option>' +
        '</select>';
    }
    result += '</div>';
    return result;
  };

  columnGroups: any[] = [
    { text: 'Match Info', align: 'left', name: 'matchInfo', renderer: this.columngrouprenderer },
    { text: 'Previous Stats', align: 'left', name: 'previousStats', renderer: this.columngrouprenderer },
    { text: 'Momentum Graph', align: 'left', name: 'momentumGraph', renderer: this.columngrouprenderer},
    { text: 'Custom Column', align: 'left', name: 'custom', renderer: this.columngrouprenderer},
  ];

  getGoals(data) {
    if (data) {
      return JSON.parse(data).length;
    } else {
      return 0;
    }
  }

  getGoalsTime(data, timePeriod) {
    if (data) {
      return JSON.parse(data).filter(val => val <= timePeriod).length;
    } else {
      return 0;
    }
  }



  generateTableSourceData(startindex = 0, endindex = this.sortedData.length): any {
    const data = [];
    for (let i = startindex; i < endindex; i++) {
      if (i >= this.sortedData.length) {
        break;
      }
      const row = {};
      const match = this.sortedData[i];

      const match_stat = match.statisticsTimings;
      let oddsInfo = {
        liveHomeOdds: '-',
        liveDrawOdds: '-',
        liveAwayOdds: '-'
      };

      if (match.odds) {
        oddsInfo = match.odds;
      }

      row['gameTime'] = match.gameTime;
      row['score'] = JSON.parse(match_stat.homeGoals).length+'-'+JSON.parse(match_stat.awayGoals).length;

      const clubNameData = {
        matchId: match.matchId,
        homeForm: match.homeForm,
        homeImage: match.homeImage,
        homeName: match.homeName,
        homePosition: match.homePosition,
        homeId: match.homeId,
        awayForm: match.awayForm,
        awayImage: match.awayImage,
        awayName: match.awayName,
        awayPosition: match.awayPosition,
        preMatchOdds: match.preMatchOdds,
        awayId: match.awayId,
        league: match.league,
      };

      row['clubName'] = JSON.stringify({ match: clubNameData });
      row['liveHomeOdds'] = oddsInfo.liveHomeOdds;
      row['liveDrawOdds'] = oddsInfo.liveDrawOdds;
      row['liveAwayOdds'] = oddsInfo.liveAwayOdds;
      row['onTarget'] = JSON.stringify({ value1: this.getGoals(match_stat.homeShotsOnTarget), value2: this.getGoals(match_stat.awayShotsOnTarget) });
      row['offTarget'] = JSON.stringify({ value1: this.getGoals(match_stat.homeShotsOffTarget), value2: this.getGoals(match_stat.awayShotsOffTarget) });
      row['attacks'] = JSON.stringify({ value1: this.getGoals(match_stat.homeAttacks), value2: this.getGoals(match_stat.awayAttacks) });
      row['dangerousAttacks'] = JSON.stringify({ value1: this.getGoals(match_stat.homeDangerousAttacks), value2: this.getGoals(match_stat.awayDangerousAttacks) });
      row['corners'] = JSON.stringify({ value1: this.getGoals(match_stat.homeCorners), value2: this.getGoals(match_stat.awayCorners) });
      row['possession'] = JSON.stringify({ value1: match.homePosition, value2: match.awayPosition });
      row['yellowCards'] = JSON.stringify({ value1: this.getGoals(match_stat.homeYellowCards), value2: this.getGoals(match_stat.awayYellowCards) });
      row['redCards'] = JSON.stringify({ value1: this.getGoals(match_stat.homeRedCards), value2: this.getGoals(match_stat.awayRedCards) });

      const homeAttackConversion: number = Math.round(
        (this.getGoals(match_stat.homeDangerousAttacks) / this.getGoals(match_stat.homeAttacks)) * 100
      );
      const awayAttackConversion: number = Math.round(
        (this.getGoals(match_stat.awayDangerousAttacks) / this.getGoals(match_stat.awayAttacks)) * 100
      );

      row['attackConversion'] = JSON.stringify({
        value1: isNaN(homeAttackConversion) ? 0 : homeAttackConversion,
        value2: isNaN(awayAttackConversion) ? 0 : awayAttackConversion
      });

      const { gameTime } = match;
      const graphData = {
        graphicalData1: { ...match.graphicalData1, gameTime },
        graphicalData2: { ...match.graphicalData2, gameTime },
        splineGraphLabel: match.splineGraphLabel,
      };

      row['graphicalData1'] = JSON.stringify({ match: graphData });
      row['graphicalData2'] = JSON.stringify({ match: graphData });

      const Selection: any = {
        shotsOnTarget: '0',
        shotsOffTarget: '0',
        attacks: '0',
        dangerousAttacks: '0',
        corners: '0',
        goals: '0',
        pressureIndex: '0',
      };
      let timePeriod;
      switch (this.lastTimeSelection.name) {
        case 'Last5':
          timePeriod = 5;
          break;
        case 'Last10':
          timePeriod = 10;
          break;
        case 'Last20':
          timePeriod = 20;
          break;
        default:
          timePeriod = 5;
      }
      const homeLastSelection = match['home' + this.lastTimeSelection.name] == null ? Selection : match['home' + this.lastTimeSelection.name];
      const awayLastSelection = match['away' + this.lastTimeSelection.name] == null ? Selection : match['away' + this.lastTimeSelection.name];

      row['lastOnTarget'] = JSON.stringify({
        value1: this.getGoalsTime(match_stat.homeShotsOnTarget, timePeriod),
        value2: this.getGoalsTime(match_stat.awayShotsOnTarget, timePeriod)
      });
      row['lastOffTarget'] = JSON.stringify({
        value1: this.getGoalsTime(match_stat.homeShotsOffTarget, timePeriod),
        value2: this.getGoalsTime(match_stat.awayShotsOffTarget, timePeriod)
      });
      row['lastAttacks'] = JSON.stringify({ 
        value1: this.getGoalsTime(match_stat.homeAttacks, timePeriod),
        value2: this.getGoalsTime(match_stat.awayAttacks, timePeriod)
      })
      row['lastDangerousAttacks'] = JSON.stringify({
        value1: this.getGoalsTime(match_stat.homeDangerousAttacks, timePeriod),
        value2: this.getGoalsTime(match_stat.awayDangerousAttacks, timePeriod)
      });
      row['lastCorners'] = JSON.stringify({ value1: this.getGoalsTime(match_stat.homeCorners, timePeriod), value2: this.getGoalsTime(match_stat.awayCorners, timePeriod) });
      row['goals'] = JSON.stringify({ value1: this.getGoalsTime(match_stat.homeGoals, timePeriod), value2: this.getGoalsTime(match_stat.awayGoals, timePeriod) });
      row['pressureIndex'] = JSON.stringify({
        value1: homeLastSelection.pressureIndex,
        value2: awayLastSelection.pressureIndex
      });
      row['momentum'] = JSON.stringify(match.barGraphData);

      if (match.bell) {
        row['bell'] = 'bell_on';
      } else {
        row['bell'] = 'bell_off';
      }
      row['remove'] = 'remove';

      // for custom column
      if(this.customColumnConfig){
        this.customColumnConfig.forEach(element => {
          const { statisticsTimings } = match;
          row[element.key] = this.generateCustomData(element.value, element.scale, match.gameTime, statisticsTimings);
        });
      }
      // end custom column

      data.push(row);
    }
    return data;
  }

  CellClick(event) {
    const dataField = event.args.datafield;
    const rowindex = event.args.rowindex;

    if (dataField === 'remove') {
      const data = JSON.parse(JSON.stringify(this.sortedData[rowindex]));
      const index = this.__originalData.findIndex(
        match => match.matchId === data.matchId
      );

      this.lastDeletedMatch = { index, data };
      this.mygrid.deleterow(rowindex);
      this.__originalData.splice(index, 1);
      // Re-Apply Filters and Re-Sort table
      this.generateSortedData();
    } else if (dataField === 'bell') {
      this.handleBellClick(this.sortedData[rowindex]);
      this.sortedData[rowindex].bell = !this.sortedData[rowindex].bell;
      this.setTableDataSource(true, true);
    }
  }

  async handleBellClick(match) {
    try {
      if (!match.bell) {
        const response = await this.playService.addFavouriteMatch(match);
        this.favouriteMatches = response;
      } else {
        const favouriteIndex = this.favouriteIndex(match);
        if (-1 !== favouriteIndex) {
          const favouriteMatchId = this.favouriteMatches[
            favouriteIndex
          ].favouriteMatchId;
          const response = await this.playService.deleteFavouriteMatch(favouriteMatchId);
          this.favouriteMatches = response;
        }
      }
      this.messageService.changeFavouriteMatches(this.favouriteMatches);
    } catch (e) {
      console.error(e);
    }
  }

  isContain(dom: any, point: any): any {
    const boundRect: any = dom.getBoundingClientRect();
    if (point.x > boundRect.left && point.x < boundRect.right) {
      if (point.y > boundRect.top && point.y < boundRect.bottom) {
        return true;
      }
    }
    return false;
  }

  favouriteIndex(match) {
    const index = this.favouriteMatches.findIndex(
      favourite => favourite.matchId === match.matchId
    );
    return index;
  }

  saveBase64AsFile = (base64, fileName) => {
    try {
      let link = document.createElement("a");

      document.body.appendChild(link); // for Firefox

      link.setAttribute("href", base64);
      link.setAttribute("download", fileName);
      link.click();

      document.body.removeChild(link);
    } catch {
      console.error('Unable to download cross-origin images for teams...');
    }
  }

  modalScreenshot(){
    const rowIndex: number = this.mygrid.getselectedrowindex();

    if(rowIndex !== -1) {
      const rowData: any = this.mygrid.getrowdata(rowIndex);

      const matchId = JSON.parse(rowData.clubName).match.matchId;
      this.selectedRow = this.sortedData.filter((match) => {
        return match.matchId === matchId;
      });

      this.open(this.screenShot);
    }
    else{
      alert('Please select a row...');return;
    }
  }
  // async takeScreenshot() {
  //   const grid = $(`#${this.myGridId}`);
  //   const selectedRow = grid.find('.jqx-fill-state-pressed').parent(`[role='row']`)[0];
  //   const headerRow = grid.find(`[role='columnheader']`).parent(`[id*='columntablejqxWidget']`)[0];
  //   if(!selectedRow) {alert('Please select a row...');return;}
  //   this.blockUI.start('Generating Image...')

  //   const selectedRowCanvas = await html2canvas(selectedRow, { allowTaint: true, useCORS: true });
  //   const headerRowCanvas = await html2canvas(headerRow, { allowTaint: true, useCORS: true });
  //   const mergedCanvas = document.createElement('canvas');

  //   mergedCanvas.width = headerRowCanvas.width;
  //   mergedCanvas.height = headerRowCanvas.height + selectedRowCanvas.height;

  //   const context = mergedCanvas.getContext('2d');

  //   context.drawImage(headerRowCanvas, 0, 0);
  //   context.drawImage(selectedRowCanvas, 0, headerRowCanvas.height);

  //   const index = this.mygrid.getselectedrowindex();
  //   const match = this.sortedData[index];
  //   const { homeName, awayName } = match;
  //   const fileName = `${homeName} vs ${awayName}.png`;
  //   const taintedContent = mergedCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

  //   this.saveBase64AsFile(taintedContent, fileName);
  //   setTimeout(() => {
  //     this.blockUI.stop();
  //   }, 1000);
  // }

  undoDeletion() {
    if (this.lastDeletedMatch) {
      const { index, data } = this.lastDeletedMatch;

      this.__originalData.splice(index, 0, data);

      // Re-Apply Filters and Re-Sort table
      this.generateSortedData();
      this.lastDeletedMatch = null;
    }
  }

  generateSortedData() {
    if (this._filter && this.filterInfo) this.sortedData = this.applyAdditionalFilters(this.filterInfo, this.__originalData);
    this.sortedData = this.applyFilters(this.activeFilters, this.sortedData);
    this.sortedData = this.applyScoreFilters(this.scoreFilters, this.sortedData);
    this.sortedData = this.applyAdditionalFilters(this.additionalFilters, this.sortedData);
    if (this.strategy) {
      this.sortedData = this.applyLeagueFilters(this.strategy.leagueFilters, this.sortedData);
    }

    this.setTableDataSource(true, true);
    if (this.sortInfo) {
      const direction = {
        'asc': true,
        'desc': false,
        '': null
      };

      this.before_sorted_flag = false;
      this.mygrid.sortby(this.sortInfo.active, direction[this.sortInfo.direction]);
    }
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: MouseEvent) {
    let elem: any;
    elem = this.homeFormPop.nativeElement;
    if (elem.style.display === 'block' && this.isContain(elem, { x: event.x, y: event.y }) === false) {
      elem.style.display = 'none';
    }

    elem = this.awayFormPop.nativeElement;
    if (elem.style.display === 'block' && this.isContain(elem, { x: event.x, y: event.y }) === false) {
      elem.style.display = 'none';
    }

    elem = this.matchMomentum1.nativeElement;
    if (elem.style.display === 'block' && this.isContain(elem, { x: event.x, y: event.y }) === false) {
      elem.style.display = 'none';
    }

    elem = this.matchMomentum2.nativeElement;
    if (elem.style.display === 'block' && this.isContain(elem, { x: event.x, y: event.y }) === false) {
      elem.style.display = 'none';
    }
  }

  handleRowClick({args}) {
    const domCell = args.originalEvent.target;
    const domRow = $(domCell).closest('div[role="row"]');

    const isFirstSelected = domRow.hasClass('first-selected');
    const isSecondSelected = domRow.hasClass('second-selected');

    if(!isFirstSelected) {
      domRow.addClass('first-selected');
    } else if(!isSecondSelected) {
      domRow.addClass('second-selected');
    } else {
      domRow.removeClass('first-selected');
      domRow.removeClass('second-selected');
    }
  }

  updateGrid(wasOnlySorting = false) {
    this.source.totalrecords = this.sortedData.length;
    if (this.mygrid) {
      if (wasOnlySorting) {
        this.mygrid.updatebounddata('sort');
        this.mygrid.refresh();
        this._localStore.scrollPosition.subscribe((res)=>{
          if (res) this.mygrid.scrolloffset(res.top, res.left);
        })
      } else {
        this.mygrid.updatebounddata();
      }
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getComparator(val) {
    switch(val) {
      case '≥':
        return ">=";
      case '>':
        return ">";
      case '≤':
        return "<=";
      case '<':
        return "<";
      case '=':
        return "==";
      case '≠':
        return "!=";
    }
  }
}

function compare(a: number, b: number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

