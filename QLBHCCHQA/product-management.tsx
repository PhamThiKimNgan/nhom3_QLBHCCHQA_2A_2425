import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, AlertCircle, CheckCircle, Upload, X } from 'lucide-react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [actionLogs, setActionLogs] = useState([]);
  const [filters, setFilters] = useState({
    size: '',
    color: '',
    priceMin: '',
    priceMax: '',
    category: ''
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const [productForm, setProductForm] = useState({
    code: '',
    name: '',
    size: '',
    color: '',
    price: '',
    quantity: '',
    category: '',
    imageUrl: '',
    imageFile: null
  });

  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Toys'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown'];

  // Initialize with sample data
  useEffect(() => {
    const sampleProducts = [
      { id: 1, code: 'ELC001', name: 'Smartphone', size: 'One Size', color: 'Black', price: 699, quantity: 25, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop&crop=center' },
      { id: 2, code: 'CLT001', name: 'T-Shirt', size: 'M', color: 'Blue', price: 29.99, quantity: 100, category: 'Clothing', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop&crop=center' },
      { id: 3, code: 'HG001', name: 'Garden Hose', size: 'L', color: 'Green', price: 45.50, quantity: 15, category: 'Home & Garden', imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=150&h=150&fit=crop&crop=center' }
    ];
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const logAction = (action, productCode, details) => {
    const log = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      action,
      productCode,
      details
    };
    setActionLogs(prev => [log, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  const isCodeUnique = (code, excludeId = null) => {
    return !products.some(product => product.code === code && product.id !== excludeId);
  };

  const resetForm = () => {
    setProductForm({
      code: '',
      name: '',
      size: '',
      color: '',
      price: '',
      quantity: '',
      category: '',
      imageUrl: '',
      imageFile: null
    });
    setEditingProduct(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setProductForm(prev => ({
            ...prev,
            imageFile: file,
            imageUrl: event.target.result
          }));
        };
        reader.readAsDataURL(file);
      } else {
        showNotification('Please select a valid image file', 'error');
      }
    }
  };

  const removeImage = () => {
    setProductForm(prev => ({
      ...prev,
      imageFile: null,
      imageUrl: ''
    }));
  };

  const handleSubmit = () => {
    
    if (!isCodeUnique(productForm.code, editingProduct?.id)) {
      showNotification('Product code must be unique!', 'error');
      return;
    }

    if (editingProduct) {
      // Edit existing product
      const updatedProducts = products.map(product =>
        product.id === editingProduct.id
          ? { ...product, ...productForm, price: parseFloat(productForm.price), quantity: parseInt(productForm.quantity) }
          : product
      );
      setProducts(updatedProducts);
      logAction('EDIT', productForm.code, `Updated product: ${productForm.name}`);
      showNotification('Product updated successfully!', 'success');
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        ...productForm,
        price: parseFloat(productForm.price),
        quantity: parseInt(productForm.quantity)
      };
      setProducts(prev => [...prev, newProduct]);
      logAction('ADD', productForm.code, `Added new product: ${productForm.name}`);
      showNotification('Product added successfully!', 'success');
    }

    resetForm();
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      code: product.code,
      name: product.name,
      size: product.size,
      color: product.color,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category,
      imageUrl: product.imageUrl || '',
      imageFile: null
    });
    setShowModal(true);
  };

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
      logAction('DELETE', product.code, `Deleted product: ${product.name}`);
      showNotification('Product deleted successfully!', 'success');
    }
  };

  const applyFilters = () => {
    let filtered = products;

    if (filters.size) {
      filtered = filtered.filter(product => product.size === filters.size);
    }
    if (filters.color) {
      filtered = filtered.filter(product => product.color === filters.color);
    }
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }
    if (filters.priceMin) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.priceMax));
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setFilters({
      size: '',
      color: '',
      priceMin: '',
      priceMax: '',
      category: ''
    });
    setFilteredProducts(products);
  };

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Product Management System</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {notification.message}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <select
              value={filters.size}
              onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Sizes</option>
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>

            <select
              value={filters.color}
              onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Colors</option>
              {colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={filters.priceMin}
              onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={filters.priceMax}
              onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={clearFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Products ({filteredProducts.length} of {products.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`${product.imageUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full text-gray-400 text-xs text-center`}>
                          No Image
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.size}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 bg-${product.color.toLowerCase()}-500`}></div>
                        {product.color}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products found matching your filters.
              </div>
            )}
          </div>
        </div>

        {/* Action Logs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Action Logs</h2>
          <div className="max-h-64 overflow-y-auto">
            {actionLogs.length === 0 ? (
              <p className="text-gray-500">No actions logged yet.</p>
            ) : (
              <div className="space-y-2">
                {actionLogs.map((log) => (
                  <div key={log.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  
                  {/* Image Upload Area */}
                  <div className="space-y-4">
                    {!productForm.imageUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="w-12 h-12 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600 mb-1">Click to upload an image</span>
                          <span className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={productForm.imageUrl}
                          alt="Product preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    
                    {/* Alternative: URL Input */}
                    <div className="text-center text-sm text-gray-500">
                      or
                    </div>
                    
                    <div>
                      <input
                        type="url"
                        value={productForm.imageFile ? '' : productForm.imageUrl}
                        onChange={(e) => setProductForm(prev => ({ ...prev, imageUrl: e.target.value, imageFile: null }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Or paste image URL here"
                        disabled={!!productForm.imageFile}
                      />
                    </div>
                  </div>
                </div>

                <div>
                        <span className={`inline-block px-2 py-1 text-xs rounded mr-2 ${
                          log.action === 'ADD' ? 'bg-green-100 text-green-800' :
                          log.action === 'EDIT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {log.action}
                        </span>
                        <span className="font-medium">{log.productCode}</span>
                      </div>
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Code</label>
                  <input
                    type="text"
                    value={productForm.code}
                    onChange={(e) => setProductForm(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                    <select
                      value={productForm.size}
                      onChange={(e) => setProductForm(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Size</option>
                      {sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <select
                      value={productForm.color}
                      onChange={(e) => setProductForm(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Color</option>
                      {colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={productForm.quantity}
                      onChange={(e) => setProductForm(prev => ({ ...prev, quantity: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;