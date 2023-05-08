import { number } from '@amcharts/amcharts4/core';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-strategy-dialog',
  templateUrl: './strategy-dialog.component.html',
  styleUrls: ['./strategy-dialog.component.scss']
})
export class StrategyDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<StrategyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  strategies = [];
  currentIndex: number;
  curStg: any;
  
  ngOnInit(): void {
    this.strategies = this.data.strategies;
    this.curStg = this.strategies[0];
    this.currentIndex = 0;
  }

  handleImportStrategy(): void {
    this.dialogRef.close({ result: this.curStg });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  handleChangeStrategy(value) {
    this.currentIndex = value;
    this.curStg = this.strategies[this.currentIndex];
  }

}
