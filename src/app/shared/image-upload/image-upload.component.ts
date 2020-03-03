import { Image } from "./../models/image.model";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Observable } from "rxjs";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-image-upload",
  templateUrl: "./image-upload.component.html",
  styleUrls: ["./image-upload.component.scss"]
})
export class ImageUploadComponent {
  uploadPercent: number = 0;
  downloadURL: Observable<any>;

  @Output() imageEmitter = new EventEmitter<Image>();

  constructor(private storage: AngularFireStorage) {}

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = "items/" + file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.percentageChanges().subscribe(response => {
      this.uploadPercent = response;
    });

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          fileRef.getDownloadURL().subscribe(response => {
            let image: Image = {
              url: response,
              name: file.name
            };
            console.log("uploadFile->image", image);
            this.imageEmitter.emit(image);
          });
        })
      )
      .subscribe();
  }
}
