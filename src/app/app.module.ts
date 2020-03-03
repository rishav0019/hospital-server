import { AppointmentModule } from "./appointment/appointment.module";
import { SaleModule } from "./sale/sale.module";
import { SettingsModule } from "./settings/settings.module";
import { ItemsModule } from "./items/items.module";
import { DoctorsModule } from "./doctors/doctors.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { SharedModule } from "./shared/shared.module";

import { PatientsModule } from "./patients/patients.module";
import { SidenavComponent } from "./shared/components/sidenav/sidenav.component";
import { UsersModule } from "./users/users.module";
import { environment } from "src/environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";

const ProjectModules = [SharedModule];

const DependencyModules = [
  BrowserModule,
  AppRoutingModule,
  UsersModule,
  SaleModule,
  AppointmentModule,
  SettingsModule,
  DoctorsModule,
  ItemsModule,
  PatientsModule,
  BrowserAnimationsModule,
  AngularFireStorageModule,
  AngularFireModule.initializeApp(environment.firebase),
  AngularFirestoreModule.enablePersistence()
];
@NgModule({
  declarations: [AppComponent, SidenavComponent],
  imports: [DependencyModules, ProjectModules],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
