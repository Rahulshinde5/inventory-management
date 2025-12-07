import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import SummaryCard from "./components/SummaryCard";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import EditProductModal from "./components/EditProductModal";
import StockMovementModal from "./components/StockMovementModal";

const API_BASE = "http://127.0.0.1:5000";

function App() {
  // Data states
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showOperationsDropdown, setShowOperationsDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form submission states
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isSubmittingMovement, setIsSubmittingMovement] = useState(false);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Load initial data
  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [prodRes, sumRes] = await Promise.all([
        axios.get(`${API_BASE}/products`),
        axios.get(`${API_BASE}/summary`),
      ]);
      setProducts(prodRes.data);
      setSummary(sumRes.data);
    } catch (err) {
      console.error(err);
      showNotification("Error loading data", "error");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-dismiss notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Show notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  // Handle add product
  const handleAddProduct = async (productData) => {
    setIsSubmittingProduct(true);
    try {
      await axios.post(`${API_BASE}/products`, productData);
      showNotification("✓ Product added successfully!", "success");
      setShowProductModal(false);
      await loadData();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        showNotification("SKU already exists. Please use a unique SKU.", "error");
      } else {
        showNotification("Error adding product. Please try again.", "error");
      }
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  // Handle update product
  const handleUpdateProduct = async (productId, productData) => {
    setIsSubmittingProduct(true);
    try {
      await axios.put(`${API_BASE}/products/${productId}`, productData);
      showNotification("✓ Product updated successfully!", "success");
      setShowEditModal(false);
      setSelectedProduct(null);
      await loadData();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        showNotification("SKU already exists. Please use a unique SKU.", "error");
      } else {
        showNotification("Error updating product. Please try again.", "error");
      }
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = (product) => {
    setDeleteConfirm(product);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await axios.delete(`${API_BASE}/products/${deleteConfirm.id}`);
      showNotification("✓ Product deleted successfully!", "success");
      setDeleteConfirm(null);
      await loadData();
    } catch (err) {
      console.error(err);
      showNotification("Error deleting product. Please try again.", "error");
    }
  };

  // Handle stock movement
  const handleAddMovement = async (movementData) => {
    setIsSubmittingMovement(true);
    try {
      await axios.post(`${API_BASE}/stock-movements`, movementData);
      showNotification("✓ Stock movement recorded successfully!", "success");
      setShowMovementModal(false);
      await loadData();
    } catch (err) {
      console.error(err);
      showNotification("Error recording stock movement. Please try again.", "error");
    } finally {
      setIsSubmittingMovement(false);
    }
  };

  // Handle operations dropdown
  const handleOperationSelect = (operation) => {
    setShowOperationsDropdown(false);
    if (operation === "add-product") {
      setShowProductModal(true);
    } else if (operation === "add-movement") {
      setShowMovementModal(true);
    }
  };

  return (
    <div className="App">
      {/* Header with Operations Button */}
      <div className="app-header">
        <h1>📦 Mini Inventory Manager</h1>
        <div className="operations-container">
          <button
            className="operations-btn"
            onClick={() => setShowOperationsDropdown(!showOperationsDropdown)}
          >
            + Operations
          </button>
          {showOperationsDropdown && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => handleOperationSelect("add-product")}
              >
                Add Product
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleOperationSelect("add-movement")}
              >
                Record Movement
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Product?</h2>
              <button
                className="modal-close-btn"
                onClick={() => setDeleteConfirm(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: "1rem", color: "#555", marginBottom: "1rem" }}>
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
              </p>
              <p style={{ fontSize: "0.9rem", color: "#999" }}>
                All associated stock movements will also be deleted.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-delete-confirm"
                onClick={confirmDelete}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Section */}
      <section className="summary-section">
        {isLoadingData ? (
          <div className="loading">Loading summary...</div>
        ) : summary ? (
          <div className="summary-cards">
            <SummaryCard
              label="Total Items in Stock"
              value={summary.total_items}
              variant="blue"
            />
            <SummaryCard
              label="Low Stock Items"
              value={summary.low_stock_count}
              variant="green"
            />
            <SummaryCard
              label="Total Inventory Value"
              value={`₹${summary.total_inventory_value?.toFixed(2) || "0.00"}`}
              variant="orange"
            />
          </div>
        ) : null}
      </section>

      {/* Products Section */}
      <section className="products-section">
        <h2>Products</h2>
        <ProductTable
          products={products}
          isLoading={isLoadingData}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </section>

      {/* Modals */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSubmit={handleAddProduct}
        isLoading={isSubmittingProduct}
        products={products}
      />

      <EditProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleUpdateProduct}
        isLoading={isSubmittingProduct}
        product={selectedProduct}
        products={products}
      />

      <StockMovementModal
        isOpen={showMovementModal}
        onClose={() => setShowMovementModal(false)}
        onSubmit={handleAddMovement}
        isLoading={isSubmittingMovement}
        products={products}
      />
    </div>
  );
}

export default App;
