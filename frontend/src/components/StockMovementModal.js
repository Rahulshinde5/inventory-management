import React, { useState } from "react";

const StockMovementModal = ({ isOpen, onClose, onSubmit, isLoading, products }) => {
  const [formData, setFormData] = useState({
    product_id: "",
    movement_type: "IN",
    qty: "",
    note: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Product ID validation
    if (!formData.product_id) {
      newErrors.product_id = "Please select a product";
    }

    // Quantity validation
    if (!formData.qty) {
      newErrors.qty = "Quantity is required";
    } else if (isNaN(formData.qty) || Number(formData.qty) <= 0) {
      newErrors.qty = "Quantity must be a positive number";
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
        product_id: Number(formData.product_id),
        qty: Number(formData.qty),
      });

      setFormData({
        product_id: "",
        movement_type: "IN",
        qty: "",
        note: "",
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({
      product_id: "",
      movement_type: "IN",
      qty: "",
      note: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Record Stock Movement</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className={`form-group ${errors.product_id ? "error" : ""}`}>
              <label htmlFor="product_id">Product *</label>
              <select
                id="product_id"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">-- Select a Product --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (SKU: {product.sku})
                  </option>
                ))}
              </select>
              {errors.product_id && (
                <div className="error-message">⚠ {errors.product_id}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="movement_type">Movement Type *</label>
              <select
                id="movement_type"
                name="movement_type"
                value={formData.movement_type}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="IN">Stock In</option>
                <option value="OUT">Stock Out</option>
              </select>
            </div>

            <div className={`form-group ${errors.qty ? "error" : ""}`}>
              <label htmlFor="qty">Quantity *</label>
              <input
                id="qty"
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                placeholder="0"
                step="1"
                disabled={isLoading}
              />
              {errors.qty && <div className="error-message">⚠ {errors.qty}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="note">Note (Optional)</label>
              <input
                id="note"
                type="text"
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="e.g., Purchase order #123"
                disabled={isLoading}
              />
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
              {isLoading ? "Recording..." : "Record Movement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockMovementModal;
