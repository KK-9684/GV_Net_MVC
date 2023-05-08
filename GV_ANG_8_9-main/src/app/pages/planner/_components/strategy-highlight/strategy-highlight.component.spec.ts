import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyHighlightComponent } from './strategy-highlight.component';

describe('StrategyHighlightComponent', () => {
  let component: StrategyHighlightComponent;
  let fixture: ComponentFixture<StrategyHighlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyHighlightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
