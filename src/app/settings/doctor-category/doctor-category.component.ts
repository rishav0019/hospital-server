import { SpecialityService } from "../../shared/services/speciality.service";

import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Speciality } from "src/app/shared/models/speciality.model";
import { Validators, FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Location } from "@angular/common";
@Component({
  selector: "app-doctor-category",
  templateUrl: "./doctor-category.component.html",
  styleUrls: ["./doctor-category.component.scss"]
})
export class DoctorCategoryComponent implements OnInit {
  private subscription: Subscription = new Subscription();

  specialities: Speciality[] = [];
  speciality: Speciality = new Speciality();

  displayedColumns: string[] = ["category", "actions"];
  doctorCategoryInputForm = this.fb.group({
    categoryName: ["", Validators.required]
  });

  constructor(
    private location: Location,
    private snackBar: MatSnackBar,
    private specializationService: SpecialityService,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.getDoctor();
  }
  getDoctor() {
    this.specializationService.getSpeciality().subscribe(response => {
      this.specialities = response;
      console.log("getDoctor()=>", this.specialities);
    });
  }

  saveCategory() {
    this.specializationService.addSpeciality(this.getCategoryObj());
    this.doctorCategoryInputForm.reset();
  }
  deleteCategory(category: Speciality) {
    console.log("deleteCategory........->", category);
    this.specializationService.deleteSpeciality(category).then(() => {
      this.snackBar.open("Categoryty Deleted", " ", { duration: 2000 });
    });
  }
  getCategoryObj() {
    this.speciality.name = this.doctorCategoryInputForm.get(
      "categoryName"
    ).value;
    console.log(this.speciality.name);
    const category = Object.assign({}, this.speciality);
    return category;
  }
  closeClicked() {
    this.location.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
