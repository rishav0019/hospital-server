import { SharedModule } from "./../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PatientsRoutingModule } from "./patients-routing.module";
import { PatientAddComponent } from "./patient-add/patient-add.component";
import { PatientDetailsComponent } from "./patient-details/patient-details.component";

@NgModule({
  declarations: [PatientAddComponent, PatientDetailsComponent],
  imports: [CommonModule, PatientsRoutingModule, SharedModule]
})
export class PatientsModule {}
