import { Hospital } from "./../../shared/models/hospital.model";
import { HospitalService } from "./../../shared/services/hospital.service";
import { Patient } from "src/app/shared/models/patient.model";
import { PatientService } from "./../../shared/services/patient.service";
import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { Location } from "@angular/common";
import { BillingService } from "src/app/shared/services/billing.service";
import { DoctorService } from "src/app/shared/services/doctor.service";
import { InvoiceProduct } from "src/app/shared/models/item.model";
import { MatTableDataSource } from "@angular/material/table";
import { Billing } from "src/app/shared/models/billing.model";
import { Doctor } from "src/app/shared/models/doctor.model";
@Component({
  selector: "app-sale-print",
  templateUrl: "./sale-print.component.html",
  styleUrls: ["./sale-print.component.scss"]
})
export class SalePrintComponent implements OnInit {
  hospital: Hospital;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private billingService: BillingService,
    private customerService: PatientService,
    private doctorService: DoctorService,
    private hospitalService: HospitalService // private invoiceProductService: InvoiceProductService
  ) {}

  displayedColumns: string[] = [
    "product_name",
    "selling_rate",
    "qty",
    "total_amount"
  ];

  dataSource: MatTableDataSource<InvoiceProduct>;
  invoiceId: string;
  dataLength = 0;

  billing: Billing;
  customer: Patient;
  doctor: Doctor;
  pharmachist: string;
  // branch: Branch;
  invoiceProducts: InvoiceProduct[];
  isPrinting = false;

  @ViewChild("screen") screen: ElementRef;

  ngOnInit() {
    this.getHospitalDetails();

    this.route.paramMap.subscribe(params => {
      this.invoiceId = params.get("id");
      console.log("id....", this.invoiceId);
      if (this.invoiceId) {
        this.getInvoice(this.invoiceId);
      }
    });
  }

  getHospitalDetails() {
    this.hospitalService.getHospital().subscribe(response => {
      this.hospital = response[0];
      console.log("Hospital Details", this.hospital);
    });
  }

  getInvoice(id) {
    this.billingService.getBillingById(id).subscribe(response => {
      console.log("..........getInvoice()...........", response);
      if (response) {
        this.billing = response;
        this.invoiceProducts = response.invoiceProducts;
        console.log(".............", this.invoiceProducts);

        this.dataSource = new MatTableDataSource<InvoiceProduct>(
          this.invoiceProducts
        );
        this.dataLength = this.invoiceProducts.length;
      }
    });
  }

  convertToWidth(unit, width) {
    if (unit == "mm") {
      return width;
    } else if (unit == "in") {
      return width * 25.4;
    }
    return;
  }
  printInvoice() {
    this.isPrinting = true;
    let pdf;

    const orientation = "portrait";
    const unit = "mm";
    const paperSize = "a4";
    // var isCustomPaperSize = this.printConfig.isCustomPaperSize;

    // if (isCustomPaperSize) {
    //   pdf = new jsPDF({
    //     orientation: orientation,
    //     unit: unit,
    //     format: [this.printConfig.paperLength, this.printConfig.paperWidth]
    //   });
    // } else {
    //   pdf = new jsPDF(orientation, unit, paperSize);
    // }

    pdf = new jsPDF(orientation, unit, paperSize);

    console.log("printInvoice");
    pdf.setProperties({
      title: "Pdf Export",
      author: "Kanchan Medico",
      keywords: "generated,drug-mart,kanchan,receipt",
      creator: "Kanchan Medico"
    });

    let imgWidth;

    // if (isCustomPaperSize) {
    //   imgWidth = this.convertToWidth(unit, this.printConfig.paperWidth);
    // } else {
    //   if (paperSize == 'a4') {
    //     imgWidth = 297;
    //   } else if (paperSize == 'a5') {
    //     imgWidth = 210;
    //   }
    // }

    if (paperSize == "a4") {
      imgWidth = 210;
    } else if (paperSize == "a5") {
      imgWidth = 210;
    }

    html2canvas(this.screen.nativeElement).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage({
        imageData: imgData,
        x: 0,
        y: 20,
        w: imgWidth,
        h: imgHeight
      });

      pdf.autoPrint();
      this.isPrinting = false;
      window.open(pdf.output("bloburl"), "_blank");
    });
  }

  goBack() {
    this.location.back();
  }
}
