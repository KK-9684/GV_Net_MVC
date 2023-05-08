import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyHistoryComponent } from './strategy-history.component';

describe('StrategyHistoryComponent', () => {
  let component: StrategyHistoryComponent;
  let fixture: ComponentFixture<StrategyHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
