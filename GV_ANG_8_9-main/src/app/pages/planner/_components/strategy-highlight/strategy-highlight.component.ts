import { Component, Input, OnInit } from '@angular/core';
import { StateService } from 'src/app/core/services';
import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-strategy-highlight',
  templateUrl: './strategy-highlight.component.html',
  styleUrls: ['./strategy-highlight.component.scss']
})
export class StrategyHighlightComponent implements OnInit {

  constructor(
    private _store: StateService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) { 
    iconRegistry.addSvgIcon(
      'info',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/Vector.svg'));
  }
  @Input() disabled;
  targetStrategy: any;

  gridDisplayConfig: any;
  imageExportConfig: any;
  _highlightConfig = {
    statsDifferenceHighColour: '#ffffff',
    statsDifferenceHighValue: null,
    statsDifferenceMediumColour: '#ffffff',
    statsDifferenceMediumValue: null,
    statsDifferenceLowColour: '#ffffff',
    statsDifferenceLowValue: null,
    attackConversionHighColour: '#ffffff',
    attackConversionHighValue: null,
    attackConversionLowColour: '#ffffff',
    attackConversionLowValue: null,
    shape: 'rect',
  }

  highlightConfig: any;

  ngOnInit(): void {
    this._initValues();
    this._getTargetStrategy();
  }

  private _initValues() {
    this.gridDisplayConfig = {
      RowClickPrimary: '' ,
      RowClickSecondary: '' ,
      RowHoverColour: ''
    };
    this.imageExportConfig = {
      Home: '',
      Away: '',
    };
    this.highlightConfig = JSON.parse(
      JSON.stringify(this._highlightConfig)
    );
  }

  private _getTargetStrategy(): void {
    this._store.targetStrategy
      .pipe(
        filter(Boolean),
        tap((strategy) => {
          this.targetStrategy = strategy;
          if (this.targetStrategy.highlightConfig) {
            this.highlightConfig = JSON.parse(
              this.targetStrategy.highlightConfig
            );
          } else {
            this.highlightConfig = JSON.parse(
              JSON.stringify(this._highlightConfig)
            );
          }

          if (this.targetStrategy.gridDisplayConfig) {
            this.gridDisplayConfig = JSON.parse(
              this.targetStrategy.gridDisplayConfig
            );
            delete this.gridDisplayConfig['rowHighlightColour'];
            const { RowClickPrimary, RowClickSecondary, RowHoverColour, Home, Away } = this.gridDisplayConfig;

            if (!RowClickPrimary) {
              this.gridDisplayConfig['RowClickPrimary'] = '';
            }
            if (!RowClickSecondary) {
              this.gridDisplayConfig['RowClickSecondary'] = '';
            }
            if (!RowHoverColour) {
              this.gridDisplayConfig['RowHoverColour'] = '';
            }
          }
          if(this.targetStrategy.imageExportConfig){
            this.imageExportConfig = JSON.parse(
              this.targetStrategy.imageExportConfig
            );
            delete this.imageExportConfig['home'];
            const {Home, Away} = this.imageExportConfig;
            if(!Home){
              this.imageExportConfig['Home'] = '';
            }
            if(!Away){
              this.imageExportConfig['Away'] = '';
            }
          }
        })
      )
      .subscribe(() => {});
  }

  handleChange() {
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      highlightConfig: JSON.stringify(this.highlightConfig)
    })
  }

  updateRowHighlightColour(value, key) {
    this.gridDisplayConfig[key] = value;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      gridDisplayConfig: JSON.stringify(this.gridDisplayConfig)
    })
  }

  updateHomeImageExportColour(value, key) {
    this.imageExportConfig[key] = value;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      imageExportConfig: JSON.stringify(this.imageExportConfig)
    })
  }

  handleChangeShape(value) {
    this.highlightConfig.shape = value;
    this._store.setTargetStrategy({
      ...this.targetStrategy,
      highlightConfig: JSON.stringify(this.highlightConfig)
    })
  }
}
