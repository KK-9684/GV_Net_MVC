import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyFiltersOperandComponent } from './strategy-filters-operand.component';

describe('StrategyFiltersOperandComponent', () => {
  let component: StrategyFiltersOperandComponent;
  let fixture: ComponentFixture<StrategyFiltersOperandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyFiltersOperandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyFiltersOperandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
