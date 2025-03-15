import { ApplicationUser } from '../user/applicationUser';
import { MedicalLeave } from '../medical-appointment/medical-leave';

export interface Patient extends ApplicationUser {
  snsNumber?: string;
  medicalLeaves?: MedicalLeave[];
}
