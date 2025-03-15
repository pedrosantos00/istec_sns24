import { MedicalAppointment } from "../medical-appointment/medical-appointment";
import { ApplicationUser } from "../user/applicationUser";

export interface Dashboard {
  user?: ApplicationUser;
  appointments?: MedicalAppointment[];
}
