import { PatientService } from "./../../shared/services/patient.service";
import { Patient } from "./../../shared/models/patient.model";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-patient-add",
  templateUrl: "./patient-add.component.html",
  styleUrls: ["./patient-add.component.scss"]
})
export class PatientAddComponent implements OnInit {
  patient: Patient;

  patientAddForm: FormGroup;
  patientId: string;

  isSaving = false;
  constructor(
    public dialogRef: MatDialogRef<PatientAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private patientService: PatientService,
    private snackBar: MatSnackBar
  ) {
    this.patientId = data.id;
  }

  ngOnInit() {
    if (this.patientId) {
      this.patientService.getPatientById(this.patientId).subscribe(response => {
        this.patient = response;
        console.log(this.patient);
        this.populatePatientModal();
      });
    }

    this.patientAddForm = this.fb.group({
      name: ["", Validators.required],
      mobileNumber: ["", Validators.required],
      address: new FormControl(""),
      city: new FormControl(""),
      email: new FormControl(""),
      state: new FormControl(""),
      age: [""],
      commission: new FormControl(""),
      specialization: new FormControl(""),

      gender: new FormControl("")
    });
  }

  getPatientDetails() {
    const patient: Patient = {
      name: this.patientAddForm.get("name").value,
      email: this.patientAddForm.get("email").value,
      mobileNumber: this.patientAddForm.get("mobileNumber").value,
      address: this.patientAddForm.get("address").value,
      age: this.patientAddForm.get("age").value,
      city: this.patientAddForm.get("city").value,
      gender: this.patientAddForm.get("gender").value,
      state: this.patientAddForm.get("state").value
    };

    return patient;
  }

  savePatient() {
    const patient = this.getPatientDetails();

    if (patient.name && patient.mobileNumber) {
      this.isSaving = true;

      if (!this.patientId) {
        this.patientService.setPatient(patient).then(() => {
          this.isSaving = false;
          const message = "New Patient Added!";
          this.snackBar.open(message, " ", { duration: 2000 });
          this.dialogRef.close();
        });
      } else {
        console.log(patient);
        patient.id = this.patientId;
        this.patientService.updatePatient(patient).then(() => {
          this.isSaving = false;
          const message = "Patient Updated!";
          this.snackBar.open(message, " ", { duration: 2000 });
          this.dialogRef.close();
        });
      }
    } else if (!patient.mobileNumber) {
      this.patientAddForm.get("mobileNumber").markAllAsTouched();
    } else if (!patient.name) {
      this.patientAddForm.get("name").markAllAsTouched();
    }
  }

  populatePatientModal() {
    this.patientAddForm.patchValue({
      name: this.patient.name,
      mobileNumber: this.patient.mobileNumber,
      address: this.patient.address,
      city: this.patient.city,
      email: this.patient.email,
      state: this.patient.state,
      age: this.patient.age,
      gender: this.patient.gender
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
