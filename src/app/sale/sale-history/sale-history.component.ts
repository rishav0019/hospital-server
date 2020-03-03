import { element } from "protractor";
import { Billing } from "./../../shared/models/billing.model";
import { Component, OnInit, ViewChild } from "@angular/core";

import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BillingService } from "src/app/shared/services/billing.service";
import { Router } from "@angular/router";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";

@Component({
  selector: "app-sale-history",
  templateUrl: "./sale-history.component.html",
  styleUrls: ["./sale-history.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class SaleHistoryComponent implements OnInit {
  billingDetails: Billing[] = [];
  tempbillingDetails: Billing[] = [];
  tempdatalength: number;
  dataSource: MatTableDataSource<Billing>;
  dataLength = -1;
  isLoading = false;
  size: number;
  start: number;

  displayedColumns: string[] = [
    "invoice_id",
    "billing_date",
    "customer_name",
    "doctor_name",
    "netAmount",
    "actions"
  ];
  listColm = ["SL.No", "deliveryDate", "action"];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  todaySaleAmount = 0;
  cardSaleAmount = 0;
  cashSaleAmount = 0;

  constructor(private billingService: BillingService, private router: Router) {}

  ngOnInit() {
    this.getAllBillings();
  }

  applyFilter(filterValue: string) {
    /* this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }*/
    if (filterValue != "") {
      this.tempbillingDetails = this.billingDetails.filter(data => {
        if (!data.customer_name) {
          data.customer_name = "Unknown Customer";
        }
        if (
          data.invoice_no.toLowerCase().includes(filterValue.toLowerCase()) ||
          data.customer_name.toLowerCase().includes(filterValue.toLowerCase())
        ) {
          return data;
        }
      });
    } else {
      this.tempbillingDetails = this.billingDetails;
    }

    this.tempdatalength = this.tempbillingDetails.length;
  }
  pageEventAlter(e: any) {
    this.start = e.pageSize * e.pageIndex;
    this.size = e.pageSize * (e.pageIndex + 1);
  }

  getAllBillings() {
    this.isLoading = true;
    this.billingService.getBillings().subscribe(response => {
      console.log("mmmmmmmmmmm", response);
      this.billingDetails = response;
      this.dataSource = new MatTableDataSource<Billing>(this.billingDetails);
      this.tempbillingDetails = this.billingDetails;
      this.dataLength = this.billingDetails.length;
      this.tempdatalength = this.dataLength;
      this.size = 5;
      this.start = 0;
      // console.log("datasource", this.dataSource);
      // this.calculateSaleBreakdown(this.billingDetails);
      this.isLoading = false;
    });
  }

  printInvoice(bill_id) {
    console.log("bill", bill_id);
    this.router.navigateByUrl("/printSale/" + bill_id);
  }
  deleteInvoice(bill_id) {
    this.billingService.deleteBilling(bill_id);
  }
  editInvoice(bill_id) {
    this.router.navigateByUrl("/sales/" + bill_id);
  }
  calculateSaleBreakdown(billings: Billing[]) {
    const todaysDate = new Date();

    const todayBillings = billings.filter(billing => {
      const invoiceDate = new Date(billing.billing_date);
      return (
        invoiceDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)
      );
    });

    this.todaySaleAmount = 0;
    this.cardSaleAmount = 0;
    this.cashSaleAmount = 0;

    todayBillings.forEach(billing => {
      this.todaySaleAmount += billing.netAmount;
      if (billing.paymentMode.toString() == "CASH") {
        this.cashSaleAmount += billing.netAmount;
      } else if (billing.paymentMode.toString() == "CARD") {
        this.cardSaleAmount += billing.netAmount;
      }
    });
  }
}
