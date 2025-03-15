import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../interfaces/common/apiResponse';
import { MedicalLeave } from '../../interfaces/medical-appointment/medical-leave';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalLeaveService {
 baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<MedicalLeave[]>> {
    return this.http.get<ApiResponse<MedicalLeave[]>>(`${this.baseUrl}/MedicalLeaves`);
  }

  getById(id: string): Observable<ApiResponse<MedicalLeave>>{
    return this.http.get<ApiResponse<MedicalLeave>>(`${this.baseUrl}/MedicalLeaves/${id}`);
  }
}
