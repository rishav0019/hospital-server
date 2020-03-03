import { Doctor } from "./../../shared/models/doctor.model";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { DoctorAddComponent } from "../doctor-add/doctor-add.component";
import { DoctorService } from "src/app/shared/services/doctor.service";

@Component({
  selector: "app-doctor-details",
  templateUrl: "./doctor-details.component.html",
  styleUrls: ["./doctor-details.component.scss"]
})
export class DoctorDetailsComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  totalDoctors: number;
  isLoading = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private doctorService: DoctorService
  ) {}

  ngOnInit() {
    this.fetchDoctors();
  }
  addNewDoctor() {
    this.router.navigate(["patient/new"]);
  }
  fetchDoctors() {
    this.isLoading = true;
    this.doctorService.getDoctor().subscribe(response => {
      console.log(".......", response);
      this.doctors = response;
      this.isLoading = false;
      this.filteredDoctors = response;
      this.totalDoctors = this.doctors.length;
    });
  }
  openDoctorAddDialog(id) {
    this.editDoc("new");
    // const dialogRef = this.dialog.open(DoctorAddComponent, {
    //   width: "500px",
    //   maxWidth: "100vw",
    //   data: { id: id }
    // });

    // dialogRef.afterClosed().subscribe(response => {
    //   // this.fetchDoctors();
    // });
  }
  editDoc(id) {
    this.router.navigate(["doctor/", id]);
  }

  applyFilter(filterValue: string) {
    // console.log(filterValue);
    this.filteredDoctors = this.doctors.filter(doctor => {
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
