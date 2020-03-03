import { InvoiceProduct } from "./item.model";

export interface Billing {
  id?: string;
  pharmachist_id?: string;
  invoice_no?: string;
  customer_name?: string;
  customer_address?: string;
  customer_mobile?: string;
  doctor_name?: string;
  doctor_mobile?: string;
  billing_date?: Date;
  totalAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
  netAmount?: number;
  discValue?: number;

  totalDiscount?: number;
  paymentMode?: paymentModes;
  creationDate?: Date;
  modifictaionDate?: Date;
  invoiceProducts?: InvoiceProduct[];
  discountType?: string;
}

enum paymentModes {
  "CASH",
  "CARD"
}
