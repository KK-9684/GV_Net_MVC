import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsNumberSpinnerComponent } from './stats-number-spinner.component';

describe('StatsNumberSpinnerComponent', () => {
  let component: StatsNumberSpinnerComponent;
  let fixture: ComponentFixture<StatsNumberSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsNumberSpinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsNumberSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
