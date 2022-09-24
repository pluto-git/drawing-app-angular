import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDrawingSheetComponent } from './svg-drawing-sheet.component';

describe('SvgDrawingSheetComponent', () => {
  let component: SvgDrawingSheetComponent;
  let fixture: ComponentFixture<SvgDrawingSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgDrawingSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgDrawingSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
