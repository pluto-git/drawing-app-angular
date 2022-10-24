import { Component, OnInit, Input } from '@angular/core';
import { PopupNoteComponent } from '../popup-note/popup-note.component';

import { colors } from '../../data-access/colors';
@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss']
})
export class CircleComponent implements OnInit {

  public colors = colors;
  public popupNoteComponent!: PopupNoteComponent; // to be injected.
  public colorChanged: boolean = false;

  @Input() id!: string
  @Input() colorFill!: string
  @Input() isWhiteCircle?: boolean = false;

  constructor() { }

  ngOnInit(): void {
    console.log(this.colorChanged);
  }

  public changeTextareaColor(colorCircleId: string, id: string = 'exampleFormControlTextarea1'): void {
    const color = colors[colorCircleId as keyof typeof colors].value;

    document.getElementById(id)!.style.backgroundColor = color;

    //applying additional styles for not white circles!
    this.hideCircleArrows();
    colorCircleId !== colors.white.id && this.styleColorButton(colorCircleId);

    this.colorChanged = true;
  }

  private hideCircleArrows(): void {
    //add hide to all circle arrows . to be sure.
    const circles = <NodeListOf<Element>>document.querySelectorAll('.modal-color .with-arrow');
    circles && Array.from(circles).forEach(el =>
      el.nextElementSibling!.classList.add('d-none')
    );
  }

  private styleColorButton(circleId: string): void {

    const selectedCircle = <HTMLElement>document.getElementById(circleId);

    //remove a bootstrap class 'd-none' to show element from the next sibling (path).
    //ofc you need to have the structure: <svg> <ellipse [id]='circleId' /> <path class='d-none'/> <svg/>
    selectedCircle.nextElementSibling!.classList.remove('d-none');

  }

  public getColorCircleIdByValue(hex: string): string {
    const colorArr = Object.entries(this.colors).map(e => e[1]);
    return colorArr.find(el => el.value === hex)!.id;
  }

  ngOnDestroy(): void {
    this.colorChanged = false;
  }

}
