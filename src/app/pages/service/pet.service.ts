import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Pet, PetResponse } from '@shared/models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private apiUrl = `${environment.apiUrl}/api/v1/pets`;

  constructor(private http: HttpClient) { }

  getPets(): Observable<PetResponse> {
    return this.http.get<PetResponse>(this.apiUrl);
  }
}
