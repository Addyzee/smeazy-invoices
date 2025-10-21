import {
  ArrowLeft,
  Banknote,
  Eye,
  EyeOff,
  FileText,
  Hand,
  Hash,
  Lock,
  Package,
  Trash2,
} from "lucide-react";
import React, { type PropsWithChildren } from "react";
import type {
  InvoiceFieldConfig,
  LineItem,
  LineItemBase,
} from "../features/invoices/types";
import { StatusSelect } from "../features/invoices/ui/components";
import { CancelButton, SubmitButton } from "./Buttons";
import Markdown from "react-markdown";

type FormCardPropsWithChildren = PropsWithChildren & {
  title?: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  showBackButton?: boolean;
  onBack?: () => void;
  onSubmit: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  otherFormButton?: React.ReactNode;
  maxWidth?: string;
};

export const FormCard = ({
  title,
  subtitle,
  icon,
  showBackButton = false,
  onBack,
  onSubmit,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  otherFormButton = null,
  maxWidth = "max-w-md",
  children,
}: FormCardPropsWithChildren) => {
  return (
    <div className={`w-full ${maxWidth} mx-auto`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <FormCardHeader
          icon={icon}
          title={title}
          subtitle={subtitle}
          showBackButton={showBackButton}
          onBack={onBack}
        />

        <div className="p-6 sm:p-8">
          {!title && !subtitle && (
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Form Title
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Fill in the details below
              </p>
            </div>
          )}

          <div className="space-y-6 sm:space-y-8">
            {children}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {onBack && (
                <CancelButton onClick={onBack} buttonText={cancelButtonText} />
              )}
              {otherFormButton}
              <SubmitButton onClick={onSubmit} buttonText={submitButtonText} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FormCardHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const FormCardHeader: React.FC<FormCardHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  showBackButton,
  onBack,
}) => {
  return (
    <div className="h-28 sm:h-32 bg-gradient-to-r from-secondary to-accent relative">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-2 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full"></div>

      <div className="relative h-full flex items-center justify-between px-6 sm:px-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          {(title || subtitle) && (
            <div>
              {title && (
                <h1 className="text-lg sm:text-xl font-bold">{title}</h1>
              )}
              {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
            </div>
          )}
        </div>

        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export const EditableInputField = ({
  config,
  ...props
}: {
  config: InvoiceFieldConfig;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  required?: boolean;
}) => {
  if (!config.editable) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {props.label}
        </label>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <props.icon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {props.value || "Not specified"}
          </span>
        </div>
      </div>
    );
  }

  return <InputField {...props} required={config.required} />;
};

export const EditableTextAreaField = ({
  config,
  ...props
}: {
  config: InvoiceFieldConfig;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  rows: number;
}) => {
  if (!config.editable) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {props.label}
        </label>
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[80px]">
          <props.icon className="w-4 h-4 text-gray-400 mt-1" />
          <span className="text-gray-600">
            {props.value || "No notes added"}
          </span>
        </div>
      </div>
    );
  }

  return <MDTextAreaField {...props} />;
};

export const EditableStatusSelect = ({
  config,
  ...props
}: {
  config: InvoiceFieldConfig;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) => {
  if (!config.editable) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {props.label}
        </label>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div
            className={`w-3 h-3 rounded-full ${
              props.value === "paid"
                ? "bg-green-500"
                : props.value === "sent"
                ? "bg-blue-500"
                : props.value === "overdue"
                ? "bg-red-500"
                : props.value === "cancelled"
                ? "bg-gray-500"
                : "bg-yellow-500"
            }`}
          />
          <span className="text-gray-600 capitalize">{props.value}</span>
        </div>
      </div>
    );
  }

  return <StatusSelect {...props} required={config.required} />;
};

