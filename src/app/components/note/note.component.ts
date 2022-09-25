import { Component, AfterViewInit, ViewChild, ElementRef, Injector, ViewContainerRef } from '@angular/core';
import { PopupNoteComponent } from '../popup-note/popup-note.component';
import { NoteControlService } from '../../services/note-control.service';

// declare var bootstrap: any;


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
  public dragDisabled: boolean = false;

  public unique_key!: number;

  @ViewChild('note') public note!: ElementRef;


  constructor(private _injector: Injector, private noteSVC: NoteControlService) {
    this.popupNoteComponent = this._injector.get<PopupNoteComponent>(PopupNoteComponent);
  }

  ngAfterViewInit(): void {
    
    const note = this.note.nativeElement;
    note.style.backgroundColor = this.color;

    note.style.top = this.positionX + 'px';
    note.style.left = this.positionY + 'px';
  }



  ngAfterViewChecked(): void {
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

  addClassName(className: string = 'no-select'): void {
    const note = this.note.nativeElement;

    note.classList.contains(className) && note.classList.addList('no-select');
  }
  removeClassName(className: string = 'no-select'): void {
    const note = this.note.nativeElement;

    note.classList.contains(className) && note.classList.remove('no-select');
  }

  remove(event: Event): void {
    const target = event.target as Element;
    const id = target.parentElement?.id;
    console.log(id);
    if (id) {
      this.noteSVC.removeNote(id);
    }
  }

}
