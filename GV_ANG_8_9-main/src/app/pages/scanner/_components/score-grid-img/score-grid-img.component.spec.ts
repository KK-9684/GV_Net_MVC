import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreGridImgComponent } from './score-grid-img.component';

describe('ScoreGridImgComponent', () => {
  let component: ScoreGridImgComponent;
  let fixture: ComponentFixture<ScoreGridImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreGridImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreGridImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
