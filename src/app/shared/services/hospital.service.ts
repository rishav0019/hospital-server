import { Hospital } from "./../models/hospital.model";
import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class HospitalService {
  private hospitalCollection: AngularFirestoreCollection<Hospital>;
  constructor(private afs: AngularFirestore) {
    this.hospitalCollection = this.afs.collection("hospital_details");
  }

  getHospital(): Observable<Hospital[]> {
    var hospitalRef = this.afs.collection<Hospital>("hospital_details", ref =>
      ref.orderBy("creationDate", "desc")
    );

    return hospitalRef.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Hospital;
          data.id = a.payload.doc.id;
          return data;
        })
      )
    );
  }

  addHospital(hospital: Hospital) {
    if (!hospital.id) {
      hospital.id = this.afs.createId();
    }
    hospital.creationDate = new Date();
    hospital.modificationDate = new Date();

    return this.hospitalCollection
      .doc(hospital.id)
      .set(hospital, { merge: true });
  }

  updateHospital(hospital: Hospital) {
    hospital.modificationDate = new Date();
    var hospitalDocument: AngularFirestoreDocument<Hospital>;
    hospitalDocument = this.afs.doc(`hospital_details/${hospital.id}`);
    return hospitalDocument.update(hospital);
  }
}
