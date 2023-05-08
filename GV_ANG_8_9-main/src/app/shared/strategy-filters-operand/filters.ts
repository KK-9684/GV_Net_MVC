export const MATCH_METRIC = [
  {value: 'timer', viewValue: 'Match Timer (Minute)'},
  {value: 'goals', viewValue: 'Goals'},
  { value: 'shotsOnTarget', viewValue: 'Shots On Target' },
  { value: 'shotsOffTarget', viewValue: 'Shots Off Target' },
  // { value: 'shots', viewValue: 'Shots' },
  // { value: 'attacks', viewValue: 'Attacks' },
  // { value: 'dangAttacks', viewValue: 'Dangerous Attacks' },
  // { value: 'momentum', viewValue: 'Momentum' },
  { value: 'corners', viewValue: 'Corners' },
  // { value: 'possession', viewValue: 'Ball Possession (%)' },
  { value: 'redCards', viewValue: 'Red Cards' },
  { value: 'yellowCards', viewValue: 'Yellow Cards' },
  // { value: 'penalties', viewValue: 'Penalties' },
  // { value: 'substitutions', viewValue: 'Substitutions' },
  // {value: 'leaguePos', viewValue: 'League Position'}
];
export const METRIC_TEAMS = [
  {value: 's', viewValue: 'Sum of teams (Total)'},
  {value: 'h', viewValue: 'Home'},
  { value: 'a', viewValue: 'Away' },
  // { value: 'ea', viewValue: 'Either team' },
  // { value: 'eb', viewValue: 'Either team`s opponent' },
  // { value: 'f', viewValue: 'Favorite' },
  // { value: 'fh', viewValue: 'Favorite playing Home' },
  // { value: 'fa', viewValue: 'Favorite playing Away' },
  // { value: 'u', viewValue: 'Underdog' },
  // { value: 'uh', viewValue: 'Underdog playing Home' },
  // { value: 'ua', viewValue: 'Underdog playing Away' },
  { value: 'w', viewValue: 'Winning team' },
  { value: 'l', viewValue: 'Losing team' }
];
export const TEMPORAL_RANGE = [
  {value: 'disabled', viewValue: 'Disabled'},
  {value: 'exm', viewValue: 'At minute X'},
  { value: 'mag', viewValue: 'X minutes ago' },
  { value: 'range', viewValue: 'Between minutes X and Y' },
  { value: 'offset', viewValue: 'Past X minutes' },
  { value: 'cof', viewValue: 'Since minute X' },
  { value: 'cot', viewValue: 'Until minute X' },
  { value: 'fh', viewValue: 'During 1st Half' },
  { value: 'sh', viewValue: 'During 2nd Half' },
  { value: 'ht', viewValue: 'At Half Time' },
  { value: 'ft', viewValue: 'At Full Time' }
];
export const ODDS = [
  {value: 'preLiveOdd1X2', viewValue: 'Pre-match Odds: 1X2'},
  {value: 'preLiveOdd1X2Tie', viewValue: 'Pre-match Odds: 1X2 [Draw] '},
  { value: 'liveOdd1X2', viewValue: 'Live Odds: 1X2' },
  { value: 'liveOdd1X2Tie', viewValue: 'Live Odds: 1X2 [Draw]' },
  { value: 'preLiveOdd1X2H', viewValue: 'Pre-match Odds: Half Time Result' },
  { value: 'preLiveOdd1X2TieH', viewValue: 'Pre-match Odds: Half Time Result [Draw]' },
  { value: 'liveOdd1X2H', viewValue: 'Live Odds: Half Time Result' },
  { value: 'liveOdd1X2TieH', viewValue: 'Live Odds: Half Time Result [Draw]' }
];
export class Val {
  public reference: string;
  public team?: string;
  public timeRangeFrom?: Number;
  public timeRangeTo?: Number;
  public constant?: Number;
  public timerOffset?: Number;
  public timerPeriod?: string;
  public cof?: Number;
  public cot?: Number;
  public exm?: Number;
  public mag?: Number;
  public rangeValue?: string;
  public previewStr1?: string = '';
  public previewStr2?: string;
  public previewStr3?: string;

}
export class Operand {
  public Operator?: string;
  public Val1: Val;
  public Val2?: Val;
}
export class Filter {
  public Comparator: string;
  public Left: Operand;
  public Right: Operand;
  public filterString: string;
}
// export interface valObject {
//   reference: string;
//   team?:string;
//   timeRangeFrom?: string;
//   timeRangeTo?: string;
//   constant?: string;
//   timerOffset?: string;   //exm, mag, range, offset, cof, cot
//   timerPeriod?: string;   //disabled, fh, sh, ht, ft
//   cof?: number;
//   cot?: number;
//   exm?: number;
//   mag?: number;
//   range?: number[];
// }
