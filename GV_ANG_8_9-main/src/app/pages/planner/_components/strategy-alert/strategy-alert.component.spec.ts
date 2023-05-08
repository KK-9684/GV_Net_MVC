import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyAlertComponent } from './strategy-alert.component';

describe('StrategyAlertComponent', () => {
  let component: StrategyAlertComponent;
  let fixture: ComponentFixture<StrategyAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
