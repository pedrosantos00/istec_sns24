import { Doctor } from "../doctor/doctor";
import { Institution } from "../institution";
import { Patient } from "../patient/patient";

export interface Appointment {
  id: string;
  date: string; // ISO string
  attended: boolean;
  doctorId: string;
  doctor: Doctor;
  patientId: string;
  patient: Patient;
  institutionId: string;
  institution?: Institution;
}
