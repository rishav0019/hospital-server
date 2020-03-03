import { Speciality } from "src/app/shared/models/speciality.model";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from "@angular/fire/firestore";
@Injectable({
  providedIn: "root"
})
export class SpecialityService {
  private categoryCollection: AngularFirestoreCollection<Speciality>;
  SpecialityDocument: AngularFirestoreDocument<Speciality>;
  Specialities: Observable<Speciality[]>;
  Speciality: Observable<Speciality>;

  constructor(private afs: AngularFirestore) {
    this.categoryCollection = this.afs.collection("speciality");
  }

  getSpeciality(): Observable<Speciality[]> {
    var catogeryRef = this.afs.collection<Speciality>("speciality");

    return (this.Specialities = catogeryRef.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Speciality;
          data.id = a.payload.doc.id;
          return data;
        })
      )
    ));
  }

  addSpeciality(speciality: Speciality) {
    if (!speciality.id) {
      speciality.id = this.afs.createId();
    }
    speciality.creationDate = new Date();

    return this.categoryCollection
      .doc(speciality.id)
      .set(speciality, { merge: true });
  }
  updateSpeciality(speciality: Speciality) {
    speciality.modificationDate = new Date();
    var SpecialityDocument: AngularFirestoreDocument<Speciality>;
    SpecialityDocument = this.afs.doc(`speciality/${speciality.id}`);
    return SpecialityDocument.update(speciality);
  }
  deleteSpeciality(speciality: Speciality) {
    this.SpecialityDocument = this.afs.doc(`speciality/${speciality.id}`);
    //console.log("category document", this.category);
    return this.SpecialityDocument.delete();
  }
}
