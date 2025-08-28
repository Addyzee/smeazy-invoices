import React, { useState } from 'react';

interface Item {
  id: number;
  description: string;
  quantity: number;
  rate: number;
}

interface CreateInvoiceProps {
  onClose: () => void;
}

const CreateInvoice: React.FC<CreateInvoiceProps> = ({ onClose }) => {
  const [invoice, setInvoice] = useState({
    clientName: '',
    clientEmail: '',
    address: '',
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: 'KES',
    items: [{ id: 1, description: '', quantity: 1, rate: 0 }] as Item[],
  });

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: prev.items.length + 1, description: '', quantity: 1, rate: 0 }],
    }));
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: field === 'description' ? value : Number(value) } : item
      ),
    }));
  };

  const removeItem = (id: number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const calculateItemTotal = (item: Item) => {
    return item.quantity * item.rate;
  };

  const calculateTotal = () => {
    return invoice.items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Invoice Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Bill To</label>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <input
                type="text"
                value={invoice.clientName}
                onChange={(e) => setInvoice({ ...invoice, clientName: e.target.value })}
                placeholder="Johnathon Doe"
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="email"
                value={invoice.clientEmail}
                onChange={(e) => setInvoice({ ...invoice, clientEmail: e.target.value })}
                placeholder="john.doe@gmail.com"
                className="border rounded-lg p-2 w-full"
              />
            </div>
            <input
              type="text"
              value={invoice.address}
              onChange={(e) => setInvoice({ ...invoice, address: e.target.value })}
              placeholder="16/345 Palatial Avenue, South Mascot, 2026"
              className="border rounded-lg p-2 w-full mt-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Invoice Number</label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
              placeholder="#0045"
              className="border rounded-lg p-2 w-full"
            />
            <div className="flex space-x-4 mt-2">
              <div>
                <label className="block text-gray-700">Issue Date</label>
                <input
                  type="date"
                  value={invoice.issueDate}
                  onChange={(e) => setInvoice({ ...invoice, issueDate: e.target.value })}
                  className="border rounded-lg p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                  className="border rounded-lg p-2 w-full"
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-gray-700">Currency</label>
              <select
                value={invoice.currency}
                onChange={(e) => setInvoice({ ...invoice, currency: e.target.value })}
                className="border rounded-lg p-2 w-full"
              >
                <option value="KES">KES - Kenya Shillings</option>
              </select>
            </div>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Items</h3>
        <div className="grid grid-cols-5 gap-2 mb-2 font-semibold text-gray-700">
          <div className="col-span-2 p-2 text-left">Item Description</div>
          <div className="p-2 text-center">Item Quantity</div>
          <div className="p-2 text-center">Item Rate</div>
          <div className="p-2 text-center">Total Amount</div>
          <div className="p-2 text-center"></div>
        </div>
        {invoice.items.map((item) => (
          <div key={item.id} className="grid grid-cols-5 gap-2 mb-2 items-center">
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
              placeholder="Description"
              className="border rounded-lg p-2 col-span-2"
            />
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
              placeholder="Qty"
              className="border rounded-lg p-2 text-center"
            />
            <input
              type="number"
              value={item.rate}
              onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
              placeholder="Rate"
              className="border rounded-lg p-2 text-center"
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
            >
              ✗
            </button>
          </div>
        ))}
        <button
          onClick={addItem}
          className="text-blue-600 hover:text-blue-800 mt-2"
        >
          + Add Item
        </button>
        <div className="mt-4 text-right">
          <p className="text-gray-700">Total: KES {calculateTotal().toFixed(2)}</p>
        </div>
        <div className="flex justify-between mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-orange-200 text-orange-800 rounded-lg">Cancel</button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">Complete</button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;