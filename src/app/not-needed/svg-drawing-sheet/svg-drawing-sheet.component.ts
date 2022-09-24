import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
declare let Scribby: any;

@Component({
  selector: 'app-svg-drawing-sheet',
  templateUrl: './svg-drawing-sheet.component.html',
  styleUrls: ['./svg-drawing-sheet.component.css']
})

//////////  NOT NEEDED HERE, JUST to test some things ///////////////////////////////////
export class SvgDrawingSheetComponent {

  constructor() { }

  @ViewChild('svgBoard') public svgEl!: ElementRef;
  @ViewChild('svgContainer') public svgContainer!: ElementRef;

  private scr: typeof Scribby;

  lastW = 0;
  lastH = 0;

  @HostListener("window:resize", [])
  public onResize() {
    const svgContainer = this.svgContainer.nativeElement;

    // const rect = this.svgEl.nativeElement.getBoundingClientRect();
    // const w = rect.width;
    // const h = rect.height;
    // this.svgEl.nativeElement.setAttribute("viewBox", `0 0 ${w} ${h}`);
    // this.svgContainer.nativeElement.setAttribute("height", "auto");

    // this.svgEl.nativeElement.setAttribute("height", "auto");
    // const rect = svgContainer.getBoundingClientRect();
    // const w = rect.width;
    // const h = rect.height;


    //this.setScale(this.svgEl.nativeElement, window.innerWidth / this.lastW, window.innerHeight / this.lastH);
    // this.svgEl.nativeElement.setAttribute("transform","scale(0.5,0.5)");
    // console.log(this.lastW, this.lastH);
    // console.log(w,h);
    // svgContainer.setAttribute("transform", `scaleX(${w / this.lastW}) scaleY(${h / this.lastH})`);
    //this.svgContainer.nativeElement.setAttribute("transform", `scale(${w / this.lastW}),${h / this.lastH})`);
    // this.svgEl.nativeElement.setAttribute("transform", `scale(${w / this.lastW}),${h / this.lastH})`);
    this.lastW = window.innerWidth;
    this.lastH = window.innerHeight;

  }

  ngAfterViewInit(): void {
    const svg = this.svgEl.nativeElement;
    // svg.setAttribute('width', "2000px");
    // svg.setAttribute('height', "1000px");

    // this.setScale(svg, window.innerWidth / 2000, window.innerHeight / 1000);
    const rect = svg.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    this.svgEl.nativeElement.setAttribute("viewBox", `0 0 ${w} ${h}`);



    this.scr = new Scribby(svg);
    this.scr.setBufferSize(1);
  }

  getOrientation() {
    var orientation = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
    return orientation;
  }

  setScale(el: HTMLElement, x: number, y: number): void {
    el.setAttribute("transform", `scale(${x},${y})`);
  }

  setDimensions(width: number, height: number, el: HTMLElement = this.svgEl.nativeElement): void {
    el.setAttribute('width', `${width}px`);
    el.setAttribute('height', `${height}px`);
  }





}
