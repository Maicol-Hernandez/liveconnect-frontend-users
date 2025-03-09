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
        let errorMsg = 'Error desconocido';
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else if (error.status === 422) {
          errorMsg = 'Error de validación: ' + JSON.stringify(error.error.errors);
        } else {
          errorMsg = `Código de error: ${error.status}\nMensaje: ${error.message}`;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
