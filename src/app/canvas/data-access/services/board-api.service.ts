import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/data-access/services/auth.service';

const apiUrl = environment.baseURL + environment.canvasRelUrl;

@Injectable({
  providedIn: 'root'
})

export class BoardApiService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAll(uid: string): Observable<any> {
    return this.http.get<any>(apiUrl + "?uid=" + uid, { headers: this.authService.getAuthHeaders() });
  }
  getOne(id: string): Observable<any> {
    return this.http.get<any>(`${apiUrl}/board/${id}`, { headers: this.authService.getAuthHeaders() });
  }

  create(data: any): Observable<unknown> {
    return this.http.post(apiUrl + "/create", data, { headers: this.authService.getAuthHeaders() });
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${apiUrl}/${id}`, data, { headers: this.authService.getAuthHeaders() });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }

}
