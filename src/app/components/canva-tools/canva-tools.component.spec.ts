import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvaToolsComponent } from './canva-tools.component';

describe('CanvaToolsComponent', () => {
  let component: CanvaToolsComponent;
  let fixture: ComponentFixture<CanvaToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvaToolsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvaToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
