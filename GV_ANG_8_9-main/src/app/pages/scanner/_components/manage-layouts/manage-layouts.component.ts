import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { StateService } from 'src/app/core/services/state.service';
import { PlayService } from 'src/app/pages/scanner/play.service';
import { ScannerStoreService } from 'src/app/pages/scanner/scanner-store.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import {CustomLayoutComponent} from 'src/app/pages/scanner/_components/custom-layout/custom-layout.component';

@Component({
  selector: 'app-manage-layouts',
  templateUrl: './manage-layouts.component.html',
  styleUrls: ['./manage-layouts.component.scss'],
})
export class ManageLayoutsComponent implements OnInit {
  layouts: any[] = [];
  strategies: any[] = [];
  createLayoutName: string = '';
  selectedLayout: any;
  createLayoutHidden: boolean = true;
  visibleArray: any[] = [];

  constructor(
    public dialog: MatDialog,
    private _rootStore: StateService,
    private _service: PlayService,
    private _localStore: ScannerStoreService
  ) {
    this.getCustomLayouts();
    this.getStrategies();
  }

  ngOnInit(): void {}

  getCustomLayouts(): void {
    this._rootStore.scannerLayouts.subscribe((layouts) => {
      this.layouts = layouts;
    });
  }
  getStrategies(): void {
    this._localStore.strategies.subscribe((strategies) => {
      this.strategies = strategies;
      if(this.strategies && this.strategies.length){
        this.strategies.forEach(strategy => {
          this.visibleArray.push({
            id: strategy.strategyId,
            value: strategy.showOnScanner,
          })
        })
      }
    });
  }

  drop1(event: CdkDragDrop<any>) {
    const strategy = this.strategies;
    moveItemInArray(strategy, event.previousIndex, event.currentIndex);
    const visibleArray = this.visibleArray;
    moveItemInArray(visibleArray, event.previousIndex, event.currentIndex);
  }

  handleVisibleChange(index) {
    let val = this.visibleArray[index].value;
    this.visibleArray[index].value = !val;

  }

  createLayout(): void {
    const structure = [];
    this.strategies.forEach((strategy, index) => {
      structure.push({
        StrategyId: strategy.strategyId,
        Order: index,
        Visible: this.visibleArray[index].value,
      });
    });
    var position = (this.layouts.length)? this.layouts.length+1:1;
    const currentLayout = {
      layoutId: 0,    //for new layout
      name: this.createLayoutName,
      structure: JSON.stringify(structure),
      hidden: !this.createLayoutHidden,
      menuPosition: ''+position,
    };
    this._service.saveCustomLayout(currentLayout).subscribe(() => {
      this.getCustomLayouts();
    });
  }

  // isChanged(): boolean {
  //   if (!this.layouts) {
  //     return false;
  //   }
  //   const currentLayout = {
  //     ...this.layouts[this.currentLayoutIndex],
  //     name: this.selectedLayout.layoutName,
  //     hidden: !this.selectedLayout.layoutHidden,
  //     structure: this.selectedLayout.structure,
  //   };

  //   return (
  //     this.layouts.findIndex((val) => {
  //       return JSON.stringify(val) == JSON.stringify(currentLayout);
  //     }) == -1
  //   );
  // }

  deleteLayout(index): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = '176px';
    dialogConfig.position = { top: '32px' };
    dialogConfig.data = {
      msg: `Are you sure you want to remove this layout?`,
      operation: 'delete',
    };
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'confirm-dialog';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const currentLayout = this.layouts[index];
        this._service
          .deleteCustomLayout(currentLayout.layoutId)
          .subscribe(() => {});
      }
    });
  }

  editLayout(index): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '80%';
    // dialogConfig.height = '320px';
    dialogConfig.position = { top: '32px' };
    dialogConfig.data = {
      layouts: this.layouts,
      index: index,
      strategies: this.strategies,
    };
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'confirm-dialog';

    const dialogRef = this.dialog.open(CustomLayoutComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((ret) => {
      if (ret.result) {
        let result = ret.result;
        const currentLayout = this.layouts[index];
        this._service
        .saveCustomLayout({
          ...currentLayout,
          name: result.name,
          hidden: result.hidden,
          structure: JSON.stringify(result.structure),
        })
        .subscribe(() => {
          this.getCustomLayouts();
        });
      }
    });
  }

}
