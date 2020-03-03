import { Hospital } from "./../../shared/models/hospital.model";
import { Component, OnInit } from "@angular/core";

import { Subscription } from "rxjs";

import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";

import {
  Validators,
  FormControl,
  FormBuilder,
  FormGroup
} from "@angular/forms";
import { HospitalService } from "src/app/shared/services/hospital.service";
import { SaveDialogComponent } from "src/app/shared/components/save-dialog/save-dialog.component";

@Component({
  selector: "app-hospital-details",
  templateUrl: "./hospital-details.component.html",
  styleUrls: ["./hospital-details.component.scss"]
})
export class HospitalDetailsComponent implements OnInit {
  private _subscription: Subscription = new Subscription();
  hospital: Hospital;
  hospitals: string;
  hospitalId: string;

  subscriptionInputForm = this.fb.group({
    hospitalName: ["", Validators.required],
    address: [""],
    phoneNumber: [""],
    city: [""]
  });

  constructor(
    private hospitalService: HospitalService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getHospitalDetails();
  }

  getHospitalDetails() {
    this._subscription.add(
      this.hospitalService.getHospital().subscribe(response => {
        this.hospital = response[0];
        console.log("...............", response);
        this.hospitalId = this.hospital.id;
        this.populateSettings();
      })
    );
  }

  populateSettings() {
    if (this.hospital) {
      this.subscriptionInputForm.patchValue({
        hospitalName: this.hospital.hospitalName,
        address: this.hospital.address,
        phoneNumber: this.hospital.phoneNumber,
        city: this.hospital.city
      });
    }
  }

  getHospitalObj() {
    var hospital: Hospital = {
      hospitalName: this.subscriptionInputForm.get("hospitalName").value,
      phoneNumber: this.subscriptionInputForm.get("phoneNumber").value,
      address: this.subscriptionInputForm.get("address").value,
      city: this.subscriptionInputForm.get("city").value
    };
    return Object.assign({}, hospital);
  }

  saveSettings() {
    const dialogRef = this.dialog.open(SaveDialogComponent, {
      width: "250px",
      data: "Save Settings?"
    });

    var hospital = this.getHospitalObj();

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //console.log("ggggggggggg", hospital);
        if (this.hospitalId) {
          hospital.id = this.hospitalId;
          this.hospitalService.updateHospital(hospital);
        } else {
          let accountPromise = this.hospitalService.addHospital(hospital);
          if (accountPromise instanceof Promise) {
            const message = "Settings Saved";
            this.snackBar.open(message, " ", { duration: 2000 });
            this.closeClicked();
          }
        }
      }
    });
  }

  closeClicked() {
    this.location.back();
  }
}
