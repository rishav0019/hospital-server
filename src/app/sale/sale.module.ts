import { SharedModule } from "./../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SaleRoutingModule } from "./sale-routing.module";
import { SaleAddComponent } from "./sale-add/sale-add.component";
import { SaleHistoryComponent } from "./sale-history/sale-history.component";
import { SalePrintComponent } from './sale-print/sale-print.component';
import { SaleHistoryItemComponent } from './sale-history-item/sale-history-item.component';

@NgModule({
  declarations: [SaleAddComponent, SaleHistoryComponent, SalePrintComponent, SaleHistoryItemComponent],
  imports: [CommonModule, SaleRoutingModule, SharedModule]
})
export class SaleModule {}
