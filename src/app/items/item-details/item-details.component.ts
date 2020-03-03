import { Item } from "./../../shared/models/item.model";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { Moment } from "moment";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import * as moment from "moment";

import { MatDatepicker } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { startWith, map } from "rxjs/operators";
import { ItemService } from "src/app/shared/services/item.service";
import {
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE
} from "@angular/material/core";

export const MY_FORMATS = {
  parse: {
    dateInput: "MMM/YYYY"
  },
  display: {
    dateInput: "MMM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@Component({
  selector: "app-item-details",
  templateUrl: "./item-details.component.html",
  styleUrls: ["./item-details.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ItemDetailsComponent implements OnInit {
  @ViewChild("searchElement", { static: true }) searchElement: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  product: Item;
  products: Item[] = [];

  productId: string;
  filteredProducts: Observable<Item[]>;
  isLoading = false;
  isTableLoading = false;
  isProductSaving = false;

  displayedColumns: string[] = [
    "product_name",
    "expiry_date",

    "gst",
    "purchase_rate",
    "mrp",
    "selling_rate",
    "boxNo",
    "rackNo",
    "action"
  ];
  dataSource: MatTableDataSource<Item>;
  dataLength = -1;

  openingStockForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private itemService: ItemService,
    private fb: FormBuilder,

    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.getRetailProducts();

    this.openingStockForm = this.fb.group({
      name: ["", Validators.required],
      batchNo: ["", Validators.required],
      expiryDate: new FormControl(moment()),
      // stock: ["", Validators.required],
      GST: ["", Validators.required],
      purchaseRate: new FormControl(""),
      MRP: new FormControl(""),
      discount: new FormControl(""),
      sellingRate: ["", Validators.required],
      minStock: new FormControl(""),
      boxNo: new FormControl(""),
      rackNo: new FormControl(""),
      isDrug: new FormControl("")
    });
    this.openingStockForm.get("MRP").valueChanges.subscribe(val => {
      this.openingStockForm
        .get("sellingRate")
        .setValue("", { onlySelf: true, emitEvent: false });
      this.openingStockForm
        .get("discount")
        .setValue("", { onlySelf: true, emitEvent: false });
    });
    this.openingStockForm.get("discount").valueChanges.subscribe(val => {
      const mrp = this.openingStockForm.get("MRP").value;
      let sellrate = mrp;
      if (mrp != "") {
        if (val >= 0) {
          sellrate = mrp - mrp * val * 0.01;
        }
        this.openingStockForm
          .get("sellingRate")
          .setValue(sellrate, { onlySelf: true, emitEvent: false });
      }
    });

    this.openingStockForm.get("sellingRate").valueChanges.subscribe(val => {
      const mrp = this.openingStockForm.get("MRP").value;
      let disc: string = "0";
      if (mrp != "") {
        if (val <= mrp) {
          disc = (100 - (val * 100) / mrp).toFixed(2);
        }
        this.openingStockForm
          .get("discount")
          .setValue(disc, { onlySelf: true, emitEvent: false });
      }
    });
  }
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.openingStockForm.get("expiryDate").value;

    ctrlValue.year(normalizedYear.year());
    this.openingStockForm.get("expiryDate").setValue(ctrlValue);
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.openingStockForm.get("expiryDate").value;

    ctrlValue.month(normalizedMonth.month());
    this.openingStockForm.get("expiryDate").setValue(ctrlValue);
    datepicker.close();
  }
  private _filter(value: string): Item[] {
    if (typeof value == "string") {
      const filterValue = value.toLowerCase();

      return this.products.filter(product =>
        product.product_name.toLowerCase().includes(filterValue)
      );
    }
  }

  getRetailProducts() {
    this.isTableLoading = true;
    this.itemService.getItem().subscribe(response => {
      this.products = response;
      console.log("getRetailProducts()->", this.products);
      this.dataSource = new MatTableDataSource<Item>(this.products);
      this.dataSource.paginator = this.paginator;
      this.dataLength = this.products.length;
      this.isTableLoading = false;

      this.filteredProducts = this.openingStockForm
        .get("name")
        .valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value))
        );
    });
  }

  getProductDetails() {
    const newProduct: Item = {
      name: this.openingStockForm.get("name").value,
      // expiry_date: this.openingStockForm.get("expiryDate").value._d,
      // stock: this.openingStockForm.get("stock").value,
      gst: this.openingStockForm.get("GST").value,
      purchase_rate: this.openingStockForm.get("purchaseRate").value,
      mrp: this.openingStockForm.get("MRP").value,
      selling_rate: this.openingStockForm.get("sellingRate").value,
      min_stock: this.openingStockForm.get("minStock").value,
      boxNo: this.openingStockForm.get("boxNo").value,
      rackNo: this.openingStockForm.get("rackNo").value,
      is_drug: this.openingStockForm.get("isDrug").value,
      batch_no: this.openingStockForm.get("batchNo").value
    };

    if (this.openingStockForm.get("expiryDate").value._d) {
      newProduct.expiry_date = this.openingStockForm.get("expiryDate").value._d;
    } else {
      newProduct.expiry_date = this.openingStockForm.get("expiryDate").value;
    }
    const product = Object.assign({}, newProduct);
    return product;
  }

  saveProduct() {
    var item = this.getProductDetails();

    if (this.productId) {
      this.isProductSaving = true;
      item.id = this.product.id;

      this.itemService.updateItem(item).then(() => {
        const message = "Product Updated!";
        this.snackBar.open(message, " ", { duration: 2000 });
        this.clearForm();
        this.isProductSaving = false;
        this.getRetailProducts();
      });
    } else {
      this.isProductSaving = true;
      console.log(".....new Product.......");
      this.itemService.setItem(item).then(() => {
        const message = "Product Added!";
        this.snackBar.open(message, " ", { duration: 2000 });
        this.clearForm();
        this.isProductSaving = false;
        this.getRetailProducts();
      });
    }
  }

  deleteProduct(row: Item) {
    console.log("deleteProduct->row", row);
    this.isProductSaving = true;

    if (row.id) {
      this.itemService.deleteItem(row).then(() => {
        this.getRetailProducts();
        this.isProductSaving = false;
        console.log("product deleted");
      });
    }
  }

  editProduct(row: Item) {
    this.product = row;

    // console.log("editPro(duct->", row.creationDate);

    var expiryTimestamp: any = row.expiry_date;
    var x = expiryTimestamp.seconds * 1000;

    var date = new Date(x);

    this.product.id = row.id;
    this.productId = row.id;
    this.openingStockForm.patchValue({
      name: row.name,
      expiryDate: date,
      // stock: row.stock,
      GST: row.gst,
      purchaseRate: row.purchase_rate,
      MRP: row.mrp,
      sellingRate: row.selling_rate,
      minStock: row.min_stock,
      boxNo: row.boxNo,
      rackNo: row.rackNo,
      isDrug: row.is_drug,
      batchNo: row.batch_no
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearForm() {
    this.productId = null;

    this.openingStockForm.reset();
  }

  openNotification() {
    this.router.navigate(["/notify"]);
  }
}
