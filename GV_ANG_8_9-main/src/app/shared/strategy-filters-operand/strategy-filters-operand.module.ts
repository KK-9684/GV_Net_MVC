import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { StrategyFiltersOperandComponent } from './strategy-filters-operand.component';

@NgModule({
  declarations: [StrategyFiltersOperandComponent],
  imports: [CommonModule, MaterialModule,FormsModule ],
  exports: [StrategyFiltersOperandComponent],
})
export class StrategyFiltersOperandModule {}
