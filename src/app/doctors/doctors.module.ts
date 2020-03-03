import { SharedModule } from "./../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DoctorsRoutingModule } from "./doctors-routing.module";
import { DoctorAddComponent } from "./doctor-add/doctor-add.component";
import { DoctorDetailsComponent } from "./doctor-details/doctor-details.component";

@NgModule({
  declarations: [DoctorAddComponent, DoctorDetailsComponent],
  imports: [CommonModule, DoctorsRoutingModule, SharedModule]
})
export class DoctorsModule {}
