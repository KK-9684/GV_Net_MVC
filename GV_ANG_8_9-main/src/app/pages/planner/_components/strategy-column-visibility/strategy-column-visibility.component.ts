import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { Subject } from 'rxjs';
import { filter, tap, takeUntil, mergeMap } from 'rxjs/operators';

import { StateService } from 'src/app/core/services';
import { imageUrls, fieldNames, minutes } from '../config/column-visibility-static';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { CustomColumnDialogComponent } from '../dialog/custom-column-dialog/custom-column-dialog.component';

@Component({
  selector: 'app-strategy-column-visibility',
  templateUrl: './strategy-column-visibility.component.html',
  styleUrls: ['./strategy-column-visibility.component.scss'],
})
export class StrategyColumnVisibilityComponent implements OnInit, OnDestroy {
  @Input() disabled;
  private _stop$: Subject<any>;

  selectedStrategy: any;
  columnVisibilityConfig: any;
  _columnVisibilityConfig: any = {};
  columnOrderConfig = [];
  _columnOrderConfig = [];
  customColumnConfig = [];
  _customColumnConfig = [];
  mainColumns: any[];
  prevStatsColumns: any[];
  miscColumns: any[];
  customColumns: any[];
  imageUrls: any = {};
  originOrder = true;
  originVisibility = true;
  originCustom = true;
  fieldNames: any[];
  minutes: any[];
  customColumnName: string;
  selectedField: string;
  selectedMinute: number;

  drop(event: CdkDragDrop<any>, columnGroup) {
    // it is unusual for mainColumns
    if (event.previousContainer.data) {
      this.mainColumns[event.previousContainer.data.index] = event.container.data.item;
      this.mainColumns[event.container.data.index] = event.previousContainer.data.item;
    } else {
      moveItemInArray(this[columnGroup], event.previousIndex, event.currentIndex);
    }
    this.updateColumnOrderConfig();
    this.updateTargetStrategy();
  }

  updateColumnOrderConfig(): void {
    this.columnOrderConfig = [];
    this.addColumnsToOrderConfig(this.mainColumns);
    this.addColumnsToOrderConfig(this.prevStatsColumns);
    this.addColumnsToOrderConfig(this.miscColumns);
    this.addColumnsToOrderConfig(this.customColumns);
  }

  addColumnsToOrderConfig(columns: any[]) {
    columns.forEach(column => {
      this.columnOrderConfig.push(column.key);
    });
  }

  constructor(
    public dialog: MatDialog,
    private readonly _store: StateService) {
    this._setVariables();
  }

  ngOnInit(): void {
    this._getTargetStrategy();
  }

  ngOnDestroy(): void {
    this._stop$.next();
    this._stop$.complete();
  }

  private _setVariables(): void {
    this._stop$ = new Subject();
    this.mainColumns = [
      { label: 'Time', key: 'mainTime' },
      { label: 'Score', key: 'mainScore' },
      { label: 'Teams', key: 'mainTeams' },
      { label: 'Live Home Odds', key: 'mainHomeOdds' },
      { label: 'Live Draw Odds', key: 'mainDrawOdds' },
      { label: 'Live Away Odds', key: 'mainAwayOdds' },
      { label: 'Shots on Target', key: 'mainSonT' },
      { label: 'Shots off Target', key: 'mainSoffT' },
      { label: 'Attacks', key: 'mainAttacks' },
      { label: 'Dangerous Attacks', key: 'mainDangerousAttacks' },
      { label: 'Attack Conversion', key: 'mainAttackConversion' },
      { label: 'Corners', key: 'mainCorners' },
      { label: 'Possessions', key: 'mainPossession' },
      { label: 'Yellow Cards', key: 'mainYellowCards' },
      { label: 'Red Cards', key: 'mainRedCards' },
      { label: 'Graph1', key: 'mainGraph1' },
      { label: 'Graph2', key: 'mainGraph2' },
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
      { label: 'Favourites', key: 'miscFavourites' },
      { label: 'Delete', key: 'miscDelete' },
    ];
    this.customColumns = [];
    this.imageUrls = imageUrls;
    this.fieldNames = fieldNames;
    this.minutes = minutes;
    this.addColumnsToBaseConfig(this.mainColumns);
    this.addColumnsToBaseConfig(this.prevStatsColumns);
    this.addColumnsToBaseConfig(this.miscColumns);
  }

