import { ItemDetailsComponent } from "./item-details/item-details.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// import { ItemAddComponent } from "./item-add/item-add.component";

const routes: Routes = [
  {
    path: "itemdetails",
    component: ItemDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule {}
