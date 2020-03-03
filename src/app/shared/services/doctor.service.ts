import { Doctor } from "./../models/doctor.model";
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
export class DoctorService {
  private doctorCollection: AngularFirestoreCollection<Doctor>;
  doctorDocument: AngularFirestoreDocument<Doctor>;
  doctors: Observable<Doctor[]>;
  doctor: Observable<Doctor>;

  constructor(private afs: AngularFirestore) {
    this.doctorCollection = this.afs.collection("doctors");
  }

  getDoctor(): Observable<Doctor[]> {
    var catogeryRef = this.afs.collection<Doctor>("doctors");

    return (this.doctors = catogeryRef.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Doctor;
          data.id = a.payload.doc.id;
          return data;
        })
      )
    ));
  }
  getDoctorById(id: string): Observable<Doctor> {
    var doctorDocument: AngularFirestoreDocument<Doctor>;
    doctorDocument = this.afs.doc(`doctors/${id}`);
    return doctorDocument.valueChanges();
  }
  setDoctor(doctor: Doctor) {
    if (!doctor.id) {
      doctor.id = this.afs.createId();
    }
    doctor.creationDate = new Date();

    return this.doctorCollection.doc(doctor.id).set(doctor, { merge: true });
  }
  updateDoctor(doctor: Doctor) {
    doctor.modifictaionDate = new Date();
    var doctorDocument: AngularFirestoreDocument<Doctor>;
    doctorDocument = this.afs.doc(`doctors/${doctor.id}`);
    return doctorDocument.update(doctor);
  }
  deleteDoctor(doctor: Doctor) {
    this.doctorDocument = this.afs.doc(`doctors/${doctor.id}`);
    //console.log("doctor document", this.doctor);
    return this.doctorDocument.delete();
  }
}
