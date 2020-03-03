import { Appointment } from "./../models/appointment.model";
import { Injectable } from "@angular/core";
import {
  AngularFirestoreCollection,
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AppointmentService {
  appointmentCollection: AngularFirestoreCollection<Appointment>;

  constructor(private afs: AngularFirestore) {
    this.appointmentCollection = this.afs.collection("appointments");
  }

  getAppointments(): Observable<Appointment[]> {
    var appointmentRef = this.afs.collection<Appointment>("appointments", ref =>
      ref.orderBy("dateSlot", "desc")
    );

    return appointmentRef.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Appointment;
          data.id = a.payload.doc.id;
          //  console.log("getOrders->docId", data.id);
          return data;
        })
      )
    );
  }

  getAppointmentById(id: string): Observable<Appointment> {
    var appointmentDocument: AngularFirestoreDocument<Appointment>;
    appointmentDocument = this.afs.doc(`appointments/${id}`);
    console.log(".getAppointmentById()...", appointmentDocument);
    return appointmentDocument.valueChanges();
  }

  // getAppointmentByInvoiceNo(invoiceNumber: string): Observable<Appointment[]> {
  //   var appointmentDocument: AngularFirestoreDocument<Appointment>;
  //   //console.log("abc", invoiceNumber);
  //   var appointmentRef = this.afs.collection<Appointment>("appointments", ref =>
  //     ref
  //       .where("invoiceNumber", "==", invoiceNumber)
  //       .orderBy("appointmentSlot", "asc")
  //   );

  //   return appointmentRef.snapshotChanges().pipe(
  //     map(actions =>
  //       actions.map(a => {
  //         const data = a.payload.doc.data() as Appointment;
  //         data.id = a.payload.doc.id;
  //         // console.log("getOrderByInvoiceNo->docId", data.id);
  //         // console.log("abc", data);
  //         return data;
  //       })
  //     )
  //   );
  // }

  getAppointmentByDate(appointmentSlot: Date): Observable<Appointment[]> {
    // var appointmentDocument: AngularFirestoreDocument<Appointment>;

    var appointmentRef = this.afs.collection<Appointment>("appointments", ref =>
      ref.where("dateSlot", "==", appointmentSlot)
    );
    return appointmentRef.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Appointment;
          data.id = a.payload.doc.id;
          return data;
        })
      )
    );
  }

  updateAppointment(appointment: Appointment) {
    appointment.modificationDate = new Date();
    var appointmentDocument: AngularFirestoreDocument<Appointment>;
    appointmentDocument = this.afs.doc(`appointments/${appointment.id}`);
    return appointmentDocument.update(appointment);
  }

  // deleteOrder(order: Order) {
  //   var orderDocument: AngularFirestoreDocument<Order>;
  //   orderDocument = this.afs.doc(`orders/${order.id}`);
  //   return orderDocument.delete();
  // }
}
