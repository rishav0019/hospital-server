import { SaleHistoryComponent } from "./sale-history/sale-history.component";

import { SaleAddComponent } from "./sale-add/sale-add.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SalePrintComponent } from "./sale-print/sale-print.component";

const routes: Routes = [
  {
    path: "sales",
    component: SaleAddComponent
  },
  {
    path: "sales/:id",
    component: SaleAddComponent
  },
  {
    path: "addSale",
    component: SaleAddComponent
  },
  {
    path: "printSale/:id",
    component: SalePrintComponent
  },
  {
    path: "billings",
    component: SaleHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRoutingModule {}
