import { InstitutionFilterOption } from "../enums/institutionsFilterOption";
import { Address } from "./user/address";

export interface Institution {
  id: string;
  name: string;
  address: Address;
  isPublicSector: boolean;
  phoneNumber: string;
  totalDoctors: number;
}
