// Types
export interface LineItemBase {
  product_name: string;
  unit_price: number;
  quantity: number;
}

export interface LineItem extends LineItemBase {
  transaction_value: number;
}

export interface Customer {
  phone_number: string;
  full_name: string;
}

export interface InvoiceBase {
  total_amount: number;
  due_date: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled" | "received";
}

export interface InvoiceDelete {
  invoice_number: string;
  status: "deleted";
}

export interface InvoiceUpdate extends InvoiceBase {
  line_items: LineItemBase[];
  notes?: string;
}

export interface InvoiceCreate extends InvoiceUpdate {
  username: string;
  business_name: string;
  customer: Customer;
}

export interface InvoiceType extends InvoiceCreate {
  line_items: LineItem[];
  invoice_number: string;
  created_at: string;
}

export interface InvoiceWithType extends InvoiceType {
  type: "personal" | "business";
}

export type InvoiceFormMode = "create" | "update" | "duplicate";

export interface InvoiceFieldConfig {
  editable: boolean;
  required?: boolean;
}

export interface InvoiceFormConfig {
  mode: InvoiceFormMode;
  fields: {
    business_name: InvoiceFieldConfig;
    customer: {
      full_name: InvoiceFieldConfig;
      phone_number: InvoiceFieldConfig;
    };
    line_items: InvoiceFieldConfig;
    due_date: InvoiceFieldConfig;
    status: InvoiceFieldConfig;
    notes: InvoiceFieldConfig;
  };
}
