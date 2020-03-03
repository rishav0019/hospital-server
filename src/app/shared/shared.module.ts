import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { AppbarComponent } from "./components/appbar/appbar.component";
import { DeleteDialogComponent } from "./components/delete-dialog/delete-dialog.component";
import { SaveDialogComponent } from "./components/save-dialog/save-dialog.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";

import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatExpansionModule } from "@angular/material/expansion";

import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { ImageUploadComponent } from "./image-upload/image-upload.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

const MaterialModules = [
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  ReactiveFormsModule,
  MatAutocompleteModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRippleModule,
  MatSelectModule,
  MatRadioModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  FormsModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatCardModule,

  MatSidenavModule,
  MatButtonModule,

  MatListModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatDialogModule,

  MatTableModule,
  NgMultiSelectDropDownModule
];

const SharedComponents = [
  AppbarComponent,
  DeleteDialogComponent,
  SaveDialogComponent
];

const DependencyModules = [];

@NgModule({
  declarations: [SharedComponents, ImageUploadComponent],
  imports: [CommonModule, MaterialModules, DependencyModules],
  exports: [
    MaterialModules,
    SharedComponents,
    DependencyModules,
    ImageUploadComponent
  ],
  entryComponents: [SaveDialogComponent, DeleteDialogComponent]
})
export class SharedModule {}
