import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../interfaces/common/apiResponse';
import { Patient } from '../../interfaces/patient/patient';
import { Doctor } from '../../interfaces/doctor/doctor';
import { UpdateStorageProfilePicture } from '../../interfaces/user/updateProfilePicture';
import { StorageFile } from '../../interfaces/user/storageFile';
import { RecoverPassword } from '../../interfaces/user/recoverPassword';
import { Dashboard } from '../../interfaces/common/dashboard';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPatients(): Observable<ApiResponse<Patient[]>> {
    return this.http.get<ApiResponse<Patient[]>>(
      `${this.baseUrl}/Users/patients`
    );
  }

  getDashboard(): Observable<ApiResponse<Dashboard>> {
    return this.http.get<ApiResponse<Dashboard>>(`${this.baseUrl}/Users/dashboard`);
  }

  getUser(): Observable<ApiResponse<Doctor | Patient>> {
    return this.http.get<ApiResponse<Doctor | Patient>>(
      `${this.baseUrl}/Users`
    );
  }

  recoverPassword(
    recoverDto: RecoverPassword
  ): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(
      `${this.baseUrl}/Users/forgot-password`,
      recoverDto
    );
  }

  updateUser(
    user: Doctor | Patient
  ): Observable<ApiResponse<Doctor | Patient>> {
    if ('licenseNumber' in user && 'specialty' in user) {
      return this.http.post<ApiResponse<Doctor>>(
        `${this.baseUrl}/Users/doctor`,
        user
      );
    } else {
      return this.http.post<ApiResponse<Patient>>(
        `${this.baseUrl}/Users/patient`,
        user
      );
    }
  }

  updateProfilePicture(
    picture: any
  ): Observable<ApiResponse<StorageFile | undefined>> {
    console.log(
      `Payload size: ${(JSON.stringify(picture).length / 1024).toFixed(2)} KB`
    );

    return this.http.post<ApiResponse<StorageFile | undefined>>(
      `${this.baseUrl}/Users/change-picture`,
      picture,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
