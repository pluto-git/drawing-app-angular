import { Component, OnInit, ChangeDetectorRef , ViewChild} from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public canva: string = '/' + environment.routes.CANVA;
  public drawingBoard: string = '/' + environment.routes.DRAWINGBOARD;

  public boardItems!: Array<any>;

  @ViewChild('languageMenuTrigger') menuTrigger!: MatMenuTrigger;

  constructor(private cd: ChangeDetectorRef) { }

  openMenu() {
    this.menuTrigger.openMenu();
  }
  
  closeMenu() {
    this.menuTrigger.closeMenu();
  }

  ngOnInit(): void {
    this.updateItems();
  }

  public alert(): void {
    alert('hello');
  };

  private updateItems(): void {
    this.boardItems = JSON.parse(localStorage.getItem('boardsArray')!) || [];
  }

  ngAfterViewChecked(): void {
    this.updateItems();
    this.cd.detectChanges();
  }

  public removeMe(id: string, localeStorageKey: string = 'boardsArray'): void {
    const index = this.boardItems.findIndex(el => el.id === id);

    if (index === - 1) {
      return;
    }

    this.boardItems.splice(index, 1);
    localStorage.setItem(localeStorageKey, JSON.stringify(this.boardItems));

  }


}
