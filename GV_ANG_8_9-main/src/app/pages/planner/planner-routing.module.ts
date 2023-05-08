import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpcomingEventsTableComponent } from './_components/upcoming-events-table/upcoming-events-table.component';
import { StrategySectionComponent } from './_components/strategy-section/strategy-section.component';
import { PlannerComponent } from './planner.component';

const routes: Routes = [
  { path: '', redirectTo: 'schedule' },
  {
    path: '', 
    component: PlannerComponent, 
    children: [
      { path: 'schedule', component: UpcomingEventsTableComponent },
      { path: 'strategy', component: StrategySectionComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlannerRoutingModule { }
