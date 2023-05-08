import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PlayService } from '../../play.service';
declare var $: any;

@Component({
  selector: 'app-historical-stats-pop-over',
  templateUrl: './historical-stats-pop-over.component.html',
  styleUrls: ['./historical-stats-pop-over.component.scss']
})
export class HistoricalStatsPopOverComponent implements OnChanges {

  @Input()
  dataOptions = [];

  @Input()
  league;

  @Input()
  preMatchOdds;

  @Input()
  homeId;

  @Input()
  type;

  @Input()
  position: any;


  homeMatches = [];
  awayMatches = [];
  receiveStatus = 2;
  currentMatch = null;
  matchInfoFields = [
    { key: 'kickOffTime', value: 'Date' },
    { key: 'league', value: 'League' },
    { key: 'home', value: 'Home' },
    { key: 'score', value: 'Score' },
    { key: 'away', value: 'Away' }
  ]
  constructor(private router: Router, private service: PlayService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if( this.position == undefined ) {
      return;
    }

    this.homeMatches = [];
    this.awayMatches = [];
    this.receiveStatus = 2;
    this.getHistoricalMatches();

    let tri_left = this.position.pos - 15;

    $('head').append('<style>.info-panel:before{left:' + tri_left + 'px !important;}</style>');
    $('head').append('<style>.info-panel:after{left:' + (tri_left + 1) + 'px !important;}</style>');

    if( this.position.state == 0 ) {
      $('head').append('<style>.info-panel:before, .info-panel:after{bottom: 100% !important; top: auto !important;}</style>');
      $('head').append('<style>.info-panel:before{border-bottom: 25px solid #146853 !important; border-top: none !important;}</style>');
      $('head').append('<style>.info-panel:after{border-bottom: 23px solid white !important; border-top: none !important;}</style>');
    } else {
      $('head').append('<style>.info-panel:before, .info-panel:after{top: 100% !important; bottom: auto !important;}</style>');
      $('head').append('<style>.info-panel:before{border-top: 25px solid #146853 !important; border-bottom: none !important;}</style>');
      $('head').append('<style>.info-panel:after{border-top: 23px solid white !important; border-bottom: none !important;}</style>');
    }
  }

  //btn btn-primary btn-circle


  getClass(option) {
    if (option && option.matchResult == 1) {
      return 'btn btn-grey btn-circle right-10 bottom-5';
    } else if (option && !this.isWinner(option)) {
      return 'btn btn-red btn-circle right-10 bottom-5';
    } else if (option && this.isWinner(option)) {
      return 'btn btn-green btn-circle right-10 bottom-5';
    }
  }

  viewInfo() {
    this.router.navigateByUrl('scanner/form/' + this.homeId + "/" + this.type, { skipLocationChange: true });
  }

  async getHistoricalMatches() {
    this.service.getHistoricalMatches({ homeId: this.homeId }).subscribe(response => {
      const matches = response['match'];

      if (matches) {
        if (matches['homeHistoricalMatches']) {
          this.homeMatches = response['match']['homeHistoricalMatches'];
          this.generateMatchData(this.homeMatches);
        }
      }
      this.receiveStatus --;
    });

    this.service.getHistoricalMatches({ awayId: this.homeId }).subscribe(response => {
      const matches = response['match'];

      if (matches) {
        if (matches['awayHistoricalMatches']) {
          this.awayMatches = response['match']['awayHistoricalMatches'];
          this.generateMatchData(this.awayMatches);
        }
      }
      this.receiveStatus --;
    });

  }

  isLight() {
    return environment.theme == 'light'
  }

  handleHoverMatch(option) {
    let matches = [];

    this.currentMatch = null;
    if (option.homeOrAway === 'A') {
      matches = this.awayMatches;
    } else {
      matches = this.homeMatches;
    }

    matches.forEach(match => {
      if (match.kickOffTime === option.kickOffTime) {
        this.currentMatch = match;
      }
    });

  }

  public isWinner(option) {
    if (
      (option.homeOrAway === 'A' && option.matchResult === 1) ||
      (option.homeOrAway === 'H' && option.matchResult === 2)
    ) {
      return true;
    }
    return false;
  }

  generateMatchData(matches) {
    matches.forEach(match => {
      const { homeGoals, awayGoals } = match;

      match.score = `${homeGoals}-${awayGoals}`;
      if (match.league === null) {
        match.league = 'League';
      }
    });
  }
}
