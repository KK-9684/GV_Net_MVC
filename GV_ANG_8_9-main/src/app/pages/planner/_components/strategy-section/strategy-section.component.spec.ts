import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategySectionComponent } from './strategy-section.component';

describe('StrategySectionComponent', () => {
  let component: StrategySectionComponent;
  let fixture: ComponentFixture<StrategySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategySectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
