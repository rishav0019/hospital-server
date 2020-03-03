import { SharedModule } from "./../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AppointmentRoutingModule } from "./appointment-routing.module";
import { AppointmentDetailsComponent } from "./appointment-details/appointment-details.component";
import { AppointmentAddComponent } from "./appointment-add/appointment-add.component";

@NgModule({
  declarations: [AppointmentDetailsComponent, AppointmentAddComponent],
  imports: [CommonModule, AppointmentRoutingModule, SharedModule]
})
export class AppointmentModule {}
