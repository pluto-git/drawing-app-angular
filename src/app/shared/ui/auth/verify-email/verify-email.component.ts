import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/data-access/services/auth.service';
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['../auth.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
