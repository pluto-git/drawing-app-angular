import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/data-access/services/auth.service';
import { environment } from 'src/environments/environment';
import { Feedback } from './feedback.model';

const apiUrl = environment.baseURL + environment.feedbackRelURL;

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getAll(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(apiUrl, { headers: this.authService.getAuthHeaders() });
  }

  create(data: Feedback): Observable<unknown> {
    return this.http.post(apiUrl + "/create", data);
  }

}
