# 📦 Mini Inventory Manager

A modern, responsive React-based inventory management system with real-time product tracking, stock movement recording, and comprehensive inventory analytics.

## 🚀 Features

- **Product Management**
  - Add new products with SKU, name, category, cost & selling prices
  - Edit existing products with validation
  - Delete products (with cascade deletion of stock movements)
  - SKU uniqueness validation

- **Inventory Tracking**
  - Real-time stock level monitoring
  - Low stock alerts with visual highlighting
  - Stock movement recording (IN/OUT)
  - Product categorization and pricing

- **Summary Dashboard**
  - Total items in stock (count)
  - Low stock items count
  - Total inventory value (cost-based)
  - Beautiful gradient card UI

- **User Experience**
  - Modal-based operations (no page reloads)
  - Click-outside-to-close modals
  - Form validation with inline error messages
  - Auto-dismissing notifications (3 seconds)
  - Success and error states
  - Responsive design (mobile, tablet, desktop)
  - Loading states during API calls

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SummaryCard.js          # Summary stats card component
│   │   ├── ProductTable.js         # Products table with edit/delete actions
│   │   ├── ProductModal.js         # Add product modal with validation
│   │   ├── EditProductModal.js     # Edit product modal with validation
│   │   └── StockMovementModal.js   # Record stock movement modal
│   ├── App.js                      # Main app component with state management
│   ├── App.css                     # Comprehensive styling (550+ lines)
│   ├── index.js                    # Entry point
│   └── index.css                   # Global styles
├── public/                         # Static assets
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## 🛠️ Tech Stack

- **React** 19.2.1 - UI library
- **Axios** 1.13.2 - HTTP client for API calls
- **CSS3** - Responsive styling with flexbox and grid

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend Flask API running on `http://127.0.0.1:5000`

### Setup Steps

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Ensure backend is running:**
   ```bash
   cd ../backend
   python app.py
   ```
   The backend should be running on `http://127.0.0.1:5000`

4. **Start the development server:**
   ```bash
   cd ../frontend
   npm start
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage Guide

### Adding a Product

1. Click **"+ Operations"** button (top-right)
2. Select **"Add Product"**
3. Fill in all required fields:
   - SKU (must be unique)
   - Product Name
   - Category (optional)
   - Cost Price
   - Selling Price
   - Reorder Level
4. Click **"Add Product"** button
5. See success notification and product appears in table

### Editing a Product

1. Find the product in the table
2. Click the **✎ (Edit)** button
3. Modify the fields as needed
4. Click **"Update Product"** button
5. See success notification with updated data

### Deleting a Product

1. Find the product in the table
2. Click the **🗑 (Delete)** button
3. Confirm deletion in the dialog
4. All associated stock movements will be deleted
5. See success notification

### Recording Stock Movement

1. Click **"+ Operations"** button (top-right)
2. Select **"Record Movement"**
3. Select a product from dropdown
4. Choose movement type:
   - **IN** - Stock received/purchased
   - **OUT** - Stock sold/used
5. Enter quantity
6. Add optional note (e.g., PO #123)
7. Click **"Record Movement"** button
8. Summary updates automatically

### Understanding the Dashboard

- **Summary Cards** (Top):
  - Total Items: Count of all products with stock > 0
  - Low Stock Items: Count of products at or below reorder level
  - Total Inventory Value: Sum of (cost_price × current_stock)

- **Products Table**:
  - Shows all products with current stock levels
  - Low stock items highlighted in red
  - Status badge shows "Low Stock" or "OK"
  - Action buttons for edit and delete

## 📋 API Integration

The frontend communicates with backend API endpoints:

### Products
- `GET /products` - Get all products with current stock
- `POST /products` - Add new product
- `PUT /products/<id>` - Update product
- `DELETE /products/<id>` - Delete product (cascades to movements)

### Stock Movements
- `POST /stock-movements` - Record stock movement (IN/OUT)

### Summary
- `GET /summary` - Get inventory summary stats

## ✨ Component Details

### App.js
Main component managing:
- Product and summary data fetching
- Modal states (add, edit, movement, delete confirmation)
- Form submission handling
- Notification state (auto-dismisses after 3 seconds)
- Error handling

### SummaryCard.js
Displays a single metric card with:
- Label (uppercase, spaced)
- Value (large, prominent)
- Color variant (blue, green, orange)
- Gradient background with hover effect

### ProductTable.js
Renders products in table format with:
- Column headers (SKU, Name, Category, Prices, Stock, Status)
- Low stock highlighting
- Status badges
- Edit/Delete action buttons
- Loading state with spinner
- Empty state message

### ProductModal.js
Form for adding products with:
- 6 input fields with labels
- Real-time validation on change
- Error message display
- Required field indicators (*)
- Submit and cancel buttons
- Loading state button

### EditProductModal.js
Form for editing products with:
- Pre-populated product data
- Same validation as ProductModal
- SKU uniqueness check (excludes current product)
- Dynamic form reset on modal open/close

### StockMovementModal.js
Form for recording stock movements with:
- Product dropdown (shows SKU for clarity)
- Movement type selector (IN/OUT)
- Quantity input
- Optional note field
- Validation for required fields

## 🎨 Styling Features

The app uses a comprehensive CSS system with:

- **Color Scheme**:
  - Primary Blue: `#007bff`
  - Success Green: `#28a745`
  - Danger Red: `#f5576c`
  - Light Gray: `#f5f5f5`

- **Responsive Breakpoints**:
  - Desktop: Full layout
  - Tablet (768px): Adjusted spacing and font sizes
  - Mobile (480px): Single column, full-width buttons

- **Animations**:
  - Notification slide-in/out (0.3s)
  - Modal fade-in (0.2s) and slide-up (0.3s)
  - Button hover scale and shadow effects
  - Spinner rotation animation

## 📱 Responsive Design

The application is fully responsive:
- **Desktop**: Multi-column layout with full feature set
- **Tablet**: Adjusted summary cards, readable table
- **Mobile**: Single column, full-width inputs and buttons, collapsed navigation

## 🔍 Form Validation

All forms include real-time validation:

**Product Fields**:
- SKU: Required, unique
- Name: Required, non-empty
- Cost Price: Required, positive number
- Selling Price: Required, positive number
- Reorder Level: Required, non-negative number

**Stock Movement**:
- Product: Required, must select from dropdown
- Quantity: Required, positive number

Validation errors display inline with ⚠ icon.

## 🚀 Building for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` folder. The build is minified and ready for deployment.

## 🐛 Troubleshooting

### Backend connection error
- Ensure Flask backend is running on `http://127.0.0.1:5000`
- Check CORS is enabled in backend (`CORS(app)`)

### Notifications not appearing
- Notifications auto-dismiss after 3 seconds
- Check browser console for API errors

### Validation errors
- Ensure all required fields are filled
- SKU must be unique (check existing products)
- Prices must be positive numbers

### Modal not closing
- Click the ✕ button in modal header
- Click outside the modal overlay
- Successful submission auto-closes the modal

## 📝 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is irreversible!** Ejects from Create React App and gives full control over build configuration

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [Axios Documentation](https://axios-http.com/)
- [MDN Web Docs - CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

## 📄 License

This project is part of the Mini Inventory Manager application.

## 👤 Author

Built as a modern inventory management solution with React and Flask.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
