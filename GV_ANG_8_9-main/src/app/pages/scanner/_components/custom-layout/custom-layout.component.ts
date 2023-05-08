import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-layout',
  templateUrl: './custom-layout.component.html',
  styleUrls: ['./custom-layout.component.scss']
})
export class CustomLayoutComponent implements OnInit {
  layouts: any;
  strategies: any;
  currentIndex: any;
  selectedLayout: any;
  layoutName: any;
  private _structure: any;

  constructor(
    public dialogRef: MatDialogRef<CustomLayoutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    const data = this.data;
    this.layouts = data.layouts;
    this.strategies = data.strategies;
    this.currentIndex = data.index;
    this.selectedLayout = this.layouts[this.currentIndex];
    this._addNewStrategiesToStructure();

  }

  private _addNewStrategiesToStructure() {
    this.strategies.forEach(element1 => {
      let flag = true;
      this.selectedLayout.structure.forEach(element2 => {
        if(element1.strategyId == element2.StrategyId) {
          flag = false;
        }
      });
      if(flag) {
        this.selectedLayout.structure.push({
          StrategyId: element1.strategyId,
          Order: this.selectedLayout.structure.length,
          Visible: false,
        })
      }
    });
    this._structure = JSON.parse(JSON.stringify(this.selectedLayout.structure));
  }

    getStrategyName(strategyId): any {
    const strategy = this.strategies.find(
      (strategy) => strategy.strategyId === strategyId
    );

    if (strategy) {
      return strategy.name;
    } else {
      // return 'Hidden strategyId: ' + strategyId;
      return false;
    }
  }

  drop(event: CdkDragDrop<any>) {
    // const strategy = JSON.parse(JSON.stringify(this.strategies));
    // moveItemInArray(strategy, event.previousIndex, event.currentIndex);
    const visibleArray = this.selectedLayout.structure;
    moveItemInArray(visibleArray, event.previousIndex, event.currentIndex);
  }

  cancelLayout() {
    this.selectedLayout.structure = this._structure;
    this.dialogRef.close({ result: false });return;
  }

  saveLayout(): void {

      this.dialogRef.close({ result: this.selectedLayout });return;
  }

}
