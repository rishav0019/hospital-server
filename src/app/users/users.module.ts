import { SharedModule } from "./../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UsersRoutingModule } from "./users-routing.module";
import { UserAddComponent } from "./user-add/user-add.component";
import { UserDetailsComponent } from "./user-details/user-details.component";

@NgModule({
  declarations: [UserAddComponent, UserDetailsComponent],
  imports: [CommonModule, UsersRoutingModule, SharedModule],
  entryComponents: [UserAddComponent]
})
export class UsersModule {}
