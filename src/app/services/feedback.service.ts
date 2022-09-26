import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feedback } from '../models/feedback.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseURL;

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(baseUrl);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl + "/create", data);
  }
  
}
