import { Address } from "./address";
import { StorageFile } from "./storageFile";

export interface ApplicationUser {
  id: string;
  name?: string;
  email? : string;
  phoneNumber? : string;
  gender?: string;
  documentNumber?: string;
  address?: Address;
  profilePicture?: StorageFile;
  notifications : Notification[];
  birthDate?: string;
  created?: string;
  updated?: string;
}
