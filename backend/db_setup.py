import sqlite3

def init_db():
    conn = sqlite3.connect("inventory.db")
    c = conn.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sku TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category TEXT,
        cost_price REAL NOT NULL,
        selling_price REAL NOT NULL,
        reorder_level INTEGER NOT NULL
    );
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS stock_movements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        movement_type TEXT CHECK(movement_type IN ('IN', 'OUT')) NOT NULL,
        qty INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        note TEXT,
        FOREIGN KEY(product_id) REFERENCES products(id)
    );
    """)

    conn.commit()
    conn.close()
    print("Database initialized.")

if __name__ == "__main__":
    init_db()

