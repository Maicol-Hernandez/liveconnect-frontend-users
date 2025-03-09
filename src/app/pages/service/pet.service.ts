import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Pet {
  id: number;
  name: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private apiUrl = `${environment.apiUrl}/api/v1/pets`;

  constructor(private http: HttpClient) { }

  getPets(): Observable<any> {
    return this.http.get<Pet[]>(this.apiUrl);
  }
}
