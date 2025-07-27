import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Invoice } from '../types';
import { Plus, Search, Download, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';

const Invoices: React.FC = () => {
  const { invoices, customers, products, addInvoice, exportData } = useData();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    products: [{ productId: '', name: '', quantity: 1, unitCost: 0 }],
    installationDate: '',
    taxes: 0,
    companyAddress: '',
    gstNumber: '',
    signatory: ''
  });

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = (invoice: Invoice) => {
    const customer = customers.find(c => c.id === invoice.customerId);
    const doc = new jsPDF();
    
    // Add Spectra Logo - using base64 encoded logo
    // For now, we'll add a text-based logo representation
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('SPECTRA', 20, 20);
    doc.setFontSize(12);
    doc.text('SOLAR SOLUTIONS', 20, 28);
    
    // Header
    doc.setFontSize(20);
    doc.text('SPECTRA SOLAR SOLUTIONS INVOICE', 20, 40);
    
    doc.setFontSize(12);
    doc.text('Spectra Solar Solutions', 20, 55);
    doc.text(invoice.companyAddress || '123 Solar Street, Energy City, EC 12345', 20, 62);
    doc.text(`GST: ${invoice.gstNumber || 'GST123456789'}`, 20, 69);
    doc.text('Phone: (555) 123-4567 | Email: info@spectrasolar.com', 20, 76);
    
    // Invoice Details
    doc.text(`Invoice #: ${invoice.id}`, 120, 55);
    doc.text(`Date: ${format(new Date(invoice.createdAt), 'MM/dd/yyyy')}`, 120, 62);
    doc.text(`Installation Date: ${format(new Date(invoice.installationDate), 'MM/dd/yyyy')}`, 120, 69);
    
    // Customer Info
    doc.text('Bill To:', 20, 95);
    if (customer) {
      doc.text(customer.name, 20, 105);
      doc.text(customer.address, 20, 112);
      doc.text(`Phone: ${customer.phone}`, 20, 119);
      doc.text(`Email: ${customer.email}`, 20, 126);
    }
    
    // Products Table
    let yPos = 145;
    doc.text('Description', 20, yPos);
    doc.text('Qty', 100, yPos);
    doc.text('Unit Cost', 125, yPos);
    doc.text('Total', 160, yPos);
    
    doc.line(20, yPos + 3, 190, yPos + 3);
    yPos += 10;
    
    invoice.products.forEach(product => {
      doc.text(product.name, 20, yPos);
      doc.text(product.quantity.toString(), 100, yPos);
      doc.text(`₹${product.unitCost.toFixed(2)}`, 125, yPos);
      doc.text(`₹${(product.quantity * product.unitCost).toFixed(2)}`, 160, yPos);
      yPos += 8;
    });
    
    // Totals
    yPos += 10;
    doc.line(120, yPos, 190, yPos);
    yPos += 10;
    
    doc.text(`Subtotal: ₹${invoice.totalCost.toFixed(2)}`, 120, yPos);
    yPos += 8;
    doc.text(`Tax: ₹${invoice.taxes.toFixed(2)}`, 120, yPos);
    yPos += 8;
    doc.setFontSize(14);
    doc.text(`Total: ₹${invoice.finalAmount.toFixed(2)}`, 120, yPos);
    
    // Signatory
    if (invoice.signatory) {
      yPos += 20;
      doc.setFontSize(12);
      doc.text(`Authorized Signatory: ${invoice.signatory}`, 20, yPos);
    }
    
    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for choosing Spectra Solar Solutions!', 20, 260);
    doc.text('For support, contact us at support@spectrasolar.com', 20, 270);
    
    doc.save(`invoice-${invoice.id}.pdf`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formData.customerId);
    if (!customer) return;

    const totalCost = formData.products.reduce((sum, p) => sum + (p.quantity * p.unitCost), 0);
    const finalAmount = totalCost + formData.taxes;

    const invoiceData: Omit<Invoice, 'id' | 'createdAt'> = {
      customerId: formData.customerId,
      customerName: customer.name,
      products: formData.products,
      installationDate: formData.installationDate,
      totalCost,
      taxes: formData.taxes,
      finalAmount,
      companyAddress: formData.companyAddress,
      gstNumber: formData.gstNumber,
      signatory: formData.signatory
    };

    addInvoice(invoiceData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      products: [{ productId: '', name: '', quantity: 1, unitCost: 0 }],
      installationDate: '',
      taxes: 0,
      companyAddress: '',
      gstNumber: '',
      signatory: ''
    });
    setShowModal(false);
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { productId: '', name: '', quantity: 1, unitCost: 0 }]
    });
  };

  const removeProduct = (index: number) => {
    if (formData.products.length > 1) {
      setFormData({
        ...formData,
        products: formData.products.filter((_, i) => i !== index)
      });
    }
  };

  const updateProduct = (index: number, field: string, value: any) => {
    const updatedProducts = formData.products.map((product, i) => {
      if (i === index) {
        if (field === 'productId') {
          const selectedProduct = products.find(p => p.id === value);
          return {
            ...product,
            productId: value,
            name: selectedProduct?.name || '',
            unitCost: selectedProduct?.unitCost || 0
          };
        }
        return { ...product, [field]: value };
      }
      return product;
    });
    setFormData({ ...formData, products: updatedProducts });
  };

  const subtotal = formData.products.reduce((sum, p) => sum + (p.quantity * p.unitCost), 0);
  const total = subtotal + formData.taxes;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
                      <img 
              src="/SPECTRA_LOGO_NEW.png" 
              alt="Spectra Solar Solutions" 
              className="h-12 w-auto"
            />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Generate and manage customer invoices
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => exportData('invoices')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Invoices List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredInvoices.map((invoice) => (
            <li key={invoice.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600">
                          Invoice #{invoice.id}
                        </p>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-900">{invoice.customerName}</p>
                        <p className="text-sm text-gray-500">
                          Created: {format(new Date(invoice.createdAt), 'MMM dd, yyyy')} • 
                          Installation: {format(new Date(invoice.installationDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{invoice.finalAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {invoice.products.length} item{invoice.products.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => generatePDF(invoice)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first invoice.
            </p>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={resetForm} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Create New Invoice</h3>
                    <img 
                      src="/SPECTRA_LOGO_NEW.png" 
                      alt="Spectra Solar Solutions" 
                      className="h-10 w-auto"
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Customer</label>
                        <select
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.customerId}
                          onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                        >
                          <option value="">Select a customer</option>
                          {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name} - {customer.address}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Installation Date</label>
                        <input
                          type="date"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.installationDate}
                          onChange={(e) => setFormData({...formData, installationDate: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company Address</label>
                        <textarea
                          rows={2}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.companyAddress}
                          onChange={(e) => setFormData({...formData, companyAddress: e.target.value})}
                          placeholder="Enter company address"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">GST Number</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.gstNumber}
                          onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                          placeholder="Enter GST number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Signatory</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.signatory}
                          onChange={(e) => setFormData({...formData, signatory: e.target.value})}
                          placeholder="Enter signatory name"
                        />
                      </div>
                    </div>

                    {/* Products */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-medium text-gray-900">Products & Services</h4>
                        <button
                          type="button"
                          onClick={addProduct}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Item
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {formData.products.map((product, index) => (
                          <div key={index} className="grid grid-cols-12 gap-3 items-end">
                            <div className="col-span-5">
                              <label className="block text-sm font-medium text-gray-700">Product</label>
                              <select
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                value={product.productId}
                                onChange={(e) => updateProduct(index, 'productId', e.target.value)}
                              >
                                <option value="">Select product or enter custom</option>
                                {products.map(p => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                              {!product.productId && (
                                <input
                                  type="text"
                                  placeholder="Custom item name"
                                  className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  value={product.name}
                                  onChange={(e) => updateProduct(index, 'name', e.target.value)}
                                />
                              )}
                            </div>
                            
                            <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-700">Qty</label>
                              <input
                                type="number"
                                min="1"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                value={product.quantity}
                                onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value))}
                              />
                            </div>
                            
                            <div className="col-span-3">
                              <label className="block text-sm font-medium text-gray-700">Unit Cost (₹)</label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                value={product.unitCost}
                                onChange={(e) => updateProduct(index, 'unitCost', parseFloat(e.target.value))}
                              />
                            </div>
                            
                            <div className="col-span-2">
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  ₹{(product.quantity * product.unitCost).toFixed(2)}
                                </p>
                                {formData.products.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeProduct(index)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Tax Amount (₹)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={formData.taxes}
                            onChange={(e) => setFormData({...formData, taxes: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Subtotal:</span>
                            <span className="text-sm font-medium">₹{subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Tax:</span>
                            <span className="text-sm font-medium">₹{formData.taxes.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-base font-medium">Total:</span>
                            <span className="text-base font-bold">₹{total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Create Invoice
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedInvoice(null)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src="/SPECTRA_LOGO_NEW.png" 
                      alt="Spectra Solar Solutions" 
                      className="h-10 w-auto"
                    />
                    <h3 className="text-lg font-medium text-gray-900">Invoice #{selectedInvoice.id}</h3>
                  </div>
                  <button
                    onClick={() => generatePDF(selectedInvoice)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Customer</h4>
                      <p className="text-sm text-gray-900">{selectedInvoice.customerName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Installation Date</h4>
                      <p className="text-sm text-gray-900">
                        {format(new Date(selectedInvoice.installationDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Products & Services</h4>
                    <div className="space-y-2">
                      {selectedInvoice.products.map((product, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">Qty: {product.quantity} × ₹{product.unitCost}</p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            ₹{(product.quantity * product.unitCost).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Subtotal:</span>
                        <span className="text-sm font-medium">₹{selectedInvoice.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Tax:</span>
                        <span className="text-sm font-medium">₹{selectedInvoice.taxes.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-base font-medium">Total:</span>
                        <span className="text-base font-bold">₹{selectedInvoice.finalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedInvoice(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;