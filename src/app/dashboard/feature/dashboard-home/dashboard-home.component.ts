import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { AppRoutes } from 'src/app/shared/data-access/routes';
import { RemoveConfirmationDialogComponent } from '../../ui/remove-confirmation-dialog/remove-confirmation-dialog.component';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {

  public canva: string = '/' + AppRoutes.canvas
  public boardItems!: Array<any>;

  @ViewChild('languageMenuTrigger') menuTrigger!: MatMenuTrigger;

  constructor(private cd: ChangeDetectorRef, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.boardItems = this.updateItems();
  }

  ngAfterViewChecked(): void {
    this.boardItems = this.updateItems();
    this.cd.detectChanges();
  }

  private updateItems(): Array<unknown> {
    return JSON.parse(localStorage.getItem('boardsArray')!) || [];
  }

  public removeMe(id: string, localeStorageKey: string = 'boardsArray'): void {
    const index = this.boardItems.findIndex(el => el.id === id);

    if (index === - 1) {
      return;
    }
    //delete the item
    this.boardItems.splice(index, 1);
    //update our storage
    localStorage.setItem(localeStorageKey, JSON.stringify(this.boardItems));

  }

  public openRemoveDialog(clickedId: string): void {
    const dialogRef = this.dialog.open(RemoveConfirmationDialogComponent, {
      width: '250px',
      data: { id: clickedId, isCancel: false },
      panelClass: 'remove-confirmation-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.isCancel !== true) {
        this.removeMe(result.id);
      }

    });

  }

}
