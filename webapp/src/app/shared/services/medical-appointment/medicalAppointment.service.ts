import { Injectable } from '@angular/core';
import { MedicalAppointment } from '../../interfaces/medical-appointment/medical-appointment';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../interfaces/common/apiResponse';

@Injectable({
  providedIn: 'root',
})
export class MedicalAppointmentService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  create(
    medicalAppointment: MedicalAppointment
  ): Observable<ApiResponse<MedicalAppointment>> {
    return this.http.post<ApiResponse<MedicalAppointment>>(
      `${this.baseUrl}/MedicalAppointments`,
      medicalAppointment
    );
  }

  update(
    medicalAppointment: MedicalAppointment
  ): Observable<ApiResponse<MedicalAppointment>> {
    return this.http.put<ApiResponse<MedicalAppointment>>(
      `${this.baseUrl}/MedicalAppointments`,
      medicalAppointment
    );
  }

  getAllMedicalAppointments(): Observable<ApiResponse<MedicalAppointment[]>> {
    return this.http.get<ApiResponse<MedicalAppointment[]>>(`${this.baseUrl}/MedicalAppointments`);
  }

  getAppointmentById(id: string): Observable<ApiResponse<MedicalAppointment>>{
    return this.http.get<ApiResponse<MedicalAppointment>>(`${this.baseUrl}/MedicalAppointments/${id}`);
  }
}
