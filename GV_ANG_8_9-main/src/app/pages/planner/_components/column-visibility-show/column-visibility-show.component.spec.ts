import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnVisibilityShowComponent } from './column-visibility-show.component';

describe('ColumnVisibilityShowComponent', () => {
  let component: ColumnVisibilityShowComponent;
  let fixture: ComponentFixture<ColumnVisibilityShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnVisibilityShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnVisibilityShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
