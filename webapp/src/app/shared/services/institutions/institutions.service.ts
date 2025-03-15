import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Institution } from '../../interfaces/institution';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../interfaces/common/apiResponse';

@Injectable({
  providedIn: 'root',
})
export class InstitutionsService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getInstitutions() : Observable<ApiResponse<Institution[]>> {
    return this.http.get<ApiResponse<Institution[]>>(`${this.baseUrl}/Institutions`);
  }

  getFilteredInstitutions() : Observable<ApiResponse<Institution[]>> {
    return this.http.get<ApiResponse<Institution[]>>(`${this.baseUrl}/Institutions/filter`);
  }


  getInstitution(id: string) : Observable<ApiResponse<Institution>> {
    return this.http.get<ApiResponse<Institution>>(`${this.baseUrl}/Institutions/${id}`);
  }
}
