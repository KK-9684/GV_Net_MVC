import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPredictionPopupComponent } from './user-prediction-popup.component';

describe('UserPredictionPopupComponent', () => {
  let component: UserPredictionPopupComponent;
  let fixture: ComponentFixture<UserPredictionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPredictionPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPredictionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
