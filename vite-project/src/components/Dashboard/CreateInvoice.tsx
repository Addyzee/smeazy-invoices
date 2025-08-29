import { useState } from "react";

interface LineItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface CreateInvoiceProps {
  onClose: () => void;
}

const CreateInvoice: React.FC<CreateInvoiceProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState({
    business_id: 2, 
    customer: {
      name: "",
      phone_number: "",
    },
    line_items: [{ id: 1, product_name: "", quantity: 1, unit_price: 0 }] as LineItem[],
  });

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      line_items: [
        ...prev.line_items,
        { id: prev.line_items.length + 1, product_name: "", quantity: 1, unit_price: 0 },
      ],
    }));
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setInvoice((prev) => ({
      ...prev,
      line_items: prev.line_items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "product_name" ? value : Number(value),
            }
          : item
      ),
    }));
  };

  const removeItem = (id: number) => {
    setInvoice((prev) => ({
      ...prev,
      line_items: prev.line_items.filter((item) => item.id !== id),
    }));
  };

  const calculateItemTotal = (item: LineItem) => {
    return item.quantity * item.unit_price;
  };

  const calculateTotal = () => {
    return invoice.line_items.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        business_id: invoice.business_id,
        total_amount: calculateTotal(),
        customer: {
          name: invoice.customer.name,
          phone_number: invoice.customer.phone_number,
        },
        line_items: invoice.line_items.map((item) => ({
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };

      const response = await fetch("http://localhost:8000/invoices/with-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create invoice");
      }

      alert("Invoice created successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error creating invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Invoice Details
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Customer Information</label>
            <div className="space-y-2">
              <input
                type="text"
                value={invoice.customer.name}
                onChange={(e) =>
                  setInvoice({ 
                    ...invoice, 
                    customer: { ...invoice.customer, name: e.target.value }
                  })
                }
                placeholder="Customer Name"
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="text"
                value={invoice.customer.phone_number}
                onChange={(e) =>
                  setInvoice({ 
                    ...invoice, 
                    customer: { ...invoice.customer, phone_number: e.target.value }
                  })
                }
                placeholder="Phone Number (e.g., +254732898412)"
                className="border rounded-lg p-2 w-full"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Business Information</label>
            <div>
              <label className="block text-sm text-gray-600">Business ID</label>
              <input
                type="number"
                value={invoice.business_id}
                onChange={(e) =>
                  setInvoice({ ...invoice, business_id: Number(e.target.value) })
                }
                className="border rounded-lg p-2 w-full"
              />
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">Line Items</h3>
        <div className="grid grid-cols-5 gap-2 mb-2 font-semibold text-gray-700">
          <div className="col-span-2 p-2 text-left">Product Name</div>
          <div className="p-2 text-center">Quantity</div>
          <div className="p-2 text-center">Unit Price</div>
          <div className="p-2 text-center">Total</div>
          <div></div>
        </div>

        {invoice.line_items.map((item) => (
          <div key={item.id} className="grid grid-cols-5 gap-2 mb-2 items-center">
            <input
              type="text"
              value={item.product_name}
              onChange={(e) => updateItem(item.id, "product_name", e.target.value)}
              placeholder="Product Name"
              className="border rounded-lg p-2 col-span-2"
            />
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
              placeholder="Qty"
              className="border rounded-lg p-2 text-center"
              min="1"
            />
            <input
              type="number"
              value={item.unit_price}
              onChange={(e) => updateItem(item.id, "unit_price", e.target.value)}
              placeholder="Unit Price"
              className="border rounded-lg p-2 text-center"
              min="0"
              step="0.01"
            />
            <input
              type="number"
              value={calculateItemTotal(item)}
              readOnly
              className="border rounded-lg p-2 text-center bg-gray-100"
            />
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500 hover:text-red-700"
              disabled={invoice.line_items.length === 1}
            >
              ✗
            </button>
          </div>
        ))}

        <button onClick={addItem} className="text-blue-600 hover:text-blue-800 mt-2">
          + Add Item
        </button>

        <div className="mt-4 text-right">
          <p className="text-gray-700 text-lg font-semibold">
            Total Amount: KES {calculateTotal().toFixed(2)}
          </p>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-200 text-orange-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Creating Invoice..." : "Create Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;