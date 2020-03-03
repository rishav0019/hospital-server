import { Item } from "./../models/item.model";
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
export class ItemService {
  private itemCollection: AngularFirestoreCollection<Item>;
  itemDocument: AngularFirestoreDocument<Item>;
  items: Observable<Item[]>;
  item: Observable<Item>;

  constructor(private afs: AngularFirestore) {
    this.itemCollection = this.afs.collection("items");
  }

  getItem(): Observable<Item[]> {
    var catogeryRef = this.afs.collection<Item>("items");

    return (this.items = catogeryRef.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Item;
          data.id = a.payload.doc.id;
          return data;
        })
      )
    ));
  }
  getItemById(id: string): Observable<Item> {
    var itemDocument: AngularFirestoreDocument<Item>;
    itemDocument = this.afs.doc(`items/${id}`);
    return itemDocument.valueChanges();
  }
  setItem(item: Item) {
    console.log("...;.;;...;.;.;.", item);
    if (!item.id) {
      item.id = this.afs.createId();
    }
    item.creationDate = new Date();

    return this.itemCollection.doc(item.id).set(item, { merge: true });
  }
  updateItem(item: Item) {
    item.modifictaionDate = new Date();
    var itemDocument: AngularFirestoreDocument<Item>;
    itemDocument = this.afs.doc(`items/${item.id}`);
    return itemDocument.update(item);
  }
  deleteItem(item: Item) {
    this.itemDocument = this.afs.doc(`items/${item.id}`);
    //console.log("item document", this.item);
    return this.itemDocument.delete();
  }
}
