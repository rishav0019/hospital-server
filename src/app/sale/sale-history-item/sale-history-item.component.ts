import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { InvoiceProduct } from "src/app/shared/models/item.model";
import { Billing } from "src/app/shared/models/billing.model";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { BillingService } from "src/app/shared/services/billing.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sale-history-item",
  templateUrl: "./sale-history-item.component.html",
  styleUrls: ["./sale-history-item.component.scss"]
})
export class SaleHistoryItemComponent implements OnInit {
  displayedColumns: string[] = ["name", "batch", "total", "returnDate"];

  billing: Billing;
  invoiceProducts: InvoiceProduct[];
  status = "No Returns";
  returnsDataSource = new MatTableDataSource();

  @Input() item: Billing;
  @Output() invoice: EventEmitter<string> = new EventEmitter();
  constructor(
    public dialog: MatDialog,
    // private invoiceProductService: BillingService,
    private billingService: BillingService,
    public router: Router
  ) {}

  ngOnInit() {
    console.log("billing id is ", this.item.id);
    this.getInvoice(this.item.id);
  }
  showInvoice() {
    console.log("ididididididid", this.item.id);
    this.router.navigate(["/printSale/", this.item.id]);
    this.invoice.emit(this.item.id);
  }

  // openSaleReturnDialog() {
  //   const dialogRef = this.dialog.open(SaleReturnModalComponent, {
  //     width: "40vw",
  //     height: "auto",
  //     data: { billing_id: this.item.billing_id }
  //   });

  //   dialogRef.afterClosed().subscribe(response => {
  //     this.getInvoice(this.item.billing_id);
  //   });
  // }

  getInvoice(id) {
    console.log("/..........................");
    this.billingService.getBillingById(id).subscribe(response => {
      if (response) {
        // this.billing = response;
        // this.invoiceProductService
        // this.invoiceProducts = this.billing.invoiceProducts;
        // console.log("billingdetails", this.invoiceProducts);
        // console.log("getInvoice->products", products);
        // this.invoiceProducts = products;
        // let noOfReturns = 0;
        // noOfReturns = this.invoiceProducts.filter(
        //   product => product.isReturned == true
        // ).length;
        // const returnedProducts = products.filter(
        //   product => product.isReturned
        // );
        // this.returnsDataSource = new MatTableDataSource<InvoiceProduct>(
        //   returnedProducts
        // );
        // }
        //  });
      }
    });
  }
}