  addColumnsToBaseConfig(columns) {
    columns.forEach((column) => {
      this._columnVisibilityConfig[column.key] = true;
      if(this._columnOrderConfig.indexOf(column.key) === -1) this._columnOrderConfig.push(column.key);
    });
    // for dev
      if(this.originCustom){
      this.columnVisibilityConfig = this._columnVisibilityConfig;
      this.columnOrderConfig = this._columnOrderConfig;}
    // end dev
  }

  private _getTargetStrategy(): void {
    this._store.targetStrategy
      .pipe(
        filter(Boolean),
        tap((strategy: any) => {
          this.selectedStrategy = strategy;

          // Set column visibility config
          if (strategy.columnVisibilityConfig) {
            if (this.originVisibility) {
              this._columnVisibilityConfig = JSON.parse(
                strategy.columnVisibilityConfig
              );
              this.columnVisibilityConfig = JSON.parse(
                JSON.stringify(this._columnVisibilityConfig)
              );
              this.originVisibility = false;
            } else {
              this.columnVisibilityConfig = JSON.parse(
                strategy.columnVisibilityConfig
              );
            }
          }

          // Set column order config
          if (strategy.columnOrderConfig) {
            if (this.originOrder) {
              this._columnOrderConfig = JSON.parse(
                strategy.columnOrderConfig
              );
              this.columnOrderConfig = JSON.parse(
                JSON.stringify(this._columnOrderConfig)
              );
              this.originOrder = false;
            } else {
              this.columnOrderConfig = JSON.parse(
                strategy.columnOrderConfig
              );
            }
          }

          // Set custom column config
          if (strategy.customColumnConfig) {
            if (this.originCustom) {
              this._customColumnConfig = JSON.parse(strategy.customColumnConfig);
              this.customColumnConfig = JSON.parse(
                JSON.stringify(this._customColumnConfig)
              );
              this.originCustom = false;
            } else {
              this.customColumnConfig = JSON.parse(strategy.customColumnConfig);
            }
            //init customColumns
            this.customColumnConfig.forEach((column) => {
              this.customColumns.push({label:column.name, key:column.key});
            });
            this.addColumnsToBaseConfig(this.customColumns);
          }

          // for dev
        //   if (this.originCustom) {
        //     this._customColumnConfig = [
        //       { key: 'customTest1', name:'Test1', value: 'Goals', scale: '3' },
        //       { key: 'customTest2', name:'Test2', value: 'RedCards', scale: '10' },
        //     ];
        //     this.customColumnConfig = [
        //       { key: 'customTest1', name:'Test1', value: 'Goals', scale: '3' },
        //       { key: 'customTest2', name:'Test2', value: 'RedCards', scale: '10' },
        //     ];

        //     this.customColumnConfig.forEach((column) => {
        //       this.customColumns.push({label:column.name, key:column.key});
        //     });
        //     this.addColumnsToBaseConfig(this.customColumns);
        //     this.originCustom = false;
        // }
          // end dev

          this.updateColumnsFromConfig();
        }),
        takeUntil(this._stop$)
      )
      .subscribe(() => {});
  }

  updateColumnsFromConfig() {
    this.updateColumnGroupFromConfig('mainColumns');
    this.updateColumnGroupFromConfig('prevStatsColumns');
    this.updateColumnGroupFromConfig('miscColumns');
    this.updateColumnGroupFromConfig('customColumns');
  }

  updateColumnGroupFromConfig(columnGroupName: string) {
    let _columnGroup = [], columnGroup = this[columnGroupName];

    this.columnOrderConfig.forEach(key => {
      const column = columnGroup.find(current => current.key == key);

      if (column) {
        _columnGroup.push(column);
      }
    });

    this[columnGroupName] = _columnGroup;
  }

