import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { BoardApiService } from 'src/app/canvas/data-access/services/board-api.service';
import { AppRoutes } from 'src/app/shared/data-access/routes';
import { RemoveConfirmationDialogComponent } from '../../ui/remove-confirmation-dialog/remove-confirmation-dialog.component';
import { Board } from 'src/app/canvas/data-access/models/board';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {

  public canva: string = '/' + AppRoutes.canvas
  public boardItems!: Array<Board | any>;
  public boards: Array<Board | any> = [];

  @ViewChild('languageMenuTrigger') menuTrigger!: MatMenuTrigger;

  constructor(private cd: ChangeDetectorRef, public dialog: MatDialog,
    private boardService: BoardApiService) { }

  ngOnInit(): void {
    this.boardItems = this.updateItems();
    this.getBoardsFromApi();
  }

  ngAfterViewChecked(): void {

  }

  private updateItems(): Array<unknown> {
    return JSON.parse(localStorage.getItem('boardsArray')!) || [];
  }

  public getBoardsFromApi(): void {
    const uid = JSON.parse(localStorage.getItem('user')!).uid;
    this.boardService.getAll(uid)
      .subscribe({
        next: (data) => {
          console.log(data);
          data.forEach((element: any) => {
            this.boards.push(element.canvasData);
          });
          console.log(this.boards);
          //this.boards = data.canvasData as Board[];
        },
        error: (e: Event) => console.error(e)
      });
  }

  public removeMe(id: string, boards: Array<Board | any> = this.boards): void {
    const index = this.boards.findIndex(el => el.id === id);
    if (index === -1) {
      return;
    }

    this.boardService.delete(id)
      .subscribe({
        next: (res) => {
          console.log(res);

        },
        error: (e) => console.error(e)
      });

    //delete the item
    this.boards.splice(index, 1);

    // //update our storage
    // localStorage.setItem(localeStorageKey, JSON.stringify(this.boardItems));

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
