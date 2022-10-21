import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvaToolsHorizontalComponent } from './canva-tools-horizontal.component';

describe('CanvaToolsHorizontalComponent', () => {
  let component: CanvaToolsHorizontalComponent;
  let fixture: ComponentFixture<CanvaToolsHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvaToolsHorizontalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvaToolsHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
