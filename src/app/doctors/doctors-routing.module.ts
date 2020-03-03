import { DoctorAddComponent } from "./doctor-add/doctor-add.component";
import { DoctorDetailsComponent } from "./doctor-details/doctor-details.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "doctors",
    component: DoctorDetailsComponent
  },
  {
    path: "doctor/:id",
    component: DoctorAddComponent
  },
  {
    path: "doctor/new",
    component: DoctorAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorsRoutingModule {}
