import React, { useState } from "react";

const ProductModal = ({ isOpen, onClose, onSubmit, isLoading, products }) => {
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "",
    cost_price: "",
    selling_price: "",
    reorder_level: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // SKU validation
    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    } else if (products.some((p) => p.sku === formData.sku)) {
      newErrors.sku = "SKU already exists";
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    // Cost Price validation
    if (!formData.cost_price) {
      newErrors.cost_price = "Cost price is required";
    } else if (isNaN(formData.cost_price) || formData.cost_price <= 0) {
      newErrors.cost_price = "Cost price must be a positive number";
    }

    // Selling Price validation
    if (!formData.selling_price) {
      newErrors.selling_price = "Selling price is required";
    } else if (isNaN(formData.selling_price) || formData.selling_price <= 0) {
      newErrors.selling_price = "Selling price must be a positive number";
    }

    // Reorder Level validation
    if (!formData.reorder_level) {
      newErrors.reorder_level = "Reorder level is required";
    } else if (isNaN(formData.reorder_level) || formData.reorder_level < 0) {
      newErrors.reorder_level = "Reorder level must be a non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        cost_price: Number(formData.cost_price),
        selling_price: Number(formData.selling_price),
        reorder_level: Number(formData.reorder_level),
      });

      setFormData({
        sku: "",
        name: "",
        category: "",
        cost_price: "",
        selling_price: "",
        reorder_level: "",
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({
      sku: "",
      name: "",
      category: "",
      cost_price: "",
      selling_price: "",
      reorder_level: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className={`form-group ${errors.sku ? "error" : ""}`}>
              <label htmlFor="sku">SKU *</label>
              <input
                id="sku"
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g., SKU001"
                disabled={isLoading}
              />
              {errors.sku && <div className="error-message">⚠ {errors.sku}</div>}
            </div>

            <div className={`form-group ${errors.name ? "error" : ""}`}>
              <label htmlFor="name">Product Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Laptop"
                disabled={isLoading}
              />
              {errors.name && <div className="error-message">⚠ {errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Electronics"
                disabled={isLoading}
              />
            </div>

            <div className={`form-group ${errors.cost_price ? "error" : ""}`}>
              <label htmlFor="cost_price">Cost Price (₹) *</label>
              <input
                id="cost_price"
                type="number"
                name="cost_price"
                value={formData.cost_price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                disabled={isLoading}
              />
              {errors.cost_price && (
                <div className="error-message">⚠ {errors.cost_price}</div>
              )}
            </div>

            <div className={`form-group ${errors.selling_price ? "error" : ""}`}>
              <label htmlFor="selling_price">Selling Price (₹) *</label>
              <input
                id="selling_price"
                type="number"
                name="selling_price"
                value={formData.selling_price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                disabled={isLoading}
              />
              {errors.selling_price && (
                <div className="error-message">⚠ {errors.selling_price}</div>
              )}
            </div>

            <div className={`form-group ${errors.reorder_level ? "error" : ""}`}>
              <label htmlFor="reorder_level">Reorder Level *</label>
              <input
                id="reorder_level"
                type="number"
                name="reorder_level"
                value={formData.reorder_level}
                onChange={handleChange}
                placeholder="0"
                step="1"
                disabled={isLoading}
              />
              {errors.reorder_level && (
                <div className="error-message">⚠ {errors.reorder_level}</div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
