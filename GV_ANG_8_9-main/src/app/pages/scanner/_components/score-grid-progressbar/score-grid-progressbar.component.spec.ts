import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreGridProgressbarComponent } from './score-grid-progressbar.component';

describe('ScoreGridProgressbarComponent', () => {
  let component: ScoreGridProgressbarComponent;
  let fixture: ComponentFixture<ScoreGridProgressbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreGridProgressbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreGridProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
