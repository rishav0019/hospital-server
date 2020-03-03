import { PatientDetailsComponent } from "./patient-details/patient-details.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PatientAddComponent } from "./patient-add/patient-add.component";

const routes: Routes = [
  {
    path: "patients",
    component: PatientDetailsComponent
  },
  {
    path: "patient/new",
    component: PatientAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule {}
