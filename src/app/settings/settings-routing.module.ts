import { DoctorCategoryComponent } from "./doctor-category/doctor-category.component";
import { SettingDetailsComponent } from "./setting-details/setting-details.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HospitalDetailsComponent } from "./hospital-details/hospital-details.component";

const routes: Routes = [
  {
    path: "settings",
    component: SettingDetailsComponent
  },
  {
    path: "settings/hospitalDetails",
    component: HospitalDetailsComponent
  },
  {
    path: "settings/doctorcategory",
    component: DoctorCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
