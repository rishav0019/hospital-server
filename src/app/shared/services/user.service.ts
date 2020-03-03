import { User } from "./../models/user.model";
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
export class UserService {
  private userCollection: AngularFirestoreCollection<User>;
  userDocument: AngularFirestoreDocument<User>;
  users: Observable<User[]>;
  user: Observable<User>;

  constructor(private afs: AngularFirestore) {
    this.userCollection = this.afs.collection("users");
  }

  getUsers(): Observable<User[]> {
    var catogeryRef = this.afs.collection<User>("users");

    return (this.users = catogeryRef.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as User;
          data.id = a.payload.doc.id;
          return data;
        })
      )
    ));
  }
  getUserById(id: string): Observable<User> {
    var userDocument: AngularFirestoreDocument<User>;
    userDocument = this.afs.doc(`users/${id}`);
    return userDocument.valueChanges();
  }
}
