import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User, UserResponse } from '@shared/models/user.model';
import { environment } from '../../environments/environment';

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

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user);
  }

  deleteUser(id?: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  deleteUsers(ids: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/delete-multiple`, { ids });
  }
}
