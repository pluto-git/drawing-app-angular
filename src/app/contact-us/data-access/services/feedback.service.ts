import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Feedback } from './feedback.model';

const feedbackUrl = environment.baseURL + environment.feedbackRelURL;

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {


  constructor(private http: HttpClient) { }

  getAll(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(feedbackUrl);
  }

  create(data: any): Observable<any> {
    return this.http.post(feedbackUrl + "/create", data);
  }

}
