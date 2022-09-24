import { Component, OnInit } from '@angular/core';
import { CanvaFreeDrawingService } from '../../services/canva-free-drawing.service';

@Component({
  selector: 'app-canva-tools',
  templateUrl: './canva-tools.component.html',
  styleUrls: ['./canva-tools.component.css']
})
export class CanvaToolsComponent implements OnInit {

  constructor(private drawingSvc: CanvaFreeDrawingService) { }

  ngOnInit(): void {
  }

  // public pickEraser(id: string) {
  //   const canvas = document.getElementById(id) as HTMLCanvasElement;
  //   const cx: CanvasRenderingContext2D = canvas.getContext('2d')!;
  //   this.drawingSvc.pickEraser(canvas);
  // }
}
