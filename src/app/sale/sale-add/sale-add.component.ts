import { BillingService } from "./../../shared/services/billing.service";
import { DoctorAddComponent } from "./../../doctors/doctor-add/doctor-add.component";
import { PatientAddComponent } from "./../../patients/patient-add/patient-add.component";
import { PatientService } from "./../../shared/services/patient.service";
import { Item, InvoiceProduct } from "./../../shared/models/item.model";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { Doctor } from "src/app/shared/models/doctor.model";
import { Observable } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { DoctorService } from "src/app/shared/services/doctor.service";
import { ItemService } from "src/app/shared/services/item.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Patient } from "src/app/shared/models/patient.model";
import { MatTableDataSource } from "@angular/material/table";
import { startWith, map } from "rxjs/operators";
import { Billing } from "src/app/shared/models/billing.model";

@Component({
  selector: "app-sale-add",
  templateUrl: "./sale-add.component.html",
  styleUrls: ["./sale-add.component.scss"]
})
export class SaleAddComponent implements OnInit {
  saleAddForm: FormGroup;
  invoice_no: string;
  patients: Patient[] = [];
  patientsByName: Patient[] = [];
  selectedPatient: Patient;
  patientAddress: string;
  filteredPatients: Observable<Patient[]>;
  filteredPatientsByName: Observable<Patient[]>;

  doctors: Doctor[] = [];
  doctorsByName: Doctor[] = [];
  selectedDoctor: Doctor;
  filteredDoctors: Observable<Doctor[]>;
  filteredDoctorsByName: Observable<Doctor[]>;
  invoiceProducts: InvoiceProduct[] = [];
  products: Item[] = [];
  selectedProduct: Item;
  filteredProducts: Observable<Item[]>;

  dataLength = 0;
  productAddLabel = "ADD";

  discountOptions = [
    { label: "%", value: "percent" },
    { label: "₹", value: "flat" }
  ];
  billing: Billing;
  // displayedColumns: string[] = ['product_name', 'qty', 'batch_no', 'discount', 'expiryDate', 'gst', 'selling_rate', 'action'];

  displayedColumns: string[] = [
    "product_name",
    "qty",
    "batch_no",
    "discount",
    "gst",
    "selling_rate",
    "action"
  ];

  dataSource: MatTableDataSource<Item>;

  totalAmount = 0;
  taxAmount = 0;
  discountAmount = 0;
  netAmount = 0;
  totalDiscount = 0;
  patientId: string;
  doctorId: string;
  retail_product_id: string;

