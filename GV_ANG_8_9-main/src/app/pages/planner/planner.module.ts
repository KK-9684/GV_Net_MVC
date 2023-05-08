import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { NumberPickerModule } from 'ng-number-picker';
import { ColorPickerModule } from "ngx-color-picker";
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { BlockUIModule } from 'ng-block-ui';

import { MaterialModule } from 'src/app/shared';
import { StrategyFiltersOperandModule } from 'src/app/shared';
import { PlannerRoutingModule } from './planner-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { PredictionResultPipe } from './_core';

import {
  UpcomingEventsTableComponent,
  StrategyListComponent,
  NoteDialogComponent,
  PredictionsMarketSelectionDialogComponent,
  StrategyTabComponent,
  StrategyAppearanceComponent,
  StrategyColumnVisibilityComponent,
  StrategyFiltersComponent,
  StrategyAlertComponent,

} from './_components';
import { PlannerComponent } from './planner.component';
import { StrategyHighlightComponent } from './_components/strategy-highlight/strategy-highlight.component';
import { StatsNumberSpinnerComponent } from './_components/stats-number-spinner/stats-number-spinner.component';
import { StrategyHistoryComponent } from './_components/strategy-history/strategy-history.component';
import { StrategySectionComponent } from './_components/strategy-section/strategy-section.component';
import { ColorPickerComponent } from './_components/color-picker/color-picker.component';
import { StrategyDialogComponent } from './_components/dialog/strategy-dialog/strategy-dialog.component';
import { ColumnVisibilityShowComponent } from './_components/column-visibility-show/column-visibility-show.component';
// import { StrategyFiltersOperandComponent } from './_components/strategy-filters-operand/strategy-filters-operand.component';
import { CustomColumnDialogComponent } from './_components/dialog/custom-column-dialog/custom-column-dialog.component';

@NgModule({
  declarations: [
    PlannerComponent,
    NoteDialogComponent,
    PredictionsMarketSelectionDialogComponent,
    UpcomingEventsTableComponent,
    StrategyListComponent,
    StrategyTabComponent,
    StrategyAppearanceComponent,
    StrategyColumnVisibilityComponent,
    StrategyFiltersComponent,
    PredictionResultPipe,
    StrategyAlertComponent,
    StrategyHighlightComponent,
    StatsNumberSpinnerComponent,
    StrategyHistoryComponent,
    StrategySectionComponent,
    ColorPickerComponent,
    StrategyDialogComponent,
    ColumnVisibilityShowComponent,
    // StrategyFiltersOperandComponent,
    CustomColumnDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableVirtualScrollModule,
    ReactiveFormsModule,
    MaterialModule,
    StrategyFiltersOperandModule,
    PlannerRoutingModule,
    ComponentsModule,
    NumberPickerModule,
    ColorPickerModule,
    jqxGridModule,
    HttpClientModule,
    DragDropModule,
    BlockUIModule.forRoot(),
  ],
  entryComponents: [],
})
export class PlannerModule { }
