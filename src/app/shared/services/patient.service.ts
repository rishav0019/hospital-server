import { Patient } from "./../models/patient.model";
import { Injectable } from "@angular/core";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from "@angular/fire/firestore";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class PatientService {
  private patientCollection: AngularFirestoreCollection<Patient>;
  patientDocument: AngularFirestoreDocument<Patient>;
  patients: Observable<Patient[]>;
  patient: Observable<Patient>;

  constructor(private afs: AngularFirestore) {
    this.patientCollection = this.afs.collection("patients");
  }

  getPatients(): Observable<Patient[]> {
    var catogeryRef = this.afs.collection<Patient>("patients");

    return (this.patients = catogeryRef.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Patient;
          data.id = a.payload.doc.id;
          return data;
        })
      )
    ));
  }
  getPatientById(id: string): Observable<Patient> {
    var patientDocument: AngularFirestoreDocument<Patient>;
    patientDocument = this.afs.doc(`patients/${id}`);
    return patientDocument.valueChanges();
  }
  setPatient(patient: Patient) {
    if (!patient.id) {
      patient.id = this.afs.createId();
    }
    patient.creationDate = new Date();

    return this.patientCollection.doc(patient.id).set(patient, { merge: true });
  }
  updatePatient(patient: Patient) {
    patient.modifictaionDate = new Date();
    var patientDocument: AngularFirestoreDocument<Patient>;
    patientDocument = this.afs.doc(`patients/${patient.id}`);
    return patientDocument.update(patient);
  }
  deletePatient(Patient: Patient) {
    this.patientDocument = this.afs.doc(`patient/${Patient.id}`);
    //console.log("patient document", this.patient);
    return this.patientDocument.delete();
  }
}
