import React, { useState } from "react";
import type {
  Customer,
  InvoiceCreate,
  InvoiceFormConfig,
  InvoiceFormMode,
  LineItem,
  LineItemBase,
} from "../types";
import { useInvoiceStore } from "../store";
import { useUserName } from "../../../hooks/useData";
import { useCreateInvoice, useDeleteInvoice, useUpdateInvoice } from "./useAPIs";

export const FORM_CONFIGS: Record<InvoiceFormMode, InvoiceFormConfig> = {
  create: {
    mode: "create",
    fields: {
      business_name: { editable: true, required: true },
      customer: {
        full_name: { editable: true, required: true },
        phone_number: { editable: true, required: false },
      },
      customer_name: { editable: true, required: true },
      customer_phone: { editable: true, required: false },
      line_items: { editable: true, required: true },
      due_date: { editable: true, required: true },
      status: { editable: true, required: true },
      notes: { editable: true },
    },
  },
  duplicate: {
    mode: "duplicate",
    fields: {
      business_name: { editable: true, required: true },
      customer: {
        full_name: { editable: true, required: true },
        phone_number: { editable: true, required: false },
      },
      customer_name: { editable: true, required: true },
      customer_phone: { editable: true, required: false },
      line_items: { editable: true, required: true },
      due_date: { editable: true, required: true },
      status: { editable: true, required: true },
      notes: { editable: true },
    },
  },
  update: {
    mode: "update",
    fields: {
      business_name: { editable: false },
      customer: {
        full_name: { editable: false },
        phone_number: { editable: false },
      },
      customer_name: { editable: false },
      customer_phone: { editable: false },
      line_items: { editable: true, required: true },
      due_date: { editable: true, required: true },
      status: { editable: true, required: true },
      notes: { editable: true },
    },
  },
};

interface UseInvoiceFormProps {
  mode: InvoiceFormMode;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useInvoiceForm = ({ mode = "create", setError }: UseInvoiceFormProps) => {
  const currentInvoice = useInvoiceStore((state) => state.currentInvoice);
  const setCurrentInvoice = useInvoiceStore((state) => state.setCurrentInvoice);
  const setPopUpType = useInvoiceStore((state) => state.setPopUpType);
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice(); 
  const username = useUserName();

  const [formData, setFormData] = useState<InvoiceCreate>(
    currentInvoice && (mode === "update" || mode === "duplicate")
      ? currentInvoice
      : {
          username: username,
          total_amount: 0,
          due_date: "",
          status: "draft",
          notes: "",
          business_name: "",
          customer: {
            phone_number: "",
            full_name: "",
          },
          customer_name: "",
          customer_phone: null,
          line_items: [
            {
              product_name: "",
              unit_price: 0,
              quantity: 1,
              type: "product",
              description: "",
            },
          ],
        }
  );

  const config = FORM_CONFIGS[mode];

  // Calculate total amount whenever line items change
  React.useEffect(() => {
    const total = formData.line_items.reduce((sum, item) => {
      return sum + item.unit_price * item.quantity;
    }, 0);
    setFormData((prev) => ({ ...prev, total_amount: total }));
  }, [formData.line_items]);

  const handleCustomerChange = (field: keyof Customer, value: string) => {
    if (!config.fields.customer[field].editable) return;
    if (field === "full_name" && config.fields.customer_name.editable) {
      setFormData((prev) => ({
        ...prev,
        customer: {
          ...prev.customer,
          [field]: value,
        },
        customer_name: value,
      }));
      return
    }
    if (field === "phone_number" && config.fields.customer_phone.editable) {
      setFormData((prev) => ({
        ...prev,
        customer: {
          ...prev.customer,
          [field]: value,
        },
        customer_phone: value,
      }));
      return;
    }
  };

  const handleDueDateChange = (value: string) => {
    if (!config.fields.due_date.editable) return;

    setFormData((prev) => ({
      ...prev,
      due_date: value,
    }));
  };

  const handleNotesChange = (value: string) => {
    if (!config.fields.notes.editable) return;

    setFormData((prev) => ({
      ...prev,
      notes: value,
    }));
  };

  const handleStatusChange = (status: string) => {
    if (!config.fields.status.editable) return;

    if (
      status === "paid" ||
      status === "draft" ||
      status === "sent" ||
      status === "cancelled" ||
      status === "overdue"
    ) {
      setFormData((prev) => ({ ...prev, status: status }));
    }
  };

  const handleLineItemChange = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    if (!config.fields.line_items.editable) return;

    setFormData((prev) => ({
      ...prev,
      line_items: prev.line_items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleBusinessNameChange = (value: string) => {
    if (!config.fields.business_name.editable) return;

    setFormData((prev) => ({ ...prev, business_name: value }));
  };

  const handleSubmit = () => {
    if (formData.line_items[formData.line_items.length - 1].product_name.trim() === "") {
      setError("Please fill out all line items or remove empty ones.");
      return;
    }
    if (mode === "create") {
      console.log("Creating invoice with data:", formData);
      createInvoice.mutate(formData);
      setCurrentInvoice(null);
    } else if ( mode === "duplicate"){
      createInvoice.mutate({
        ...formData,
        username: username
      });
      setCurrentInvoice(null);
    }
    else if (mode === "update" && currentInvoice) {
      // Only send the updatable fields to the API
      const updateData = {
        total_amount: formData.total_amount,
        due_date: formData.due_date,
        status: formData.status,
        line_items: formData.line_items,
        notes: formData.notes,
      };
      console.log("Updating invoice with data:", updateData);
      updateInvoice.mutate(updateData);
    }
    setPopUpType(null);
  };
  const deleteInvoice = useDeleteInvoice();
  
  const onDelete = () => {
    deleteInvoice.mutate();
    setPopUpType(null);
  };

  return {
    formData,
    setFormData,
    config,
    handleDueDateChange,
    handleNotesChange,
    handleStatusChange,
    handleCustomerChange,
    handleLineItemChange,
    handleBusinessNameChange,
    handleSubmit,
    onDelete
  };
};

interface UseLineItemsProps {
  lineItems: LineItemBase[];
  setLineItems: (items: LineItemBase[]) => void;
}

export const useLineItems = ({
  lineItems,
  setLineItems,
}: UseLineItemsProps) => {
  const addLineItem = () => {
    if (lineItems[lineItems.length - 1].product_name.trim() === "") return;
    setLineItems([
      ...lineItems,
      {
        product_name: "",
        unit_price: 0,
        quantity: 1,
        type: "product",
      },
    ]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    const newItems = [...lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setLineItems(newItems);
  };

  return {
    addLineItem,
    removeLineItem,
    updateLineItem,
  };
};
