import { Injectable } from "@angular/core";
import { Billing } from "../models/billing.model";
import { Observable } from "rxjs";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class BillingService {
  private billingCollection: AngularFirestoreCollection<Billing>;
  billingDocument: AngularFirestoreDocument<Billing>;
  billings: Observable<Billing[]>;
  billing: Observable<Billing>;
  constructor(private afs: AngularFirestore) {
    this.billingCollection = this.afs.collection("billings");
  }

  getBillings(): Observable<Billing[]> {
    var billingsRef = this.afs.collection<Billing>("billings");

    return (this.billings = billingsRef.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Billing;
          data.id = a.payload.doc.id;
          return data;
        })
      )
    ));
  }
  getLatestBilling() {
    var billingsRef = this.afs.collection<Billing>("billings", ref =>
      ref.orderBy("creationDate", "desc").limit(1)
    );
    return billingsRef.valueChanges().pipe(
      map(data => {
        return data[0];
      })
    );
  }

  getBillingById(id: string): Observable<Billing> {
    var billingDocument: AngularFirestoreDocument<Billing>;
    billingDocument = this.afs.doc(`billings/${id}`);
    return billingDocument.valueChanges();
  }

  setBilling(billing: Billing) {
    if (!billing.id) {
      billing.id = this.afs.createId();
    }
    billing.creationDate = new Date();

    return this.billingCollection.doc(billing.id).set(billing, { merge: true });
  }
  updateBilling(billing: Billing) {
    billing.modifictaionDate = new Date();
    var billingDocument: AngularFirestoreDocument<Billing>;
    billingDocument = this.afs.doc(`billings/${billing.id}`);
    return billingDocument.update(billing);
  }
  deleteBilling(billing: Billing) {
    this.billingDocument = this.afs.doc(`billings/${billing.id}`);
    //console.log("doctor document", this.doctor);
    return this.billingDocument.delete();
  }
}
