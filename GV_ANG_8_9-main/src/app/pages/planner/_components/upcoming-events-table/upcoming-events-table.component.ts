import { ChangeDetectorRef, Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
// import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
// import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
// import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { filter, tap } from 'rxjs/operators';

import * as moment from 'moment';

import { StateService } from 'src/app/core/services';
// import { userInfo } from 'os';
import { PlannerService } from 'src/app/core/services';
import { getCode } from 'country-list';

declare const $: any;

export interface IUpcomingMatch {
  kickOffTime: any;
  // country: any;
  // league: any;
  colon:string;
  home: any;
  homeId: any;
  homeImg?: any;
  away: any;
  awayId: any;
  awayImg?: any;
  matchId: any;
  upcomingMatchId: any;
}

const ELEMENT_DATA: IUpcomingMatch[] = [];

@Component({
  selector: 'app-upcoming-events-table',
  templateUrl: './upcoming-events-table.component.html',
  styleUrls: ['./upcoming-events-table.component.scss'],
})
export class UpcomingEventsTableComponent implements OnInit, AfterViewInit {
  matches: any[];
  teamImages: any[];
  search: string;
  showSearch: boolean;
  selectedRow: string;

  // material-table variables
  displayedColumns: string[] = [
    'kick-off',
    // 'country',
    // 'league',
    'home',
    'colon',
    'away',
    'predictions',
    'favourites',
    'notes',
    'strategies'
  ];
  // dataSource = new MatTableDataSource<IUpcomingMatch>(ELEMENT_DATA);
  toppings = new FormControl();
  strategies = [];
  strategyMatches = [];
  favouriteMatches = [];
  predictionMatches = [];
  noteMatches = [];
  countries = [];

  // @ViewChild('containerTable') containerTable: CdkVirtualScrollViewport;
  // @ViewChild(MatSort) sort: MatSort;
  @BlockUI() blockUI: NgBlockUI;
  source: any = [];
  dataSource: any = ELEMENT_DATA;

  constructor(
    private readonly _cdRef: ChangeDetectorRef,
    private readonly _store: StateService,
    private readonly plannerService: PlannerService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) { 
    iconRegistry.addSvgIcon(
      'document-text',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/document-text.svg'));
    iconRegistry.addSvgIcon(
      'heart',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/heart.svg'));
    iconRegistry.addSvgIcon(
      'ranking',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ranking.svg'));
    iconRegistry.addSvgIcon(
      'firstline',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/firstline.svg'));
  }

  ngOnInit(): void {
    this.blockUI.start('Loading...'); // Start blocking
    this.getTeamImages();
    this.getMatches();
    this.getStrategies();
    this.getStrategyMatches();
    this.getFavouriteMatches();
    this.getNotes();
    this.getPredictions();
  }
  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    // this.setDatasourceSort();
    // this.onResize();
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
    setTimeout(() => {
      this.blockUI.stop();
      this.showSearch = true;
    }, 2500);
  }

  getStrategies() {
    this._store.strategies
      .pipe(
        filter(Boolean),
        tap((strategies: any) => {
          this.strategies = strategies;
          this._cdRef.detectChanges();
        })
      )
      .subscribe(() => { })
  }

  getStrategyMatches() {
    this._store.strategyMatches
      .subscribe((strategyMatches) => {
        if (strategyMatches)
          this.strategyMatches = strategyMatches;
      })
  }

  getFavouriteMatches() {
    this._store.favouriteMatches
      .subscribe((favouriteMatches) => {
        if(favouriteMatches)
          this.favouriteMatches = favouriteMatches;
      })
  }

  getNotes(): void {
    this._store
      .notes
      .subscribe((noteMatches) => {
        if(noteMatches)
          this.noteMatches = noteMatches;
      });
  }

  getPredictions(): void {
    this._store
      .predictions
      .subscribe((predictionMatches) => {
        if(predictionMatches)
          this.predictionMatches = predictionMatches;
      });
  }

  getMatches(): void {
    this._store.upcomingMatches
      .pipe(
        filter(Boolean),
        tap((matches: any) => {
          this.matches = matches;
          this._cdRef.detectChanges();
          //getCountries
          this.matches.forEach(match => {
            const country = this.countries.find(item => item.country == match.country);

            if (country) {
              const { leagues } = country;
              const league = leagues.find(item => item.league == match.league);

              if (league) {
                league.matches.push(match);
              } else {
                leagues.push({
                  league: match.league,
                  matches: [match]
                });
              }
            } else {
              this.countries.push({
                country: match.country,
                countrycode:getCode(match.country),

                leagues: [{
                  league: match.league,
                  matches: [match]
                }]
              });
            }
          });
          this.generateDatasource();
        })
      )
      .subscribe(() => { });
  }

  @HostListener('window:scroll', ['$event']) 
    onTableScroll(event) {
      console.log("Scroll Event");
      const tableViewHeight = window.innerHeight; // viewport: ~500px
      const tableScrollHeight = window.screenY; // length of all table
      const scrollLocation = window.screenTop; // how far user scrolled
      
      // If the user has scrolled within 200px of the bottom, add more data
      const buffer = 200;
      const limit = tableScrollHeight - tableViewHeight - buffer;  
      if (scrollLocation > limit) {
        this.dataSource = this.dataSource.concat(this.source.splice(0, 15));
      }
    }

  tableData(match) {
    return {
      kickOffTime: moment(match.kickOffTime).format('MM/DD HH:mm'),
      // country: match.country,
      // league: match.league,
      colon: ":",
      home: match.homeName,
      homeId: match.homeId,
      homeImg: this.teamImages.find((el) => el.teamId === match.homeId)
        ?.imageUrl,
      away: match.awayName,
      awayId: match.awayId,
      awayImg: this.teamImages.find((el) => el.teamId === match.awayId)
        ?.imageUrl,
      matchId: match.matchId,
      upcomingMatchId: match.upcomingMatchId,
    }
  }

  generateDatasource(filter=false) {
    let isFilter;
    if (this.search && this.search.length >= 3) {
      isFilter = true;
    } else {
      isFilter = false;
    }
    const countries = this.countries;
    let sortedCountries= countries.sort(function(a, b) {
      return a.country.localeCompare(b.country);
    })
    this.source = [];
    sortedCountries.forEach((country, index) => {
      const { leagues } = country;
      let sortedLeagues= leagues.sort(function(a, b) {
        return a.league.localeCompare(b.league);
      })
      let data = [];
      sortedLeagues.forEach(league => {
        // set upcoming events table data
        if (isFilter) {
          data = league.matches.filter(val=>{
            return (val.homeName.toLowerCase().includes(this.search.toLowerCase()) || val.awayName.toLowerCase().includes(this.search.toLowerCase()));
          }).map(match=>this.tableData(match));
        } else {
          data = league.matches.map((match) => this.tableData(match));
        }
        if (data.length) this.source.push({isGroupBy: true, group: country.country + ' : ' + league.league, country: country.country, league: league.league, countrycode: country.countrycode});
        this.source = this.source.concat(data);
      });
    })
    // debugger;
    this.dataSource = this.source.splice(0, 20);
  }

  isGroup(index, item): boolean{
    return item.isGroupBy;
  }
  // setDatasourceSort() {
  //   this.countries.forEach(country => {
  //     country.leagues.forEach(league => {
  //       league.dataSource.sort = this.sort;
  //       // break;
  //     });
  //   })
  // }

  getTeamImages() {
    this._store.teamImages
      .pipe(
        filter(Boolean),
        tap((images: any) => {
          this.teamImages = images;
        })
      )
      .subscribe(() => { });
  }

  onAddPredictions(event, match): void {
    event.preventDefault();
    this._store.setTargetMatch(match);
    $('#predictions-market-selection-dialog').modal('show');
  }

  handleAddFavourites(event, match): void {
    event.preventDefault();
    const result = this.isFavourite(match);

    if(!result) {
      this.plannerService
        .addFavouriteMatch(match)
        .subscribe(() => {
          this.getFavouriteMatches();
        });
      this.favouriteMatches.push({
        favouriteMatchId: -1, matchId: match.matchId
      });
    } else {
      this.plannerService
        .deleteFavouriteMatch(result.favouriteMatchId)
        .subscribe(() => {
          this.getFavouriteMatches();
        });
      const index = this.favouriteMatches.findIndex(
        favourite => favourite.matchId === match.matchId
      );
      this.favouriteMatches.splice(index, 1);
    }
  }

  onAddNotes(event, match): void {
    event.preventDefault();
    this._store.setTargetMatch(match);
    $('#note-dialog').modal('show');
  }

  onChangeStrategyMatch(event, strategy, match): void {
    const strategyMatchId = this.getStrategyMatchId(strategy, match);
    if (event.target.checked === true) {
      this.plannerService.addStrategyMatch({
        strategyId: strategy.strategyId,
        matchId: match.matchId
      })
        .subscribe(
          () => {
            this.getStrategyMatches();
          }
        );
    } else {
      if (strategyMatchId == -1) {
        alert('Not found the strategy Match Id');
        return;
      }
      this.plannerService
        .deleteStrategyMatch(strategyMatchId)
        .subscribe(() => { });
    }
  }

  getStrategyMatchId(strategy, match): number {
    const length = this.strategyMatches.length;
    let index;
    for (index = 0; index < length; index++) {
      const strategyMatch = this.strategyMatches[index];
      if (
        strategyMatch &&
        strategyMatch.strategyId == strategy.strategyId &&
        strategyMatch.matchId == match.matchId
      )
        return strategyMatch.strategyMatchId;
    }
    return -1;
  }

  isLinked(strategy, match): Boolean {
    return this.getStrategyMatchId(strategy, match) != -1;
  }

  isFavourite(match) {
    const result = this.favouriteMatches.find((favouriteMatch) => {
      return favouriteMatch.matchId == match.matchId;
    });
    return result;
  }

  isStrategy(match) {
    const result = this.strategyMatches.find((strategyMatch) => {
      return strategyMatch.matchId == match.matchId;
    });
    return result;
  }

  hasNote(match) {
    const result = this.noteMatches.find((noteMatch) => {
      return noteMatch.matchId == match.matchId;
    });
    return result;
  }

  hasPrediction(match) {
    const result = this.predictionMatches.find((predictionMatch) => {
      return predictionMatch.matchId == match.matchId;
    });
    return result;
  }

  isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}

handleChange(e) {
  this.generateDatasource(true);
  /*let avail;
  let leagueAvail;
  let removeMatch;
  let removeLeague;
  if (this.search && this.search.length >= 3) {
    this.countries = this.originalCountries.filter(o =>
      Object.keys(o).some(k => {
        if (o[k] && typeof o[k] === 'string') {
          avail = false;
          o.leagues.forEach(league => {
            league.matches.forEach((match)=>{
              if (match.homeName.toLowerCase().includes(this.search.toLowerCase()) || match.awayName.toLowerCase().includes(this.search.toLowerCase())){
                avail = true;
                return;
              }
            })
          });
          return avail;
        }
      })).map(filter => {
        if (filter.country && typeof filter.country === 'string') {
          removeLeague = [];
          filter.leagues.forEach((ele, i) => {
            leagueAvail = false;
            removeMatch = [];
            ele.matches.forEach((match, index)=>{
              if (!(match.homeName.toLowerCase().includes(this.search.toLowerCase()) || match.awayName.toLowerCase().includes(this.search.toLowerCase()))){
                removeMatch.push(index);
              } else {
                leagueAvail = true;
              }
            })
            const indexSet = new Set(removeMatch);
            filter.leagues[i].matches = filter.leagues[i].matches.filter((val, key)=> !indexSet.has(key));
            filter.leagues[i].dataSource.data = filter.leagues[i].dataSource.data.filter((v, i)=>!indexSet.has(i));
            filter.leagues[i].dataSource._updateChangeSubscription();
            if (!leagueAvail) removeLeague.push(i);
          })
          const indexSetLeague = new Set(removeLeague);
          filter.leagues = filter.leagues.filter((j, k) => !indexSetLeague.has(k));
        }
        return filter;
      });
  } else {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      this.countries = this.originalCountries;
      this.countries.map(val => {
        val.leagues.map(league => {
        })
      })
    }
  }*/
}

handleClick() {
  this.search = "";
  this.generateDatasource();
}

  // @HostListener('window:resize')
  // onResize() {
  //   const dom: any = this.containerTable.elementRef.nativeElement;
  //   const boundRect: any = dom.getBoundingClientRect();
  //   const availHeight = window.innerHeight;
  //   const footer: any = document.querySelector('footer');
  //   const footerHeight = footer.offsetHeight;

  //   dom.style.height = (availHeight - boundRect.top - footerHeight) + 'px';
  // }
}
