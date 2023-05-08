import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './_components/home/home.component';
import { PlayService } from './play.service';
import { MessageService } from './message.service';
import { ScannerStoreService } from './scanner-store.service';
import { ScannerRoutingModule } from './scanner-routing.module';
import { ScannerComponent } from './scanner.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StrategyFiltersOperandModule } from 'src/app/shared';
import { MatchesComponent } from './_components/matches/matches.component';
import { TeamsComponent } from './_components/teams/teams.component';
import { EventsComponent } from './_components/events/events.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ChartsModule } from 'ng2-charts';
import { MomentumGraphComponent } from './_components/momentum-graph/momentum-graph.component';
import { MomentumSplineChartComponent } from './_components/momentum-spline-chart/momentum-spline-chart.component';
import { FormsModule } from '@angular/forms';
import { AveragePipeModule } from './_components/pipes/average.pipe';
import { SumPipeModule } from './_components/pipes/sum.pipe';
import { SearchPipeModule } from './_components/pipes/search-filter.pipe';
import { CurrentFormComponent } from './_components/current-form/current-form.component';
import { HistoricalStatsPopOverComponent } from './_components/historical-stats-pop-over/historical-stats-pop-over.component';
import { ScoreGridComponent } from './_components/score-grid/score-grid.component';
import { CurrentFormGridComponent } from './_components/current-form-grid/current-form-grid.component';
import { QuickFilterPopupComponent } from './_components/quick-filter-popup/quick-filter-popup.component';
import { StatsFilterPopupComponent } from './_components/stats-filter-popup/stats-filter-popup.component';
import { SettingsPopupComponent } from './_components/settings-popup/settings-popup.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { BlockUIModule } from 'ng-block-ui';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';

import { StrategyPopupComponent } from './_components/strategy-popup/strategy-popup.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler';

import { HttpTokenInterceptor, AuthInterceptor } from '../../core/interceptors';
import { IconInformationPopupComponent } from './_components/icon-information-popup/icon-information-popup.component';
import { UserPredictionPopupComponent } from './_components/user-prediction-popup/user-prediction-popup.component';
import { UserNotePopupComponent } from './_components/user-note-popup/user-note-popup.component';
import { PreOddPopupComponent } from './_components/pre-odd-popup/pre-odd-popup.component';
import { HighlightPopupComponent } from './_components/highlight-popup/highlight-popup.component';
import { ManageLayoutsComponent } from './_components/manage-layouts/manage-layouts.component';
import { CustomLayoutComponent } from './_components/custom-layout/custom-layout.component';
import { MomentumLineChartComponent } from './_components/momentum-line-chart/momentum-line-chart.component';
import { ChartistModule } from 'ng-chartist';
import { ScoreGridImgComponent } from './_components/score-grid-img/score-grid-img.component';
import { ScoreGridProgressbarComponent } from './_components/score-grid-progressbar/score-grid-progressbar.component';
import { MatMenuModule } from '@angular/material/menu';

const MatModules = [
  MatToolbarModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatSortModule,
  MatPaginatorModule,
  MatButtonModule,
  MatSelectModule,
  MatExpansionModule,
  MatDialogModule,
  MatMenuModule,
];
@NgModule({
  declarations: [
    ScannerComponent,
    HomeComponent,
    ScoreGridComponent,
    MatchesComponent,
    TeamsComponent,
    EventsComponent,
    MomentumGraphComponent,
    MomentumSplineChartComponent,
    CurrentFormComponent,
    HistoricalStatsPopOverComponent,
    CurrentFormGridComponent,
    QuickFilterPopupComponent,
    StatsFilterPopupComponent,
    SettingsPopupComponent,
    StrategyPopupComponent,
    IconInformationPopupComponent,
    UserPredictionPopupComponent,
    UserNotePopupComponent,
    PreOddPopupComponent,
    HighlightPopupComponent,
    ManageLayoutsComponent,
    CustomLayoutComponent,
    MomentumLineChartComponent,
    ScoreGridImgComponent,
    ScoreGridProgressbarComponent
  ],
  imports: [
    CommonModule,
    ScannerRoutingModule,
    NgbModule,
    HttpClientModule,
    ChartsModule,
    ColorPickerModule,
    FormsModule,
    AveragePipeModule,
    SumPipeModule,
    SearchPipeModule,
    AngularSvgIconModule.forRoot(),
    ScrollingModule,
    InfiniteScrollModule,
    VirtualScrollerModule,
    jqxGridModule,
    MatModules,
    DragDropModule,
    BlockUIModule.forRoot(),
    ChartistModule,
    StrategyFiltersOperandModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    PlayService,
    MessageService,
    ScannerStoreService
  ]
})
export class ScannerModule { }
