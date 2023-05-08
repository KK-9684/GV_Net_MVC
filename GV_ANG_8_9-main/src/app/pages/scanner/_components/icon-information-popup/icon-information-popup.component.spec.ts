import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconInformationPopupComponent } from './icon-information-popup.component';

describe('UserPredictionPopupComponent', () => {
  let component: IconInformationPopupComponent;
  let fixture: ComponentFixture<IconInformationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconInformationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconInformationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
