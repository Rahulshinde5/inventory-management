import React from "react";

const ProductTable = ({ products, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return <div className="loading">Loading products...</div>;
  }

  if (!products || products.length === 0) {
    return <div className="no-products">No products available. Add your first product!</div>;
  }

  return (
    <div className="table-container">
      <table className="products-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Category</th>
            <th>Cost Price</th>
            <th>Selling Price</th>
            <th>Current Stock</th>
            <th>Reorder Level</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isLow = product.current_stock <= product.reorder_level;
            return (
              <tr key={product.id} className={isLow ? "low-stock" : ""}>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.category || "-"}</td>
                <td>₹{product.cost_price?.toFixed(2) || "0.00"}</td>
                <td>₹{product.selling_price?.toFixed(2) || "0.00"}</td>
                <td>{product.current_stock}</td>
                <td>{product.reorder_level}</td>
                <td>
                  {isLow ? (
                    <span className="low-stock-badge">Low Stock</span>
                  ) : (
                    <span style={{ color: "#28a745", fontWeight: "600" }}>OK</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => onEdit(product)}
                      title="Edit product"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => onDelete(product)}
                      title="Delete product"
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
