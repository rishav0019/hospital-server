export interface Patient {
  id?: string;
  patient_id?: string;
  name: string;
  age?: string;
  gender?: genderTypes;
  mobileNumber: string;
  address?: string;
  city?: string;
  email?: string;
  status?: string;
  type?: string;
  state?: string;

  creationDate?: Date;
  modifictaionDate?: Date;
}

enum genderTypes {
  "MALE",
  "FEMALE"
}
