import { Component, AfterViewInit, ViewChild, ElementRef, Injector, ChangeDetectorRef } from '@angular/core';
import { PopupNoteComponent } from '../popup-note/popup-note.component';
import { NoteControlService } from '../../services/note-control.service';
import { CanvaComponent } from '../canva/canva.component';
import { tools } from '../canva/tools';


@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
  providers: [PopupNoteComponent]
})

export class NoteComponent implements AfterViewInit {

  public type: string = "note";
  public id!: string;
  public dragZone: string = ".draging-zone"; //draging zone for our component
  public message: string = "Works!";
  public color: string = "gold";
  public positionX!: number;
  public positionY!: number;
  public popupNoteComponent!: PopupNoteComponent;
  public isHidden: boolean = false;
  public dragDisabled!: boolean;

  public unique_key!: number;

  @ViewChild('note') public note!: ElementRef;

  constructor(private _injector: Injector, private noteSVC: NoteControlService, private cd: ChangeDetectorRef, private canvaComponent: CanvaComponent) {
    this.popupNoteComponent = this._injector.get<PopupNoteComponent>(PopupNoteComponent,
    );
  }

  ngAfterViewInit(): void {

    // this.cd.detectChanges();
    const note = this.note.nativeElement;
    note.style.backgroundColor = this.color;

    note.style.top = this.positionX + 'px';
    note.style.left = this.positionY + 'px';
  }



  ngAfterViewChecked(): void {

    this.setUIBehaviour();

    const note = this.note.nativeElement;
    this.isHidden ? note.style.display = 'none' : note.style.display = 'flex';
    const offsets = note.getBoundingClientRect();
    // console.log(offsets);
    this.positionX = offsets.top;
    this.positionY = offsets.left;
    console.log(this.positionX);
    console.log(this.positionY);
    // note.style.top = this.positionX + 'px';
    // note.style.left = this.positionY + 'px';
    // console.log(this.isHidden);
  }

  private setUIBehaviour(): void {
    console.log(this.canvaComponent.currentTool);
    if (this.canvaComponent.currentTool !== tools.select) {
      this.dragDisabled = true;
      this.note.nativeElement.classList.remove('dragging-cursor');
    } else {
      this.dragDisabled = false;
      this.note.nativeElement.classList.add('dragging-cursor');
    }
    this.cd.detectChanges();
  }

  removeCurrentNote(event: Event): void {
    const target = event.target as Element;
    const id = target.parentElement?.id;
    console.log(id);
    if (id) {
      this.noteSVC.removeNote(id);
    }
  }

  ngOnDestroy(): void {
    //this.dragDisabled = true;
  }

}