  editedProductId: string;
  customerId: string;
  isSaving = false;
  isOnline = true;
  billingId: string;
  @ViewChild("prodQty", { static: true }) qtyField: Item;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private billingService: BillingService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private productService: ItemService,
    private route: ActivatedRoute,
    // private billingService: BillingService,
    private snackBar: MatSnackBar,
    // private invoiceProductService: InvoiceProductService,
    public router: Router
  ) {}

  ngOnInit() {
    this.fetchPatients();
    this.fetchPatientsByName();
    this.fetchDoctors();
    this.fetchDoctorsByName();
    this.fetchProducts();
    this.generateInvoice();

    this.saleAddForm = this.fb.group({
      custMobile: new FormControl(""),
      custName: new FormControl(""),
      docMobile: new FormControl(""),
      docName: new FormControl(""),
      prodName: new FormControl(""),
      prodQty: ["", Validators.required],
      prodDisc: new FormControl("", Validators.min(0)),
      prodExpiry: new FormControl({ value: "", disabled: true }),
      batch_no: new FormControl(""),
      prodGST: new FormControl({ value: "", disabled: true }),
      prodSellingPrice: new FormControl(
        { value: "", disabled: true },
        Validators.required
      ),
      saleDate: new FormControl(""),
      totalDisc: ["", Validators.maxLength(3)],
      // discType: ["percent"],
      discType: [""],
      amoutReceived: new FormControl(""),
      amoutReturn: new FormControl({ value: "", disabled: true }),
      paymentMode: ["CASH"],
      printCheck: [true],
      mailCheck: [false]
    });

    this.setInvoiceDate();

    if (!navigator.onLine) {
      this.isOnline = false;
    }
    this.route.paramMap.subscribe(params => {
      this.billingId = params.get("id");
      console.log("....", this.billingId);
    });
    if (this.billingId) {
      this.billingService.getBillingById(this.billingId).subscribe(res => {
        this.billing = res;
        this.populateSaleData();
      });
    }
  }
  populateSaleData() {
    if (this.billing) {
      this.saleAddForm.patchValue({
        custName: this.billing.customer_name,
        custMobile: this.billing.customer_mobile,
        docName: this.billing.doctor_name,
        docMobile: this.billing.doctor_mobile,
        saleDate: this.billing.billing_date,
        // totalDisc: this.billing.totalDiscount,
        paymentMode: this.billing.paymentMode,
        discType: this.billing.discountType,
        totalDisc: this.billing.discValue,
        billing_date: this.billing.billing_date,
        discValue: this.billing.discValue
      });

      this.totalDiscount = this.billing.totalDiscount;
      this.taxAmount = this.billing.taxAmount;
      this.netAmount = this.billing.netAmount;
      this.totalAmount = this.billing.totalAmount;
      this.invoiceProducts = this.billing.invoiceProducts;
      // this.billing.id=
    }
  }
  openPatientAddDialog() {
    const dialogRef = this.dialog.open(PatientAddComponent, {
      width: "500px",
      maxWidth: "100vw",
      data: { title: "Hello" }
    });

    dialogRef.afterClosed().subscribe(response => {
      this.patientId = response;
      this.fetchPatients();
      this.fetchPatientsByName();
    });
  }

  openDoctorAddDialog() {
    const dialogRef = this.dialog.open(DoctorAddComponent, {
      width: "500px",
      maxWidth: "100vw",
      data: { title: "Hello" }
    });

    dialogRef.afterClosed().subscribe(response => {
      this.doctorId = response;
      this.fetchDoctors();
    });
  }

  private _custFilter(value: string): Patient[] {
    if (typeof value == "string") {
      const filterValue = value.toLowerCase();
      return this.patients.filter(patient =>
        patient.mobileNumber.includes(filterValue)
      );
    } else {
      this.populatePatientName(value);
    }
  }

  private _custFilterByName(value: string): Patient[] {
    if (typeof value == "string") {
      const filterValue = value.toLowerCase();
      return this.patientsByName.filter(patient =>
        patient.name.toLowerCase().includes(filterValue)
      );
    } else {
      this.populatePatientName(value);
    }
  }

  private _docFilter(value: string): Doctor[] {
    if (typeof value == "string") {
      const filterValue = value.toLowerCase();
      return this.doctors.filter(doctor =>
        doctor.mobileNumber.includes(filterValue)
      );
    } else {
      this.populateDoctorName(value);
    }
  }

  private _docFilterByName(value: string): Doctor[] {
    if (typeof value == "string") {
      const filterValue = value.toLowerCase();
      return this.doctorsByName.filter(doctor => {
        return doctor.name.includes(filterValue);
      });
    } else {
      this.populateDoctorName(value);
    }
  }

  private _prodFilter(value: string): Item[] {
    if (typeof value == "string") {
      const filterValue = value.toLowerCase();
      return this.products.filter(product =>
        product.name.toLowerCase().includes(filterValue)
      );
    } else {
      this.populateProductDetails(value);
    }
  }

  fetchPatients() {
    this.patientService.getPatients().subscribe(response => {
      if (response) {
        this.patients = response;
        this.filteredPatients = this.saleAddForm
          .get("custMobile")
          .valueChanges.pipe(
            startWith(""),
            map(value => this._custFilter(value))
          );
      }
    });
  }

  fetchPatientsByName() {
    this.patientService.getPatients().subscribe(response => {
      if (response) {
        this.patientsByName = response;
        this.filteredPatientsByName = this.saleAddForm
          .get("custName")
          .valueChanges.pipe(
            startWith(""),
            map(value => this._custFilterByName(value))
          );
      }
    });
  }

  fetchDoctors() {
    this.doctorService.getDoctor().subscribe(response => {
      if (response) {
        this.doctors = response;
        this.filteredDoctors = this.saleAddForm
          .get("docMobile")
          .valueChanges.pipe(
            startWith(""),
            map(value => this._docFilter(value))
          );
      }
    });
  }

  fetchDoctorsByName() {
    this.doctorService.getDoctor().subscribe(response => {
      if (response) {
        this.doctorsByName = response;
        this.filteredDoctorsByName = this.saleAddForm
          .get("docName")
          .valueChanges.pipe(
            startWith(""),
            map(value => this._docFilterByName(value))
          );
      }
    });
  }

  fetchProducts() {
    this.productService.getItem().subscribe(response => {
      if (response) {
        this.products = response;

        this.filteredProducts = this.saleAddForm
          .get("prodName")
          .valueChanges.pipe(
            startWith(""),
            map(value => this._prodFilter(value))
          );
      }
    });
    // console.log("...........fetchProducts", this.filteredProducts);
  }

  populatePatientName(response: Patient) {
    this.selectedPatient = response;
    this.patientAddress = response.address;
    this.saleAddForm.patchValue({
      custName: this.selectedPatient.name,
      custMobile: this.selectedPatient.mobileNumber
    });

    this.patientId = response.id;
  }

  populateDoctorName(response: Doctor) {
    this.selectedDoctor = response;

    this.saleAddForm.patchValue({
      docName: this.selectedDoctor.name,
      docMobile: this.selectedDoctor.mobileNumber
    });

    this.doctorId = response.id;
  }

  populateProductDetails(response: Item) {
    this.selectedProduct = response;

    var expiryTimestamp: any = response.expiry_date;
    var x = expiryTimestamp.seconds * 1000;
    var date = new Date(x);

    var month = date.getUTCMonth() + 1; //months from 1-12
    var day = date.getUTCDate();
    var year = date.getUTCFullYear();

    var newdate = year + "/" + month;

    console.log("productId............", response);
    this.saleAddForm.patchValue({
      prodQty: 1,
      prodName: this.selectedProduct.name,
      batch_no: this.selectedProduct.batch_no,
      prodDisc: 0,
      prodExpiry: newdate,
      prodGST: this.selectedProduct.gst,
      prodSellingPrice: this.selectedProduct.selling_rate
      // prodDisc: this.selectedProduct.selling_discount
    });

    this.retail_product_id = response.id;
  }

  addInvoiceItems() {
    var invoiceProduct: InvoiceProduct = {
      product_name: this.saleAddForm.get("prodName").value,
      // lastStock: this.selectedProduct.stock
      qty: this.saleAddForm.get("prodQty").value,
      selling_rate: this.saleAddForm.get("prodSellingPrice").value,
      gst: this.saleAddForm.get("prodGST").value,
      batch_no: this.saleAddForm.get("batch_no").value,
      selling_discount: this.saleAddForm.get("prodDisc").value,
      expiryDate: this.saleAddForm.get("prodExpiry").value,
      retail_product_id: this.retail_product_id
    };

    if (this.editedProductId) {
      invoiceProduct.retail_product_id = this.editedProductId;
      // this.editedProductId = -1;
    }
    if (invoiceProduct.qty) {
      // console.log(invoiceProduct.batch_no);
      var duplicateIndex = this.invoiceProducts.findIndex(
        product =>
          product.retail_product_id == invoiceProduct.retail_product_id &&
          product.batch_no == invoiceProduct.batch_no
      );
      // console.log("Edit Item:", duplicateIndex);
      if (duplicateIndex >= 0) {
        this.invoiceProducts[duplicateIndex] = invoiceProduct;
      } else {
        this.invoiceProducts.push(invoiceProduct);
      }
      this.dataSource = new MatTableDataSource<InvoiceProduct>(
        this.invoiceProducts
      );
      this.dataLength = this.invoiceProducts.length;
      if (this.dataLength > 0) {
        this.productAddLabel = "ADD ANOTHER";
      }
      this.calculateTotalAmount();
      this.clearProductInputs();
      this.saleAddForm.get("prodQty").markAsUntouched();
      this.saleAddForm.get("prodQty").markAsPristine();
    } else {
      this.saleAddForm.get("prodQty").markAllAsTouched();
    }
  }

  calculateTotalAmount() {
    this.totalAmount = 0;
    this.taxAmount = 0;
    this.discountAmount = 0;
    this.totalDiscount = 0;
    this.netAmount = 0;

    this.invoiceProducts.forEach(invoiceProduct => {
      var itemAmount = invoiceProduct.selling_rate * invoiceProduct.qty;
      this.taxAmount += itemAmount * invoiceProduct.gst * 0.01;
      this.totalAmount += itemAmount - this.taxAmount;
      this.discountAmount +=
        this.totalAmount * invoiceProduct.selling_discount * 0.01;
    });

    this.totalDiscount = this.saleAddForm.get("totalDisc").value;
    const discType = this.saleAddForm.get("discType").value;

    this.netAmount = 0;

    this.netAmount = this.totalAmount + this.taxAmount - this.discountAmount;

    if (this.totalDiscount) {
      if (discType == "flat") {
        this.netAmount =
          this.totalAmount +
          this.taxAmount -
          this.discountAmount -
          this.totalDiscount;
      } else {
        this.totalDiscount = this.totalDiscount * 0.01 * this.netAmount;
        this.netAmount -= this.totalDiscount;
      }
    }
  }

  clearProductInputs() {
    this.saleAddForm.patchValue({
      prodName: "",
      prodQty: "",
      batch_no: "",
      prodExpiry: "",
      prodGST: "",
      prodSellingPrice: "",
      prodDisc: ""
    });
  }

  setInvoiceDate() {
    const currentDate = new Date().toISOString().substring(0, 10);

    this.saleAddForm.patchValue({
      saleDate: currentDate
    });
  }

  getAmountReceived(amount: number) {
    const returnAmt = (amount - this.netAmount).toFixed(2);

    this.saleAddForm.patchValue({
      amoutReturn: returnAmt
    });
  }

  getBillingDetails() {
    const billing: Billing = {
      totalAmount: this.totalAmount,
      discountAmount: this.discountAmount,
      taxAmount: this.taxAmount,
      netAmount: this.netAmount,

      totalDiscount: this.totalDiscount,
      paymentMode: this.saleAddForm.get("paymentMode").value,
      billing_date: this.saleAddForm.get("saleDate").value,
      invoiceProducts: this.invoiceProducts,
      customer_name: this.saleAddForm.get("custName").value,
      customer_mobile: this.saleAddForm.get("custMobile").value,
      doctor_name: this.saleAddForm.get("docName").value,
      doctor_mobile: this.saleAddForm.get("docMobile").value,
      invoice_no: this.invoice_no,
      discValue: this.saleAddForm.get("totalDisc").value
    };
    const discType = this.saleAddForm.get("discType").value;
    billing.discountType = discType;
    if (this.patientAddress) {
      billing.customer_address = this.patientAddress;
    }

    return billing;
  }

  deleteProduct(row) {
    var productId = row.retail_product_id;
    var batch_info = row.batch_no;

    if (productId) {
      this.invoiceProducts = this.invoiceProducts.filter(product => {
        let flag = true;
        if (
          product.retail_product_id == productId &&
          product.batch_no == batch_info
        ) {
          flag = false;
        }
        return flag;
      });
      this.dataLength = this.invoiceProducts.length;
      if (this.dataLength == 0) {
        this.productAddLabel = "ADD";
      }
      this.dataSource = new MatTableDataSource<InvoiceProduct>(
        this.invoiceProducts
      );

      this.calculateTotalAmount();
    }
  }
  editProduct(row: InvoiceProduct) {
    this.saleAddForm.patchValue({
      prodName: row.product_name,
      batch_no: row.batch_no,
      prodExpiry: row.expiryDate,
      prodGST: row.gst,
      prodQty: row.qty,
      prodDisc: row.selling_discount,
      prodSellingPrice: row.selling_rate
    });

    this.editedProductId = row.retail_product_id;
    this.productAddLabel = "UPDATE";
  }

  saveInvoice() {
    this.isSaving = true;
    var billing = this.getBillingDetails();

    if (this.billingId) {
      console.log("saveInvoice()=>billing", billing);
      billing.id = this.billingId;
      this.billingService.updateBilling(billing).then(() => {
        this.isSaving = false;
        const message = "Invoice Updated..";
        this.snackBar.open(message, " ", { duration: 2000 });

        if (this.saleAddForm.get("printCheck").value) {
          this.router.navigate(["/printSale/", billing.id]);
        } else {
          this.clearForm();
        }
      });
    } else {
      this.billingService.setBilling(billing).then(() => {
        this.isSaving = false;
        const message = "New Invoice Added";
        this.snackBar.open(message, " ", { duration: 2000 });

        if (this.saleAddForm.get("printCheck").value) {
          this.router.navigate(["/printSale/", billing.id]);
        } else {
          this.clearForm();
        }
      });
    }
  }
  generateInvoice() {
    var invoiceNumber;
    this.billingService.getLatestBilling().subscribe(data => {
      // console.log("getLatestBilling", data);
      if (data) {
        invoiceNumber = this.generateInvoiceNumber(data.invoice_no, "IN");
      } else {
        invoiceNumber = this.generateInvoiceNumber("", "IN");
      }
      this.invoice_no = invoiceNumber;
      return invoiceNumber;
    });
  }
  generateInvoiceNumber(documentNo: string, prefix: string): string {
    const numberLength = 8;
    const padString = "0";
    const startingDigit = 1;
    const interval = 1;
    var previousDocNo: number;

    if (documentNo) {
      previousDocNo = +documentNo.substr(prefix.length, numberLength);
    } else {
      previousDocNo = startingDigit;
    }

    var nextDocNo = previousDocNo + interval;
    const generatedNo =
      prefix + nextDocNo.toString().padStart(numberLength, padString);
    return generatedNo;
  }
  clearForm() {
    this.saleAddForm.reset();

    this.saleAddForm.patchValue({
      prodQty: [""],
      prodDisc: [""],
      prodExpiry: [""],
      prodBatchNo: [""],
      prodGST: [""],
      prodSellingPrice: [""],
      totalDisc: [""],
      discType: [""],
      batch_no: "",
      amoutReceived: [""],
      amoutReturn: [""],
      paymentMode: [""]
    });

    this.saleAddForm.get("custMobile").markAsUntouched();
    this.saleAddForm.get("docMobile").markAsUntouched();
    this.saleAddForm.get("prodName").markAsUntouched();

    this.totalAmount = 0;
    this.taxAmount = 0;
    this.discountAmount = 0;
    this.totalDiscount = 0;
    this.netAmount = 0;
    // this.dataSource = new MatTableDataSource<InvoiceProduct>([]);
  }
}
