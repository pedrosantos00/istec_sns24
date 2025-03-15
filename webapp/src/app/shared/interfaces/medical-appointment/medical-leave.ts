import { Doctor } from "../doctor/doctor";
import { Patient } from "../patient/patient";

export interface MedicalLeave {
  id?: string;
  patientId?: string;
  patient?: Patient;
  doctorId?: string;
  doctor?: Doctor;
  diagnosis?: string;
  startDate?: string; // ISO string
  endDate?: string; // ISO string
  recommendations?: string;
  employer?: string;
  jobFunction?: string;
  educationLevel?: string;
  status?: MedicalLeaveStatus;
}

export enum MedicalLeaveStatus {
  Active = 0,
  Expired = 1,
}
