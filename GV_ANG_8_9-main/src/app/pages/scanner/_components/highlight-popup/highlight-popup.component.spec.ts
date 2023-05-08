import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightPopupComponent } from './highlight-popup.component';

describe('HighlightPopupComponent', () => {
  let component: HighlightPopupComponent;
  let fixture: ComponentFixture<HighlightPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighlightPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
