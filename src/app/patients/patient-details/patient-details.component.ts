import { PatientService } from "./../../shared/services/patient.service";
import { Patient } from "./../../shared/models/patient.model";
import { PatientAddComponent } from "./../patient-add/patient-add.component";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-patient-details",
  templateUrl: "./patient-details.component.html",
  styleUrls: ["./patient-details.component.scss"]
})
export class PatientDetailsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  totalPatients: number;
  isLoading = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.fetchPatients();
  }
  addNewPatient() {
    this.router.navigate(["patient/new"]);
  }
  fetchPatients() {
    this.isLoading = true;
    this.patientService.getPatients().subscribe(response => {
      this.patients = response;
      this.isLoading = false;
      this.filteredPatients = response;
      this.totalPatients = this.patients.length;
    });
  }
  openPatientAddDialog(id) {
    const dialogRef = this.dialog.open(PatientAddComponent, {
      width: "500px",
      maxWidth: "100vw",
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(response => {
      this.fetchPatients();
    });
  }
  editDoc(id) {
    this.openPatientAddDialog(id);
  }
  applyFilter(filterValue: string) {
    console.log(filterValue);
    this.filteredPatients = this.patients.filter(doctor => {
      if (!filterValue) {
        return true;
      } else if (
        doctor.name
          .trim()
          .toLowerCase()
          .includes(filterValue.trim().toLowerCase())
      ) {
        return true;
      } else if (
        doctor.email
          .trim()
          .toLowerCase()
          .includes(filterValue.trim().toLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    });
  }
}
