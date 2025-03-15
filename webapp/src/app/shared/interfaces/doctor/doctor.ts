import { ApplicationUser } from '../user/applicationUser';
import { Institution } from '../institution';
import { MedicalLeave } from '../medical-appointment/medical-leave';

export interface Doctor extends ApplicationUser {
  licenseNumber?: string;
  specialty?: string;
  isPublicSector?: boolean;
  institutions?: Institution[] | null;
  medicalLeavesIssued?: MedicalLeave[];
}