  updateTargetStrategy(): void {
    this._store.setTargetStrategy({
      ...this.selectedStrategy,
      columnVisibilityConfig: JSON.stringify(this.columnVisibilityConfig),
      columnOrderConfig: JSON.stringify(this.columnOrderConfig),
      customColumnConfig: JSON.stringify(this.customColumnConfig),
    });
  }

  onClickVisibility(item): void {
    const { key } = item;
    this.columnVisibilityConfig[key] = !this.columnVisibilityConfig[key];
    this.updateTargetStrategy();
  }

  handleDiscardChanges(): void {
    this.columnOrderConfig = JSON.parse(
      JSON.stringify(this._columnOrderConfig)
    );
    this.columnVisibilityConfig = JSON.parse(
      JSON.stringify(this._columnVisibilityConfig)
    );
    this.customColumnConfig = JSON.parse(
      JSON.stringify(this._customColumnConfig)
    );

    this.updateColumnsFromConfig();
    this.updateTargetStrategy();
  }

  handleNameChange(value):void{
    this.customColumnName = value;
  }

  handleFieldChange(value): void {
    this.selectedField = value;
  }

  onlyNumbers(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  handleMinuteChange(value): void {
    this.selectedMinute = value;
  }

  handleCreateColumn(): void {
    if(this.isColumnName()){
      let columnName = this.customColumnName;
      let key = 'custom' + columnName;
      let value = this.selectedField ? this.selectedField : 'homeShotsOnTarget';
      let scale = this.selectedMinute ? this.selectedMinute : 1;

      const column = this.customColumnConfig.find(config => config.name == columnName);
      if(column) alert('The Column Name Exists. Please use another name.');
      else {
        this.customColumnConfig.push(
            {
              name: columnName, key: key,
              value: value, scale: scale
            }
        );
        this.columnOrderConfig.push(key);
        this.columnVisibilityConfig[key] = true;

        this.updateColumnGroupFromConfig('customColumns');
        this.updateTargetStrategy();
      }
    }
  }

  isColumnName():boolean{
    return (this.customColumnName && this.selectedMinute)? true:false;

  }

  deleteCustomColumn(value):void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = '176px';
    dialogConfig.position = { top: '32px' };
    dialogConfig.data = {
      msg: `Are you sure you want to delete this custom column ${value.label}?`,
      operation: 'delete',
    };
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'confirm-dialog';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.RemoveElementFromConfigArray(value.key);
        this.updateColumnGroupFromConfig('customColumns');
        this.updateTargetStrategy();
      }
    });
  }

  editCustomColumn(key):void {
    // let data;
    // this.customColumnConfig.forEach((value,index)=>{
    //   if(value.key==key) data = value;
    // });
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '420px';
    dialogConfig.height = '300px';
    dialogConfig.position = { top: '32px' };
    dialogConfig.data = {
      customColumn: key,
      customColumnConfig: this.customColumnConfig,
    };
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'confirm-dialog';

    const dialogRef = this.dialog.open(CustomColumnDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        //  console.log(this.customColumnConfig);
        this.updateElementFromConfigArray(result);
        this.updateColumnGroupFromConfig('customColumns');
        this.updateTargetStrategy();
      }
    });
  }

  updateElementFromConfigArray(val):void {
    this.customColumnConfig = JSON.parse(JSON.stringify(val.result));
  }

  RemoveElementFromConfigArray(key: string):void {
    this.customColumnConfig.forEach((value,index)=>{
      if(value.key==key) this.customColumnConfig.splice(index,1);
    });
    this._customColumnConfig.forEach((value,index)=>{
      if(value.key==key) this._customColumnConfig.splice(index,1);
    });
    this.columnOrderConfig.forEach((value,index)=>{
      if(value==key) this.columnOrderConfig.splice(index,1);
    });
    this._columnOrderConfig.forEach((value,index)=>{
      if(value==key) this._columnOrderConfig.splice(index,1);
    });
    delete this.columnVisibilityConfig[key];
    delete this._columnVisibilityConfig[key];
  }

}
