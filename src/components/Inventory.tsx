import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Product } from '../types';
import { Plus, Search, Edit, Trash2, Download, AlertTriangle, Package } from 'lucide-react';

const Inventory: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, exportData } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    vendor: '',
    unitCost: 0,
    minThreshold: 0
  });

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(product => product.quantity <= product.minThreshold);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: 0,
      vendor: '',
      unitCost: 0,
      minThreshold: 0
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      vendor: product.vendor,
      unitCost: product.unitCost,
      minThreshold: product.minThreshold
    });
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return { status: 'out-of-stock', color: 'bg-red-100 text-red-800' };
    if (product.quantity <= product.minThreshold) return { status: 'low-stock', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'in-stock', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage your solar equipment inventory
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => exportData('products')}
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
            Add Product
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Low Stock Alert
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{lowStockProducts.length} product(s) are running low on stock:</p>
                <ul className="list-disc list-inside mt-1">
                  {lowStockProducts.slice(0, 3).map(product => (
                    <li key={product.id}>{product.name} - {product.quantity} remaining</li>
                  ))}
                  {lowStockProducts.length > 3 && (
                    <li>...and {lowStockProducts.length - 3} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          return (
            <div key={product.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                      {stockStatus.status.replace('-', ' ')}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {product.quantity} units
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Vendor</p>
                    <p className="font-medium text-gray-900 truncate">{product.vendor}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Unit Cost</p>
                                          <p className="font-medium text-gray-900">₹{product.unitCost}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Min Threshold</p>
                    <p className="font-medium text-gray-900">{product.minThreshold} units</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Value</p>
                    <p className="font-medium text-gray-900">
                      ₹{(product.quantity * product.unitCost).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new product to your inventory.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={resetForm} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                          type="text"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          placeholder="e.g., Solar Panels, Inverters"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Vendor</label>
                        <input
                          type="text"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.vendor}
                          onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                          type="number"
                          min="0"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.quantity}
                          onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Unit Cost (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.unitCost}
                          onChange={(e) => setFormData({...formData, unitCost: parseFloat(e.target.value)})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Min Threshold</label>
                        <input
                          type="number"
                          min="0"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.minThreshold}
                          onChange={(e) => setFormData({...formData, minThreshold: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingProduct ? 'Update' : 'Add'} Product
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
    </div>
  );
};

export default Inventory;