// Enhanced LineItemRow component
export const EditableLineItemRow = ({
  item,
  index,
  onItemChange,
  onRemove,
  canRemove,
  editable,
}: {
  item: LineItemBase;
  index: number;
  onItemChange: (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  editable: boolean;
}) => {
  if (!editable) {
    return (
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Package className="w-4 h-4 text-gray-400" />
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500">{item.type === "product" ? "Product" : "Service"}</p>
            <p className="text-sm font-medium text-gray-700">
              {item.product_name}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Unit Price</p>
            <p className="text-sm font-medium text-gray-700">
              KES {item.unit_price.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Quantity</p>
            <p className="text-sm font-medium text-gray-700">{item.quantity}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-sm font-bold text-gray-900">
              KES {(item.unit_price * item.quantity).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LineItemRow
      item={item}
      index={index}
      onItemChange={onItemChange}
      onRemove={onRemove}
      canRemove={canRemove}
    />
  );
};

interface LineItemRowProps {
  item: LineItemBase;
  index: number;
  onItemChange: (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const LineItemRow: React.FC<LineItemRowProps> = ({
  item,
  index,
  onItemChange,
  onRemove,
  canRemove,
}) => {
  const subtotal = item.unit_price * item.quantity;
  const [includeDescription, setIncludeDescription] = React.useState(false);
  const { Icon, OppositeIcon } =
    item.type === "product"
      ? {
          Icon: Package,
          OppositeIcon: Hand,
        }
      : { Icon: Hand, OppositeIcon: Package };

  return (
    <div className="bg-gray-50/50 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          {item.product_name || `Item ${index + 1}`}
        </h4>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center text-red-600 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() =>
            onItemChange(
              index,
              "type",
              item.type === "product" ? "service" : "product"
            )
          }
        >
          <OppositeIcon className="w-7 h-7 text-gray-400" />
          <span className="sr-only">Toggle Item Type</span>
        </button>
      </div>

      <div className="sm:col-span-1">
          <InputField
            label={`${item.type === "product" ? "Product" : "Service"} Name`}
            type="text"
            value={item.product_name}
            onChange={(value) => onItemChange(index, "product_name", value)}
            placeholder={`${
              item.type === "product" ? "Product" : "Service"
            } Name`}
            icon={Icon}
            required
          />
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputField
            label="Unit Price"
            type="number"
            value={item.unit_price}
            onChange={(value) =>
              onItemChange(index, "unit_price", parseFloat(value) || 0)
            }
            placeholder="0.00"
            icon={Banknote}
            required
          />
        </div>

        <div>
          <InputField
            label="Quantity"
            type="number"
            value={item.quantity}
            onChange={(value) =>
              onItemChange(index, "quantity", parseInt(value) || 1)
            }
            placeholder="1"
            icon={Hash}
            required
          />
        </div>
      </div>
      {includeDescription && (
        <MDTextAreaField
          label="Description"
          value={item.description || ""}
          onChange={(value) => onItemChange(index, "description", value)}
          placeholder="Add a description for this item..."
          icon={FileText}
          rows={3}
        />
      )}

      <div className="flex justify-between pt-2 border-t border-gray-200">
        <div>
          <button
            type="button"
            onClick={() => setIncludeDescription(!includeDescription)}
            className="text-sm text-primary hover:underline"
          >
            {item.description && includeDescription || !item.description && includeDescription
              ? "Hide Description"
              : !item.description && !includeDescription
              ? "Add Description"
              : item.description && !includeDescription
              ? "Show Description"
              : null}  {/* :,) */}
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Subtotal</p>
          <p className="text-lg font-semibold text-gray-900">
            KES {subtotal.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  type: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-warning-red">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <input
          type={type}
          value={value}
          min={type === "number" ? "0" : undefined}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 sm:pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm sm:text-base"
        />
      </div>
    </div>
  );
};

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-warning-red">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm sm:text-base"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 z-10"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export const TextAreaField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
  rows?: number;
}> = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required,
  rows = 4,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-3 z-10">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`w-full ${
            Icon ? "pl-11" : "pl-4"
          } pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none`}
          required={required}
        />
      </div>
    </div>
  );
};

export const MDTextAreaField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
  rows?: number;
}> = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required,
  rows = 4,
}) => {
  const [showPreview, setShowPreview] = React.useState(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-gray-400 hover:text-gray-600 transition-colors flex items-center"
        >
          {showPreview ? (
            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-3 z-10">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`w-full ${
            Icon ? "pl-11" : "pl-4"
          } pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none`}
          required={required}
        />
        {showPreview && (
          <div className="prose prose-sm max-w-none p-4 border border-gray-200 rounded-lg bg-gray-50 mt-2">
            <Markdown>
              {value || "Preview will appear here (markdown enabled)..."}
            </Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

interface FormSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  icon: Icon,
  children,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
};

// const DeprecatedInvoiceForm = () => {
//   const setPopUpType = useInvoiceStore((state) => state.setPopUpType);

//   const {
//     formData,
//     setFormData,
//     handleDueDateChange,
//     handleCustomerChange,
//     handleLineItemChange,
//     handleNotesChange,
//     handleStatusChange,
//     handleSubmit,
//   } = useInvoiceForm();
//   const { addLineItem, removeLineItem } = useLineItems({
//     lineItems: formData.line_items,
//     setLineItems: (items: LineItemBase[]) =>
//       setFormData((prev) => ({ ...prev, line_items: items })),
//   });
//   const currentInvoice = useInvoiceStore((state) => state.currentInvoice);
//   const { title, subtitle, buttonText } = currentInvoice
//     ? {
//         title: `#${currentInvoice.invoice_number}`,
//         subtitle: "Edit Invoice",
//         buttonText: "Save Changes",
//       }
//     : {
//         title: "New Invoice",
//         subtitle: "Create your invoice",
//         buttonText: "Create Invoice",
//       };

//   return (
//     <div className="h-full  py-6 px-4 sm:px-6">
//       <FormCard
//         title={title}
//         subtitle={subtitle}
//         icon={Receipt}
//         showBackButton={true}
//         onBack={() => setPopUpType(null)}
//         onSubmit={handleSubmit}
//         submitButtonText={buttonText}
//         cancelButtonText="Cancel"
//         maxWidth="max-w-2xl"
//       >
//         {/* Business Info Section */}
//         <FormSection title="Business Information" icon={Building2}>
//           <InputField
//             label="Business Name"
//             type="text"
//             value={formData.business_name}
//             onChange={(value) =>
//               setFormData((prev) => ({ ...prev, business_name: value }))
//             }
//             placeholder="Enter your business name"
//             icon={Building2}
//             required
//           />
//         </FormSection>

//         {/* Customer Info Section */}
//         <FormSection title="Customer Information" icon={User}>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <InputField
//               label="Full Name"
//               type="text"
//               value={formData.customer.full_name}
//               onChange={(value) => handleCustomerChange("full_name", value)}
//               placeholder="Customer's full name"
//               icon={User}
//               required
//             />
//             <InputField
//               label="Phone Number"
//               type="tel"
//               value={formData.customer.phone_number}
//               onChange={(value) => handleCustomerChange("phone_number", value)}
//               placeholder="Customer's phone"
//               icon={Phone}
//               required
//             />
//           </div>
//         </FormSection>

//         {/* Line Items Section */}
//         <FormSection title="Invoice Items" icon={Package}>
//           <div className="space-y-4">
//             {formData.line_items.map((item, index) => (
//               <LineItemRow
//                 key={index}
//                 item={item}
//                 index={index}
//                 onItemChange={handleLineItemChange}
//                 onRemove={removeLineItem}
//                 canRemove={formData.line_items.length > 1}
//               />
//             ))}

//             <button
//               type="button"
//               onClick={addLineItem}
//               className="w-full py-3 px-4 border-2 border-dashed border-primary/30 rounded-xl text-primary hover:border-primary/60 hover:bg-primary/5 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
//             >
//               <Plus className="w-4 h-4" />
//               <span>Add New Item</span>
//             </button>
//           </div>
//         </FormSection>

//         {/* Invoice Details Section */}
//         <FormSection title="Invoice Details" icon={Calendar1}>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <InputField
//               label="Due Date"
//               type="date"
//               value={formData.due_date}
//               onChange={(value) => handleDueDateChange(value)}
//               placeholder=""
//               icon={Calendar}
//               required
//             />
//             <StatusSelect
//               label="Invoice Status"
//               value={formData.status}
//               onChange={handleStatusChange}
//               required
//             />
//           </div>
//         </FormSection>

//         {/* Notes Section */}
//         <FormSection title="Additional Notes" icon={FileText}>
//           <TextAreaField
//             label="Notes"
//             value={formData.notes || ""}
//             onChange={handleNotesChange}
//             placeholder="Add any additional notes or terms for this invoice..."
//             icon={FileText}
//             rows={3}
//           />
//         </FormSection>

//         {/* Total Section */}
//         <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/20">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
//                 <Calculator className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Total Amount</p>
//                 <p className="text-xl sm:text-2xl font-bold text-gray-900">
//                   KES {formData.total_amount.toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </FormCard>
//     </div>
//   );
// };
