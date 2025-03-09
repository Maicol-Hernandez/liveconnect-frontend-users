import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export interface User {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
  pets: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/v1/register`;

  constructor(private http: HttpClient) { }

  register(userData: User): Observable<any> {
    return this.http.post(this.apiUrl, userData).pipe(
      catchError(error => {
        let errorMsg = 'Unknown error';
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else if (error.status === 422) {
          errorMsg = 'Validation error: ' + JSON.stringify(error.error.message);
        } else {
          errorMsg = `Error code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
