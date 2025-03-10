import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from './auth.service';
import { environment } from '../../environments/environment';

export interface UserResponse {
  data: User[]
  success: string
}

@Injectable({
  providedIn: 'root'
})
export class CrudUserService {
  private apiUrl = `${environment.apiUrl}/api/v1`;

  constructor(
    private http: HttpClient
  ) { }

  getUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users`);
  }

  deleteUser(id?: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  deleteUsers(ids: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/delete-multiple`, { ids });
  }
}
