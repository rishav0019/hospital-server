export interface User {
  id?: string;

  name: string;
  age?: string;
  gender?: genderTypes;
  phoneNumber: string;
  address?: string;
  city?: string;
  email?: string;
  state?: string;

  creationDate?: Date;
  modifictaionDate?: Date;
}

enum genderTypes {
  "MALE",
  "FEMALE"
}
