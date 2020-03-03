import { SharedModule } from "./../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SettingsRoutingModule } from "./settings-routing.module";
import { DoctorCategoryComponent } from "./doctor-category/doctor-category.component";
import { SettingDetailsComponent } from "./setting-details/setting-details.component";
import { HospitalDetailsComponent } from './hospital-details/hospital-details.component';

@NgModule({
  declarations: [DoctorCategoryComponent, SettingDetailsComponent, HospitalDetailsComponent],
  imports: [CommonModule, SettingsRoutingModule, SharedModule]
})
export class SettingsModule {}
