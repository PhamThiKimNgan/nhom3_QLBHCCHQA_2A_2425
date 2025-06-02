import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Filter,
  AlertCircle,
  CheckCircle,
  Upload,
  X,
} from "lucide-react";
import "./Product.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [actionLogs, setActionLogs] = useState([]);
  const [filters, setFilters] = useState({
    size: "",
    color: "",
    priceMin: "",
    priceMax: "",
    category: "",
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [productForm, setProductForm] = useState({
    code: "",
    name: "",
    size: "",
    color: "",
    price: "",
    quantity: "",
    category: "",
    imageUrl: "",
    imageFile: null,
  });

  const categories = [
    "T-Shirts",
    "Shirts",
    "Jeans",
    "Pants",
    "Shorts",
    "Dresses",
    "Skirts",
    "Jackets",
    "Coats",
    "Sweaters",
    "Hoodies",
    "Suits",
    "Underwear",
    "Socks",
    "Shoes",
    "Accessories",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
  const colors = [
    "Red",
    "Blue",
    "Green",
    "Black",
    "White",
    "Yellow",
    "Purple",
    "Orange",
    "Pink",
    "Brown",
  ];
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      showNotification("Không thể tải sản phẩm từ server!", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const logAction = (action, productCode, details) => {
    const log = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      action,
      productCode,
      details,
    };
    setActionLogs((prev) => [log, ...prev.slice(0, 49)]);
  };

  const isCodeUnique = (code, excludeId = null) => {
    return !products.some(
      (product) => product.code === code && product.id !== excludeId
    );
  };

  const resetForm = () => {
    setProductForm({
      code: "",
      name: "",
      size: "",
      color: "",
      price: "",
      quantity: "",
      category: "",
      imageUrl: "",
      imageFile: null,
    });
    setEditingProduct(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setProductForm((prev) => ({
            ...prev,
            imageFile: file,
            imageUrl: event.target.result,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        showNotification("Please select a valid image file", "error");
      }
    }
  };

  const removeImage = () => {
    setProductForm((prev) => ({
      ...prev,
      imageFile: null,
      imageUrl: "",
    }));
  };

  const handleSubmit = async () => {
    if (!isCodeUnique(productForm.code, editingProduct?.id)) {
      showNotification("Product code must be unique!", "error");
      return;
    }

    try {
      if (editingProduct) {
        // Update product
        await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...productForm,
            price: parseFloat(productForm.price),
            quantity: parseInt(productForm.quantity),
          }),
        });
        logAction(
          "EDIT",
          productForm.code,
          `Updated product: ${productForm.name}`
        );
        showNotification("Product updated successfully!", "success");
      } else {
        // Add product
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...productForm,
            price: parseFloat(productForm.price),
            quantity: parseInt(productForm.quantity),
          }),
        });
        logAction(
          "ADD",
          productForm.code,
          `Added new product: ${productForm.name}`
        );
        showNotification("Product added successfully!", "success");
      }
      fetchProducts();
      resetForm();
      setShowModal(false);
    } catch (err) {
      showNotification("Lỗi khi lưu sản phẩm!", "error");
    }
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
      imageUrl: product.imageUrl || "",
      imageFile: null,
    });
    setShowModal(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await fetch(`/api/products/${product.id}`, { method: "DELETE" });
        logAction("DELETE", product.code, `Deleted product: ${product.name}`);
        showNotification("Product deleted successfully!", "success");
        fetchProducts();
      } catch (err) {
        showNotification("Lỗi khi xóa sản phẩm!", "error");
      }
    }
  };

  // removed duplicate import of useCallback

  const applyFilters = useCallback(() => {
    let filtered = products;

    if (filters.size) {
      filtered = filtered.filter((product) => product.size === filters.size);
    }
    if (filters.color) {
      filtered = filtered.filter((product) => product.color === filters.color);
    }
    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }
    if (filters.priceMin) {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(filters.priceMin)
      );
    }
    if (filters.priceMax) {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(filters.priceMax)
      );
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const clearFilters = () => {
    setFilters({
      size: "",
      color: "",
      priceMin: "",
      priceMax: "",
      category: "",
    });
    setFilteredProducts(products);
  };

  useEffect(() => {
    applyFilters();
  }, [products, filters, applyFilters]);

  return (
    <div className="product-min-h-screen product-bg-gray-50 product-p-6">
      <div className="product-max-w-7xl product-mx-auto">
        {/* Header */}
        <div className="product-bg-white product-rounded-lg product-shadow-md product-p-6 product-mb-6">
          <div className="product-flex product-justify-between product-items-center">
            <h1 className="product-text-3xl product-font-bold product-text-gray-800">
              Hệ thống Quản lý Sản phẩm
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="product-bg-blue-600 hover:product-bg-blue-700 product-text-white product-px-4 product-py-2 product-rounded-lg product-flex product-items-center product-gap-2 product-transition-colors"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div
            className={`product-fixed product-top-4 product-right-4 product-p-4 product-rounded-lg product-shadow-lg product-z-50 product-flex product-items-center product-gap-2 ${
              notification.type === "success"
                ? "product-bg-green-500 product-text-white"
                : "product-bg-red-500 product-text-white"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {notification.message}
          </div>
        )}

        {/* Filters */}
        <div className="product-bg-white product-rounded-lg product-shadow-md product-p-6 product-mb-6">
          <div className="product-flex product-items-center product-gap-2 product-mb-4">
            <Filter size={20} className="product-text-gray-600" />
            <h2 className="product-text-xl product-font-semibold product-text-gray-800">
              Filters
            </h2>
          </div>
          <div className="product-grid product-grid-cols-1 md:product-grid-cols-3 lg:product-grid-cols-6 product-gap-4">
            <select
              value={filters.size}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, size: e.target.value }))
              }
              className="product-border product-border-gray-300 product-rounded-lg product-px-3 product-py-2 focus:product-ring-2 focus:product-ring-blue-500 focus:product-border-transparent"
            >
              <option value="">All Sizes</option>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <select
              value={filters.color}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, color: e.target.value }))
              }
              className="product-border product-border-gray-300 product-rounded-lg product-px-3 product-py-2 focus:product-ring-2 focus:product-ring-blue-500 focus:product-border-transparent"
            >
              <option value="">All Colors</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="product-border product-border-gray-300 product-rounded-lg product-px-3 product-py-2 focus:product-ring-2 focus:product-ring-blue-500 focus:product-border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={filters.priceMin}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priceMin: e.target.value }))
              }
              className="product-border product-border-gray-300 product-rounded-lg product-px-3 product-py-2 focus:product-ring-2 focus:product-ring-blue-500 focus:product-border-transparent"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={filters.priceMax}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priceMax: e.target.value }))
              }
              className="product-border product-border-gray-300 product-rounded-lg product-px-3 product-py-2 focus:product-ring-2 focus:product-ring-blue-500 focus:product-border-transparent"
            />

            <button
              onClick={clearFilters}
              className="product-bg-gray-500 hover:product-bg-gray-600 product-text-white product-px-4 product-py-2 product-rounded-lg product-transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="product-bg-white product-rounded-lg product-shadow-md product-overflow-hidden product-mb-6">
          <div className="product-px-6 product-py-4 product-border-b product-border-gray-200">
            <h2 className="product-text-xl product-font-semibold product-text-gray-800">
              Products ({filteredProducts.length} of {products.length})
            </h2>
          </div>
          <div className="product-overflow-x-auto">
            <table className="product-w-full">
              <thead className="product-bg-gray-50">
                <tr>
                  <th className="product-px-6 product-py-3 product-text-left product-text-xs product-font-medium product-text-gray-500 product-uppercase product-tracking-wider">
                    Image
                  </th>
                  <th className="product-px-6 product-py-3 product-text-left product-text-xs product-font-medium product-text-gray-500 product-uppercase product-tracking-wider">
                    Code
                  </th>
                  <th className="product-px-6 product-py-3 product-text-left product-text-xs product-font-medium product-text-gray-500 product-uppercase product-tracking-wider">
                    Name
                  </th>
                  <th className="product-px-6 product-py-3 product-text-left product-text-xs product-font-medium product-text-gray-500 product-uppercase product-tracking-wider">
                    Size
                  </th>
                  <th className="product-px-6 product-py-3 product-text-left product-text-xs product-font-medium product-text-gray-500 product-uppercase product-tracking-wider">
                    Color
                  </th>
                  <th className="product-px-6 product-py-3 product-text-left product-text-xs product-font-medium product-text-gray-500 product-uppercase product-tracking-wider">
                    Price
                  </th>
                  <th className="product-px-6 product-py-3 product-text-left product-text-xs product-font-medium product-text-gray-500 product-uppercase product-tracking-wider">
                    Quantity
                  </th>
                  <th className="product-px-6 product-py-3 product-text-left product-text-xs product-font-medium product-text-gray-500 product-uppercase product-tracking-wider">
                    Category
                  </th>
                  <th className="product-px-6 product-py-3 product-text-left product-text-xs product-font-medium product-text-gray-500 product-uppercase product-tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="product-bg-white product-divide-y product-divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:product-bg-gray-50">
                    <td className="product-px-6 product-py-4 product-whitespace-nowrap">
                      <div className="product-w-16 product-h-16 product-bg-gray-200 product-rounded-lg product-overflow-hidden product-flex product-items-center product-justify-center">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="product-w-full product-h-full product-object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`${
                            product.imageUrl ? "product-hidden" : "product-flex"
                          } product-items-center product-justify-center product-w-full product-h-full product-text-gray-400 product-text-xs product-text-center`}
                        >
                          No Image
                        </div>
                      </div>
                    </td>
                    <td className="product-px-6 product-py-4 product-whitespace-nowrap product-text-sm product-font-medium product-text-gray-900">
                      {product.code}
                    </td>
                    <td className="product-px-6 product-py-4 product-whitespace-nowrap product-text-sm product-text-gray-900">
                      {product.name}
                    </td>
                    <td className="product-px-6 product-py-4 product-whitespace-nowrap product-text-sm product-text-gray-900">
                      {product.size}
                    </td>
                    <td className="product-px-6 product-py-4 product-whitespace-nowrap product-text-sm product-text-gray-900">
                      <span className="product-inline-flex product-items-center">
                        <div
                          className={`product-w-4 product-h-4 product-rounded-full product-mr-2 product-bg-${product.color.toLowerCase()}-500`}
                        ></div>
                        {product.color}
                      </span>
                    </td>
                    <td className="product-px-6 product-py-4 product-whitespace-nowrap product-text-sm product-text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="product-px-6 product-py-4 product-whitespace-nowrap product-text-sm product-text-gray-900">
                      {product.quantity}
                    </td>
                    <td className="product-px-6 product-py-4 product-whitespace-nowrap product-text-sm product-text-gray-900">
                      {product.category}
                    </td>
                    <td className="product-px-6 product-py-4 product-whitespace-nowrap product-text-sm product-font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="product-text-blue-600 hover:product-text-blue-900 product-mr-3"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="product-text-red-600 hover:product-text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="product-text-center product-py-8 product-text-gray-500">
                No products found matching your filters.
              </div>
            )}
          </div>
        </div>

        {/* Action Logs */}
        <div className="product-bg-white product-rounded-lg product-shadow-md product-p-6">
          <h2 className="product-text-xl product-font-semibold product-text-gray-800 product-mb-4">
            Action Logs
          </h2>
          <div className="product-max-h-64 product-overflow-y-auto">
            {actionLogs.length === 0 ? (
              <p className="product-text-gray-500">No actions logged yet.</p>
            ) : (
              <div className="product-space-y-2">
                {actionLogs.map((log) => (
                  <div
                    key={log.id}
                    className="product-border-l-4 product-border-blue-500 product-pl-4 product-py-2 product-bg-gray-50 product-rounded"
                  >
                    <div className="product-flex product-justify-between product-items-start">
                      <div>
                        <span
                          className={`product-inline-block product-px-2 product-py-1 product-text-xs product-rounded product-mr-2 ${
                            log.action === "ADD"
                              ? "product-bg-green-100 product-text-green-800"
                              : log.action === "EDIT"
                              ? "product-bg-yellow-100 product-text-yellow-800"
                              : "product-bg-red-100 product-text-red-800"
                          }`}
                        >
                          {log.action}
                        </span>
                        <span className="product-font-medium">
                          {log.productCode}
                        </span>
                      </div>
                      <span className="product-text-xs product-text-gray-500">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="product-text-sm product-text-gray-600 product-mt-1">
                      {log.details}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="product-fixed product-inset-0 product-bg-black product-bg-opacity-50 product-flex product-items-center product-justify-center product-z-50 product-p-4">
            <div className="product-bg-white product-rounded-lg product-shadow-xl product-w-full product-max-w-md">
              <div className="product-px-6 product-py-4 product-border-b product-border-gray-200">
                <h3 className="product-text-lg product-font-semibold product-text-gray-800">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
              </div>
              <div className="product-p-6 product-space-y-4">
                <div>
                  <label className="product-block product-text-sm product-font-medium product-text-gray-700 product-mb-2">
                    Product Image
                  </label>
                  <div className="product-space-y-4">
                    {!productForm.imageUrl ? (
                      <div className="product-border-2 product-border-dashed product-border-gray-300 product-rounded-lg product-p-6 product-text-center hover:product-border-gray-400 product-transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="product-hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="product-cursor-pointer product-flex product-flex-col product-items-center"
                        >
                          <Upload className="product-w-12 product-h-12 product-text-gray-400 product-mb-2" />
                          <span className="product-text-sm product-text-gray-600 product-mb-1">
                            Click to upload an image
                          </span>
                          <span className="product-text-xs product-text-gray-400">
                            PNG, JPG, GIF up to 10MB
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="product-relative">
                        <img
                          src={productForm.imageUrl}
                          alt="Product preview"
                          className="product-w-full product-h-48 product-object-cover product-rounded-lg product-border"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="product-absolute product-top-2 product-right-2 product-bg-red-500 hover:product-bg-red-600 product-text-white product-rounded-full product-p-1 product-transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}

                    <div className="product-text-center product-text-sm product-text-gray-500">
                      or
                    </div>
                    <div>
                      <input
                        type="url"
                        value={
                          productForm.imageFile ? "" : productForm.imageUrl
                        }
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            imageUrl: e.target.value,
                            imageFile: null,
                          }))
                        }
                        className="product-w-full product-border product-border-gray-300 product-rounded-lg product-px-3 product-py-2 focus:product-ring-2 focus:product-ring-blue-500 focus:product-border-transparent"
                        placeholder="Or paste image URL here"
                        disabled={!!productForm.imageFile}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="product-block product-text-sm product-font-medium product-text-gray-700 product-mb-1">
                    Product Code
                  </label>
                  <input
                    type="text"
                    value={productForm.code}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        code: e.target.value,
                      }))
                    }
                    className="product-w-full product-border product-border-gray-300 product-rounded-lg product-px-3 product-py-2 focus:product-ring-2 focus:product-ring-blue-500 focus:product-border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="product-block product-text-sm product-font-medium product-text-gray-700 product-mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="product-w-full product-border product-border-gray-300 product-rounded-lg product-px-3 product-py-2 focus:product-ring-2 focus:product-ring-blue-500 focus:product-border-transparent"
                    required
                  />
                </div>

                <div className="product-grid product-grid-cols-2 product-gap-4">
                  <div>
                    <label className="product-block product-text-sm product-font-medium product-text-gray-700 product-mb-1">
                      Size
                    </label>
                    <select
                      value={productForm.size}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          size: e.target.value,
                        }))
                      }
                      className="product-w-full product-border product-border-gray-300 product-rounded-lg product-px-3 product-py-2 focus:product-ring-2 focus:product-ring-blue-500 focus:product-border-transparent"
                      required
                    >
                      <option value="">Select Size</option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="product-block product-text-sm product-font-medium product-text-gray-700 product-mb-1">
                      Color
                    </label>
                    <select
                      value={productForm.color}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          color: e.target.value,
                        }))
                      }
                      className="product-w-full product-border product-border-gray-300 product-rounded-lg product-px-3 product-py-2 focus:product-ring-2 focus:product-ring-blue-500 focus:product-border-transparent"
                      required
                    >
                      <option value="">Select Color</option>
                      {colors.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="product-grid product-grid-cols-2 product-gap-4">
                  <div>
                    <label className="product-block product-text-sm product-font-medium product-text-gray-700 product-mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      className="product-w-full product-border product-border-gray-300 product-rounded-lg product-px-3 product-py-2 focus:product-ring-2 focus:product-ring-blue-500 focus:product-border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="product-block product-text-sm product-font-medium product-text-gray-700 product-mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={productForm.quantity}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }))
                      }
                      className="product-w-full product-border product-border-gray-300 product-rounded-lg product-px-3 product-py-2 focus:product-ring-2 focus:product-ring-blue-500 focus:product-border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="product-block product-text-sm product-font-medium product-text-gray-700 product-mb-1">
                    Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="product-w-full product-border product-border-gray-300 product-rounded-lg product-px-3 product-py-2 focus:product-ring-2 focus:product-ring-blue-500 focus:product-border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="product-flex product-justify-end product-space-x-3 product-pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="product-px-4 product-py-2 product-text-gray-700 product-bg-gray-200 hover:product-bg-gray-300 product-rounded-lg product-transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="product-px-4 product-py-2 product-bg-blue-600 hover:product-bg-blue-700 product-text-white product-rounded-lg product-transition-colors"
                  >
                    {editingProduct ? "Update Product" : "Add Product"}
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

export default Product;
