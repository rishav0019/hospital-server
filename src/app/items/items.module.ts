import { SharedModule } from "./../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ItemsRoutingModule } from "./items-routing.module";
// import { ItemAddComponent } from "./item-add/item-add.component";
import { ItemDetailsComponent } from "./item-details/item-details.component";

@NgModule({
  declarations: [ItemDetailsComponent],
  imports: [CommonModule, ItemsRoutingModule, SharedModule]
})
export class ItemsModule {}
