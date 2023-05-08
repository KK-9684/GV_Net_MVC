import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'scanner', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'planner',
        loadChildren: () =>
          import('./pages/planner/planner.module').then((m) => m.PlannerModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'scanner',
        loadChildren: () =>
          import('./pages/scanner/scanner.module').then((m) => m.ScannerModule),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
    import('./pages/auth/auth.module').then((m) => m.AuthModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
