// Types
export interface LineItemBase {
  product_name: string;
  unit_price: number;
  quantity: number;
  type: "product" | "service";
  description?: string;
}

export interface LineItem extends LineItemBase {
  transaction_value: number;
}

export interface Customer {
  phone_number: string | null;
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
  customer_name: string;
  customer_phone?: string | null;
}

export interface InvoiceType extends InvoiceCreate {
  line_items: LineItem[];
  invoice_number: string;
  created_at: string;
  customer_name: string;
  customer_phone: string | null;
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
    customer_name: InvoiceFieldConfig;
    customer_phone: InvoiceFieldConfig;
    line_items: InvoiceFieldConfig;
    due_date: InvoiceFieldConfig;
    status: InvoiceFieldConfig;
    notes: InvoiceFieldConfig;
  };
}
