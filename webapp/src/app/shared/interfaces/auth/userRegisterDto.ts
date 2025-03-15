import { Address } from "../user/address";
import { Institution } from "../institution";

export interface UserRegisterDto {
  email: string;
  password: string;
  username: string;
  birthDate: string;
  documentNumber: string;
  phoneNumber : string;
  gender: string;
  address: Address;
  name: string;
  role: number;
  licenseNumber?: string;
  specialty?: string;
  institutions?: Institution[];
  snsNumber?: string;
}
