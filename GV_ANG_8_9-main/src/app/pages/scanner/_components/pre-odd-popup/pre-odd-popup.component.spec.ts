import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreOddPopupComponent } from './pre-odd-popup.component';

describe('PreOddPopupComponent', () => {
  let component: PreOddPopupComponent;
  let fixture: ComponentFixture<PreOddPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreOddPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreOddPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
