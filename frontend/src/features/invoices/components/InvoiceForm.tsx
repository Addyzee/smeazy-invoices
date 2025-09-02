import {
  Receipt,
  User,
  Phone,
  Building2,
  Plus,
  Package,
  Calculator,
  Calendar,
  Calendar1,
  FileText,
} from "lucide-react";
import {
  EditableInputField,
  EditableLineItemRow,
  EditableStatusSelect,
  EditableTextAreaField,
  FormCard,
  FormSection,
} from "../../../components/FormComponents";
import type { InvoiceFormMode,  LineItemBase } from "../types";
import { useInvoiceForm, useLineItems } from "../hooks/formHooks";
import { useInvoiceStore } from "../store";


export const CreateInvoiceForm = () => {
  return <FlexibleInvoiceForm mode="create" />;
};

export const UpdateInvoiceForm = () => {
  return <FlexibleInvoiceForm mode="update" />;
};

export const DuplicateInvoiceForm = () => {
  return <FlexibleInvoiceForm mode="duplicate" />;
}

const FlexibleInvoiceForm = ({ mode = 'create' }: { mode?: InvoiceFormMode }) => {
  const setPopUpType = useInvoiceStore((state) => state.setPopUpType);

  const {
    formData,
    setFormData,
    config,
    handleDueDateChange,
    handleCustomerChange,
    handleLineItemChange,
    handleNotesChange,
    handleStatusChange,
    handleBusinessNameChange,
    handleSubmit,
  } = useInvoiceForm(mode);

  const { addLineItem, removeLineItem } = useLineItems({
    lineItems: formData.line_items,
    setLineItems: (items: LineItemBase[]) =>
      setFormData((prev) => ({ ...prev, line_items: items })),
  });

  const currentInvoice = useInvoiceStore((state) => state.currentInvoice);
  
  const { title, subtitle, buttonText } = mode === 'update' && currentInvoice
    ? {
        title: `#${currentInvoice.invoice_number}`,
        subtitle: "Edit Invoice",
        buttonText: "Save Changes",
      }
    : mode === "duplicate"
    ? {
        title: "Duplicate Invoice",
        subtitle: "Create your invoice",
        buttonText: "Create Invoice",
      }
    : {
        title: "New Invoice",
        subtitle: "Create your invoice",
        buttonText: "Create Invoice",
      };

  return (
    <div className="h-full py-6 px-4 sm:px-6">
      <FormCard
        title={title}
        subtitle={subtitle}
        icon={Receipt}
        showBackButton={true}
        onBack={() => setPopUpType(null)}
        onSubmit={handleSubmit}
        submitButtonText={buttonText}
        cancelButtonText="Cancel"
        maxWidth="max-w-2xl"
      >
        {/* Business Info Section */}
        <FormSection title="Business Information" icon={Building2}>
          <EditableInputField
            config={config.fields.business_name}
            label="Business Name"
            type="text"
            value={formData.business_name}
            onChange={handleBusinessNameChange}
            placeholder="Enter your business name"
            icon={Building2}
          />
        </FormSection>

        {/* Customer Info Section */}
        <FormSection title="Customer Information" icon={User}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EditableInputField
              config={config.fields.customer.full_name}
              label="Full Name"
              type="text"
              value={formData.customer.full_name}
              onChange={(value) => handleCustomerChange("full_name", value)}
              placeholder="Customer's full name"
              icon={User}
            />
            <EditableInputField
              config={config.fields.customer.phone_number}
              label="Phone Number"
              type="tel"
              value={formData.customer.phone_number}
              onChange={(value) => handleCustomerChange("phone_number", value)}
              placeholder="Customer's phone"
              icon={Phone}
            />
          </div>
        </FormSection>

        {/* Line Items Section */}
        <FormSection title="Invoice Items" icon={Package}>
          <div className="space-y-4">
            {formData.line_items.map((item, index) => (
              <EditableLineItemRow
                key={index}
                item={item}
                index={index}
                onItemChange={handleLineItemChange}
                onRemove={removeLineItem}
                canRemove={formData.line_items.length > 1}
                editable={config.fields.line_items.editable}
              />
            ))}

            {config.fields.line_items.editable && (
              <button
                type="button"
                onClick={addLineItem}
                className="w-full py-3 px-4 border-2 border-dashed border-primary/30 rounded-xl text-primary hover:border-primary/60 hover:bg-primary/5 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            )}
          </div>
        </FormSection>

        {/* Invoice Details Section */}
        <FormSection title="Invoice Details" icon={Calendar1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EditableInputField
              config={config.fields.due_date}
              label="Due Date"
              type="date"
              value={formData.due_date.split("T")[0]}
              onChange={handleDueDateChange}
              placeholder=""
              icon={Calendar}
            />
            <EditableStatusSelect
              config={config.fields.status}
              label="Invoice Status"
              value={formData.status}
              onChange={handleStatusChange}
            />
          </div>
        </FormSection>

        {/* Notes Section */}
        <FormSection title="Additional Notes" icon={FileText}>
          <EditableTextAreaField
            config={config.fields.notes}
            label="Notes"
            value={formData.notes || ""}
            onChange={handleNotesChange}
            placeholder="Add any additional notes or terms for this invoice..."
            icon={FileText}
            rows={3}
          />
        </FormSection>

        {/* Total Section */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  KES {formData.total_amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </FormCard>
    </div>
  );
};
