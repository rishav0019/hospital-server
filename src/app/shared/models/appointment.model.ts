export interface Appointment {
  bookingId?: string;
  bookingStatus?: string;
  creationDate?: Date;
  dateSlot?: Date;
  dayWithDate?: string;
  doctorId?: string;
  doctorMobile?: string;
  doctorName?: string;
  doctorSpeciality?: string;
  id?: string;
  patientAddress?: string;
  modificationDate?: Date;
  patientAge?: string;
  patientCity?: string;
  patientEmail?: string;
  patientGender?: string;

  patientMobileNumber?: string;
  patientName?: string;
  patientState?: string;
  symptoms?: string;

  timeSlot?: string;
  timing?: string;
  userId?: string;
}
