import { Appointment } from './appointment';
import { MedicalLeave } from './medical-leave';

export interface MedicalAppointment {
  id: string;
  reasonForVisit: string;
  appointmentType: string;
  specialty: string;
  symptoms: string;
  diagnosis: string;
  prescription: string;
  appointment: Appointment;
  medicalLeave?: MedicalLeave;
}
