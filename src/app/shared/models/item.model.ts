export interface Item {
  id?: string;
  name?: string;
  pharmachist_id?: string;
  mrp?: number;
  gst?: number;
  product_name?: string;
  hsn_code?: string;
  manufacturer_name?: string;
  generic_name?: string;
  min_stock?: number;
  boxNo?: string;
  rackNo?: string;
  is_drug?: boolean;
  is_opening?: boolean;

  batch_no?: string;
  selling_rate?: number;
  selling_discount?: number;
  purchase_rate?: number;
  purchase_discount?: number;
  expiry_date?: Date;
  free_quantity?: number;
  // stock?: number;
  qty?: number;

  creationDate?: Date;
  modifictaionDate?: Date;
  batches?: string;
}
export interface InvoiceProduct {
  billing_id?: string;
  retail_product_id?: string;
  pharmachist_id?: string;
  product_name?: string;

  selling_rate?: number;
  purchase_rate?: number;
  selling_discount?: number;
  purchase_discount?: number;

  freeQuantity?: number;
  lastStock?: number;
  qty?: number;

  gst?: number;
  batch_no?: string;
  expiryDate?: Date;
  isReturned?: boolean;
  noOfReturns?: number;
  return_date?: string;
  isPurchaseOrder?: boolean;
}
