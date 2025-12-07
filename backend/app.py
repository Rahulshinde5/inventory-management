from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  # allow React frontend to call this API

DB_NAME = "inventory.db"


def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


# ---------- Helper: calculate current stock ----------
def get_current_stock_for_product(product_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT
            COALESCE(SUM(
                CASE
                    WHEN movement_type = 'IN' THEN qty
                    WHEN movement_type = 'OUT' THEN -qty
                END
            ), 0) AS current_stock
        FROM stock_movements
        WHERE product_id = ?
    """, (product_id,))
    row = cur.fetchone()
    conn.close()
    return row["current_stock"] if row else 0


# ---------- API: list products with current stock ----------
@app.route("/products", methods=["GET"])
def list_products():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM products")
    products = cur.fetchall()
    conn.close()

    result = []
    for p in products:
        current_stock = get_current_stock_for_product(p["id"])
        result.append({
            "id": p["id"],
            "sku": p["sku"],
            "name": p["name"],
            "category": p["category"],
            "cost_price": p["cost_price"],
            "selling_price": p["selling_price"],
            "reorder_level": p["reorder_level"],
            "current_stock": current_stock
        })
    return jsonify(result)


# ---------- API: add new product ----------
@app.route("/products", methods=["POST"])
def add_product():
    data = request.get_json()
    required = ["sku", "name", "category",
                "cost_price", "selling_price", "reorder_level"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing fields"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO products (sku, name, category, cost_price, selling_price, reorder_level)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            data["sku"],
            data["name"],
            data["category"],
            data["cost_price"],
            data["selling_price"],
            data["reorder_level"]
        ))
        conn.commit()
        product_id = cur.lastrowid
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "SKU already exists"}), 400

    conn.close()
    return jsonify({"message": "Product added", "id": product_id}), 201


# ---------- API: update product ----------
@app.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.get_json()
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Check if product exists
    cur.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    product = cur.fetchone()
    if not product:
        conn.close()
        return jsonify({"error": "Product not found"}), 404
    
    try:
        # Build update query dynamically based on provided fields
        update_fields = []
        update_values = []
        
        allowed_fields = ["sku", "name", "category", "cost_price", "selling_price", "reorder_level"]
        
        for field in allowed_fields:
            if field in data:
                update_fields.append(f"{field} = ?")
                update_values.append(data[field])
        
        if not update_fields:
            conn.close()
            return jsonify({"error": "No fields to update"}), 400
        
        update_values.append(product_id)
        
        query = f"UPDATE products SET {', '.join(update_fields)} WHERE id = ?"
        cur.execute(query, update_values)
        conn.commit()
        
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "SKU already exists"}), 400
    finally:
        conn.close()
    
    return jsonify({"message": "Product updated", "id": product_id}), 200


# ---------- API: delete product ----------
@app.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Check if product exists
    cur.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    product = cur.fetchone()
    if not product:
        conn.close()
        return jsonify({"error": "Product not found"}), 404
    
    try:
        # Delete stock movements first (foreign key constraint)
        cur.execute("DELETE FROM stock_movements WHERE product_id = ?", (product_id,))
        
        # Delete product
        cur.execute("DELETE FROM products WHERE id = ?", (product_id,))
        conn.commit()
        
    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
    
    return jsonify({"message": "Product deleted", "id": product_id}), 200


# ---------- API: record stock movement ----------
@app.route("/stock-movements", methods=["POST"])
def add_stock_movement():
    data = request.get_json()
    required = ["product_id", "movement_type", "qty"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing fields"}), 400

    if data["movement_type"] not in ["IN", "OUT"]:
        return jsonify({"error": "movement_type must be IN or OUT"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    # check product exists
    cur.execute("SELECT id FROM products WHERE id = ?", (data["product_id"],))
    product = cur.fetchone()
    if not product:
        conn.close()
        return jsonify({"error": "Invalid product_id"}), 400

    cur.execute("""
        INSERT INTO stock_movements (product_id, movement_type, qty, note)
        VALUES (?, ?, ?, ?)
    """, (
        data["product_id"],
        data["movement_type"],
        data["qty"],
        data.get("note", "")
    ))
    conn.commit()
    conn.close()
    return jsonify({"message": "Stock movement recorded"}), 201


# ---------- API: summary ----------
@app.route("/summary", methods=["GET"])
def get_summary():
    conn = get_db_connection()
    cur = conn.cursor()

    # total items (number of products)
    cur.execute("SELECT COUNT(*) as cnt FROM products")
    total_items = cur.fetchone()["cnt"]

    # low stock + total inventory value
    cur.execute("SELECT id, reorder_level, cost_price FROM products")
    products = cur.fetchall()

    low_stock_count = 0
    total_inventory_value = 0.0

    for p in products:
        current_stock = get_current_stock_for_product(p["id"])
        if current_stock <= p["reorder_level"]:
            low_stock_count += 1

        total_inventory_value += p["cost_price"] * current_stock

    conn.close()

    return jsonify({
        "total_items": total_items,
        "low_stock_count": low_stock_count,
        "total_inventory_value": total_inventory_value
    })


if __name__ == "__main__":
    app.run(debug=True)
