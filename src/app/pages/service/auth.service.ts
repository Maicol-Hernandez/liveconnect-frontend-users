import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id?: number;
  name?: string;
  email: string;
  password?: string;
  password_confirm?: string;
  pets?: string[];
  token?: string;
  updated_at?: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: User;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/v1`;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredAuthData();
  }

  /**
   * Load stored authentication data from localStorage
   */
  private loadStoredAuthData(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem(this.userKey);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Observable with the registration response
   */
  register(userData: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => this.handleAuthentication(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Log in a user with email and password
   * @param credentials Login credentials
   * @returns Observable with the login response
   */
  login(credentials: Login): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthentication(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Log out the current user
   */
  logout(): Observable<any> {
    // First call the logout endpoint if the API requires it
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        // Clear stored data
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);

        // Update subjects
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);

        // Navigate to the login page
        this.router.navigate(['/auth/login']);
      }),
      catchError(error => {
        // Even if the API call fails, we want to clear local data
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/auth/login']);

        return this.handleError(error);
      })
    );
  }

  /**
   * Get current user information from the API
   * @returns Observable with the user data
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/user`).pipe(
      map(response => response.user),
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem(this.userKey, JSON.stringify(user));
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get stored authentication token
   * @returns The stored token or null
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Check if user is authenticated
   * @returns True if authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Handle successful authentication
   * @param response Authentication response
   */
  private handleAuthentication(response: AuthResponse): void {
    if (response && response.data.token) {
      // Store token and user data
      localStorage.setItem(this.tokenKey, response.data.token);
      localStorage.setItem(this.userKey, JSON.stringify(response.data));

      // Update subjects
      this.currentUserSubject.next(response.data);
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * Handle HTTP errors
   * @param error HTTP error
   * @returns Observable with error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error has occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Unauthorized: Please login again';
        // Force logout on 401 errors
        this.logout();
      } else if (error.status === 422) {
        // Validation errors
        if (error.error && error.error.message) {
          errorMessage = 'Validation error: ' + JSON.stringify(error.error.message);
        } else {
          errorMessage = 'Validation error in the submitted data';
        }
      } else {
        errorMessage = `Error code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
