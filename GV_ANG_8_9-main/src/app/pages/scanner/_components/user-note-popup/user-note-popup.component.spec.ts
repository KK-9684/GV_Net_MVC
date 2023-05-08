import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNotePopupComponent } from './user-note-popup.component';

describe('UserNotePopupComponent', () => {
  let component: UserNotePopupComponent;
  let fixture: ComponentFixture<UserNotePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNotePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
