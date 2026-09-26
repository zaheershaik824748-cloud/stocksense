# StockSense — Real-Time Modular Inventory Management System (IMS)

StockSense is an enterprise-grade, real-time, modular Inventory Management System inspired by Odoo's inventory philosophy. It digitizes and streamlines all stock-related operations within a business, replacing manual registers, Excel spreadsheets, and scattered tracking methods with a centralized, responsive web application.

---

## 🎯 Target Users & Persona Scopes

| Role | Responsibilities & Capabilities |
| :--- | :--- |
| **Inventory Managers** | Manage incoming & outgoing stock, configure minimum/maximum buffer reordering rules, oversee suppliers/vendors, reconcile inventory adjustments, and architect multi-warehouse locations. |
| **Warehouse Staff** | Execute physical warehouse floor operations: pick items, pack shipments, conduct internal stock movements between racks/floors, and perform physical inventory counts. |

---

## 🚀 Key Feature Matrix (Matching Problem Statement Specifications)

### 1. Authentication & Security
- **Sign In / Sign Up**: Email-based authentication with assigned roles (*Inventory Manager* vs *Warehouse Staff*).
- **OTP-Based Password Reset**: Interactive 6-digit OTP code generation and verification workflow.
- **Role Switcher**: Live in-app toggle between *Inventory Manager* and *Warehouse Staff* to test role-specific workflows.
- **Left Sidebar Profile Menu**: Quick access to *My Profile*, active persona switcher, and *Logout*.

### 2. Dashboard View & KPIs
- **Real-Time KPIs**:
  1. *Total Products in Stock* (SKU count and total unit valuation)
  2. *Low Stock / Out of Stock Items* (Real-time threshold monitoring with warning badges)
  3. *Pending Receipts* (Incoming vendor shipments awaiting validation)
  4. *Pending Deliveries* (Outgoing customer orders undergoing picking/packing)
  5. *Internal Transfers Scheduled* (Company movements between facilities)
- **Dynamic Multi-Filters**:
  - **By Document Type**: All, Receipts, Delivery Orders, Internal Transfers, Stock Adjustments
  - **By Status**: Draft, Waiting, Ready, Done, Canceled
  - **By Warehouse or Location**: Main Warehouse, Production Hub, Main Store, Rack A, Rack B, Production Rack, Shipping Bay
  - **By Product Category**: Raw Materials, Finished Goods, Metal & Hardware, Furniture, Packaging

### 3. Product Management (Navigation #1)
- **Create & Update Products**:
  - Name (e.g., *Steel Rods*, *Ergonomic Office Chairs*, *Industrial Raw Steel*)
  - SKU / Code (e.g., `STL-ROD-01`, `CHR-ERG-02`, `STL-RAW-100`)
  - Category assignment
  - Unit of Measure (UoM: *Units*, *kg*, *m*, *Boxes*, *Liters*)
  - Initial stock allocation (optional with destination storage location)
  - Unit price, minimum alert quantity, and maximum target quantity
- **Stock Availability Per Location**: Matrix view breaking down stock quantities across all warehouses, storage bays, and floor racks.
- **Product Categories**: Category manager with custom color tags and active product counters.
- **Reordering Rules**: Automated minimum and maximum buffer rules with a **1-Click "Order Now"** trigger that automatically schedules a restock receipt.

### 4. Operations (Navigation #2)
1. **Receipts (Incoming Goods)**:
   - Used when items arrive from vendors.
   - Flow: Create receipt → Add supplier & line items → Input quantities received → **Validate**.
   - *Validation automatically increases location stock and records an audit log in the Stock Ledger.*
   - Example: Receive 50 units of "Steel Rods" → `Stock +50`.
2. **Delivery Orders (Outgoing Goods)**:
   - Used when items leave for customer shipment.
   - Flow: `1. Pick Items` → `2. Pack Items` → `3. Validate`.
   - Checks stock availability and prevents dispatch of unavailable inventory.
   - *Validation automatically decreases stock and logs a shipment in the Stock Ledger.*
   - Example: Sales order for 10 chairs → `Chairs −10`.
3. **Internal Transfers**:
   - Move stock inside the company across locations:
     - *Main Warehouse → Production Floor*
     - *Rack A → Rack B*
     - *Warehouse 1 → Warehouse 2*
   - *Validation decreases source location and increases destination location while company total stock remains identical.*
4. **Stock Adjustments**:
   - Reconcile mismatches between **Recorded Stock** and **Physical Count**.
   - Select product and location → view system recorded quantity → enter counted quantity → system calculates difference (+ or −).
   - Reason categorization: *Damaged Items*, *Count Mismatch*, *Loss/Theft*, *Found Items*, *Annual Audit*.
   - Example: 3 kg steel damaged → `Stock −3` logged in ledger.

### 5. Move History & Stock Ledger (Navigation #3)
- Traceability log capturing every single inventory modification across all documents.
- Includes timestamp, document reference, document type, product SKU, source location, destination location, signed quantity, author, and notes.
- Instant search, document filter, product filter, and **CSV Export** functionality.

### 6. Settings & Multi-Warehouse Architecture (Navigation #6)
- Manage multiple physical facilities (e.g., `WH1` - *Main Warehouse*, `WH2` - *Production & Logistics Hub*).
- Define internal storage locations (`WH1/MAIN-STORE`, `WH1/RACK-A`, `WH1/RACK-B`, `WH2/PROD-FLOOR`, `WH2/PROD-RACK`, `WH2/SHIPPING`).

### 7. Interactive 4-Step Problem Statement Walkthrough Modal
- Includes a dedicated **"PDF Flow Walkthrough"** simulator button.
- Automates the 4-step sequence from PDF Pages 3 & 4 with live visual feedback:
  1. **Step 1**: Receive 100 kg Steel from Vendor (`Stock: +100`)
  2. **Step 2**: Internal transfer: Main Store → Production Rack (`40 kg moved`)
  3. **Step 3**: Deliver finished goods to customer (`Stock: −20`)
  4. **Step 4**: Adjust damaged items (`3 kg damaged → Stock: −3`)

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Custom Enterprise Odoo-inspired UI
- **Icons**: Lucide React
- **Build Tool**: Vite 8 with `@vitejs/plugin-react` and `@tailwindcss/vite`
- **State Management**: Reactive React Context with `localStorage` persistence and pre-seeded sample data

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Launch

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run development server with Hot Module Replacement
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

Open your browser at `http://localhost:5173` to explore StockSense!
