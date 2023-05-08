import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentumLineChartComponent } from './momentum-line-chart.component';

describe('MomentumLineChartComponent', () => {
  let component: MomentumLineChartComponent;
  let fixture: ComponentFixture<MomentumLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MomentumLineChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MomentumLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
