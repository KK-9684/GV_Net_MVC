import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomColumnDialogComponent } from './custom-column-dialog.component';

describe('CustomColumnDialogComponent', () => {
  let component: CustomColumnDialogComponent;
  let fixture: ComponentFixture<CustomColumnDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomColumnDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomColumnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
