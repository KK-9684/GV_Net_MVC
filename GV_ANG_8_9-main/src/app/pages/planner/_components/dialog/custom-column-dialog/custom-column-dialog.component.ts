import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fieldNames } from '../../config/column-visibility-static';

@Component({
  selector: 'app-custom-column-dialog',
  templateUrl: './custom-column-dialog.component.html',
  styleUrls: ['./custom-column-dialog.component.scss']
})
export class CustomColumnDialogComponent implements OnInit {
  customColumnName: any;
  selectedField: any;
  selectedMinute: any;
  fieldNames: any[] = fieldNames;
  customColumnConfig: any;
  customColumnKey: any;
  private _customColumnConfig: any;
  private _customColumnKey: any;
  private _index: any;

  constructor(
    public dialogRef: MatDialogRef<CustomColumnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {

    this.customColumnConfig = this.data.customColumnConfig;
    this._customColumnConfig = JSON.parse(JSON.stringify(this.customColumnConfig));
    this.customColumnKey = this.data.customColumn;
    this._customColumnKey = this.customColumnKey;

    const column = this.customColumnConfig.find(config => config.key == this.customColumnKey);
    this._index = this.customColumnConfig.findIndex(config => config.key == this.customColumnKey);
    this.customColumnName = column.name;
    this.selectedField = column.value;
    this.selectedMinute = column.scale;

    this._customColumnConfig.forEach((value,index)=>{
      if(value.name==this.customColumnName) this._customColumnConfig.splice(index,1);
    });

  }

  handleNameChange(value):void{
    this.customColumnName = value;
  }

  handleFieldChange(value): void {
    this.selectedField = value;
  }

  handleMinuteChange(value): void {
    this.selectedMinute = value;
  }

  handleUpdateColumn(): void {
    if(this.isColumnName()){
      let columnName = this.customColumnName;
      let key = 'custom' + columnName;
      let value = this.selectedField ? this.selectedField : 'homeShotsOnTarget';
      let scale = this.selectedMinute ? this.selectedMinute : 1;

      const column = this._customColumnConfig.find(config => config.name == columnName);
      if(column) {
        alert('The Column Name Exists. Please use another name.');
        return;}
      else {
        this.customColumnConfig[this._index] =
            {
              name: columnName, key: key,
              value: value, scale: scale
            };

        this.dialogRef.close({ result: this.customColumnConfig });return;
      }
    }
  }

  isColumnName():boolean{
    return (this.customColumnName && this.selectedMinute)? true:false;

  }

}
