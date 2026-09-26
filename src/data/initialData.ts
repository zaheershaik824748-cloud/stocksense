import { 
  Product, 
  Warehouse, 
  Location, 
  Category, 
  ProductStock, 
  Receipt, 
  DeliveryOrder, 
  InternalTransfer, 
  StockAdjustment, 
  StockLedgerEntry, 
  User, 
  ReorderingRule 
} from '../types';

export const initialUser: User = {
  id: 'usr-001',
  name: 'Alex Morgan',
  email: 'alex.morgan@stocksense.io',
  role: 'Inventory Manager',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  warehouseId: 'wh-1'
};

export const initialWarehouses: Warehouse[] = [
  {
    id: 'wh-1',
    name: 'Main Warehouse',
    code: 'WH1',
    address: 'Bay 12, Northern Logistics Corridor, Sector 4'
  },
  {
    id: 'wh-2',
    name: 'Production & Logistics Hub',
    code: 'WH2',
    address: 'Facility 8, Eastside Industrial Complex'
  }
];

export const initialLocations: Location[] = [
  {
    id: 'loc-wh1-main',
    warehouseId: 'wh-1',
    name: 'Main Store',
    code: 'WH1/MAIN-STORE',
    type: 'internal'
  },
  {
    id: 'loc-wh1-rack-a',
    warehouseId: 'wh-1',
    name: 'Rack A',
    code: 'WH1/RACK-A',
    type: 'internal'
  },
  {
    id: 'loc-wh1-rack-b',
    warehouseId: 'wh-1',
    name: 'Rack B',
    code: 'WH1/RACK-B',
    type: 'internal'
  },
  {
    id: 'loc-wh2-prod-floor',
    warehouseId: 'wh-2',
    name: 'Production Floor',
    code: 'WH2/PROD-FLOOR',
    type: 'internal'
  },
  {
    id: 'loc-wh2-prod-rack',
    warehouseId: 'wh-2',
    name: 'Production Rack',
    code: 'WH2/PROD-RACK',
    type: 'internal'
  },
  {
    id: 'loc-wh2-shipping',
    warehouseId: 'wh-2',
    name: 'Shipping Bay',
    code: 'WH2/SHIPPING',
    type: 'internal'
  },
  {
    id: 'loc-partner-vendor',
    warehouseId: 'wh-1',
    name: 'Vendor Suppliers',
    code: 'PARTNER/VENDORS',
    type: 'vendor'
  },
  {
    id: 'loc-partner-customer',
    warehouseId: 'wh-2',
    name: 'Customer Delivery',
    code: 'PARTNER/CUSTOMERS',
    type: 'customer'
  },
  {
    id: 'loc-inventory-loss',
    warehouseId: 'wh-1',
    name: 'Inventory Scraps & Adjustments',
    code: 'VIRTUAL/SCRAP',
    type: 'inventory_loss'
  }
];

export const initialCategories: Category[] = [
  {
    id: 'cat-raw',
    name: 'Raw Materials',
    description: 'Bulk raw steel, sheets, rods, and unprocessed inputs',
    color: '#0284c7'
  },
  {
    id: 'cat-metal',
    name: 'Metal & Hardware',
    description: 'Fasteners, rods, brackets, structural steel components',
    color: '#7c3aed'
  },
  {
    id: 'cat-finished',
    name: 'Finished Goods',
    description: 'Ready-to-ship products and assembled machinery frames',
    color: '#059669'
  },
  {
    id: 'cat-furniture',
    name: 'Furniture',
    description: 'Commercial desks, ergonomic seating, and warehouse shelving',
    color: '#d97706'
  },
  {
    id: 'cat-packaging',
    name: 'Packaging Supplies',
    description: 'Corrugated cartons, industrial bubble film, strapping coils',
    color: '#4f46e5'
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-steel-rods',
    name: 'Steel Rods',
    sku: 'STL-ROD-01',
    categoryId: 'cat-metal',
    categoryName: 'Metal & Hardware',
    uom: 'Units',
    price: 450.0,
    reorderMin: 40,
    reorderMax: 200,
    initialStock: 120,
    description: 'Grade 304 stainless steel reinforcement rods (12mm dia, 3m length)',
    createdAt: '2026-09-10T08:00:00Z',
    updatedAt: '2026-09-24T14:30:00Z'
  },
  {
    id: 'prod-chairs',
    name: 'Ergonomic Office Chairs',
    sku: 'CHR-ERG-02',
    categoryId: 'cat-furniture',
    categoryName: 'Furniture',
    uom: 'Units',
    price: 7500.0,
    reorderMin: 15,
    reorderMax: 60,
    initialStock: 28,
    description: 'High-back mesh breathable lumbar support swivel task chairs',
    createdAt: '2026-09-12T09:15:00Z',
    updatedAt: '2026-09-25T11:00:00Z'
  },
  {
    id: 'prod-raw-steel',
    name: 'Industrial Raw Steel',
    sku: 'STL-RAW-100',
    categoryId: 'cat-raw',
    categoryName: 'Raw Materials',
    uom: 'kg',
    price: 85.0,
    reorderMin: 50,
    reorderMax: 500,
    initialStock: 240,
    description: 'High tensile structural carbon steel rolls and sheets',
    createdAt: '2026-09-08T10:00:00Z',
    updatedAt: '2026-09-26T09:00:00Z'
  },
  {
    id: 'prod-steel-frames',
    name: 'Steel Chassis Frames',
    sku: 'STL-FRM-05',
    categoryId: 'cat-finished',
    categoryName: 'Finished Goods',
    uom: 'Units',
    price: 12500.0,
    reorderMin: 12,
    reorderMax: 50,
    initialStock: 8, // Low stock on purpose to trigger alerts!
    description: 'Welded tubular steel industrial rack chassis frames',
    createdAt: '2026-09-15T12:00:00Z',
    updatedAt: '2026-09-25T16:45:00Z'
  },
  {
    id: 'prod-fasteners',
    name: 'M8 Heavy Duty Fasteners',
    sku: 'FST-HD-99',
    categoryId: 'cat-metal',
    categoryName: 'Metal & Hardware',
    uom: 'Boxes',
    price: 650.0,
    reorderMin: 25,
    reorderMax: 120,
    initialStock: 18, // Low stock on purpose to trigger alerts!
    description: 'Zinc plated metric hex flange head bolts and locknuts (Box of 200)',
    createdAt: '2026-09-18T10:30:00Z',
    updatedAt: '2026-09-24T18:10:00Z'
  }
];

export const initialProductStock: ProductStock[] = [
  // Steel Rods (Total = 120 Units)
  {
    id: 'stk-1',
    productId: 'prod-steel-rods',
    warehouseId: 'wh-1',
    locationId: 'loc-wh1-main',
    quantity: 70
  },
  {
    id: 'stk-2',
    productId: 'prod-steel-rods',
    warehouseId: 'wh-1',
    locationId: 'loc-wh1-rack-a',
    quantity: 30
  },
  {
    id: 'stk-3',
    productId: 'prod-steel-rods',
    warehouseId: 'wh-2',
    locationId: 'loc-wh2-prod-floor',
    quantity: 20
  },

  // Ergonomic Office Chairs (Total = 28 Units)
  {
    id: 'stk-4',
    productId: 'prod-chairs',
    warehouseId: 'wh-1',
    locationId: 'loc-wh1-main',
    quantity: 18
  },
  {
    id: 'stk-5',
    productId: 'prod-chairs',
    warehouseId: 'wh-1',
    locationId: 'loc-wh1-rack-b',
    quantity: 10
  },

  // Industrial Raw Steel (Total = 240 kg)
  {
    id: 'stk-6',
    productId: 'prod-raw-steel',
    warehouseId: 'wh-1',
    locationId: 'loc-wh1-main',
    quantity: 160
  },
  {
    id: 'stk-7',
    productId: 'prod-raw-steel',
    warehouseId: 'wh-2',
    locationId: 'loc-wh2-prod-rack',
    quantity: 80
  },

  // Steel Chassis Frames (Total = 8 Units) - Low stock!
  {
    id: 'stk-8',
    productId: 'prod-steel-frames',
    warehouseId: 'wh-2',
    locationId: 'loc-wh2-shipping',
    quantity: 8
  },

  // Fasteners (Total = 18 Boxes) - Low stock!
  {
    id: 'stk-9',
    productId: 'prod-fasteners',
    warehouseId: 'wh-1',
    locationId: 'loc-wh1-rack-a',
    quantity: 18
  }
];

export const initialReceipts: Receipt[] = [
  {
    id: 'rec-001',
    reference: 'WH/IN/00001',
    vendor: 'Apex Alloy & Steel Supplies',
    destinationWarehouseId: 'wh-1',
    destinationLocationId: 'loc-wh1-main',
    scheduledDate: '2026-09-24',
    status: 'done',
    items: [
      {
        id: 'ri-1',
        productId: 'prod-steel-rods',
        productName: 'Steel Rods',
        sku: 'STL-ROD-01',
        expectedQty: 50,
        receivedQty: 50,
        uom: 'Units'
      }
    ],
    notes: 'Received initial shipment in pristine condition. Validated into Main Store.',
    createdAt: '2026-09-24T09:00:00Z',
    validatedAt: '2026-09-24T14:30:00Z',
    createdByName: 'Alex Morgan'
  },
  {
    id: 'rec-002',
    reference: 'WH/IN/00002',
    vendor: 'Tata Steel International',
    destinationWarehouseId: 'wh-1',
    destinationLocationId: 'loc-wh1-main',
    scheduledDate: '2026-09-27',
    status: 'ready',
    items: [
      {
        id: 'ri-2',
        productId: 'prod-raw-steel',
        productName: 'Industrial Raw Steel',
        sku: 'STL-RAW-100',
        expectedQty: 100,
        receivedQty: 100,
        uom: 'kg'
      }
    ],
    notes: 'PO-9821 incoming bulk steel raw shipment awaiting receiving gate inspection.',
    createdAt: '2026-09-25T11:00:00Z',
    createdByName: 'Alex Morgan'
  },
  {
    id: 'rec-003',
    reference: 'WH/IN/00003',
    vendor: 'Nordic Fastener Works',
    destinationWarehouseId: 'wh-1',
    destinationLocationId: 'loc-wh1-rack-a',
    scheduledDate: '2026-09-29',
    status: 'waiting',
    items: [
      {
        id: 'ri-3',
        productId: 'prod-fasteners',
        productName: 'M8 Heavy Duty Fasteners',
        sku: 'FST-HD-99',
        expectedQty: 50,
        receivedQty: 0,
        uom: 'Boxes'
      }
    ],
    notes: 'Restock order pending vendor dispatch dispatch notification.',
    createdAt: '2026-09-26T08:30:00Z',
    createdByName: 'Alex Morgan'
  }
];

export const initialDeliveries: DeliveryOrder[] = [
  {
    id: 'del-001',
    reference: 'WH/OUT/00001',
    customer: 'Apex Workspace Interiors Inc.',
    sourceWarehouseId: 'wh-1',
    sourceLocationId: 'loc-wh1-main',
    scheduledDate: '2026-09-25',
    step: 'done',
    status: 'done',
    items: [
      {
        id: 'di-1',
        productId: 'prod-chairs',
        productName: 'Ergonomic Office Chairs',
        sku: 'CHR-ERG-02',
        demandQty: 10,
        pickedQty: 10,
        packedQty: 10,
        uom: 'Units'
      }
    ],
    notes: 'Sales order for 10 chairs -> Delivery order reduces chairs by 10.',
    createdAt: '2026-09-24T15:00:00Z',
    validatedAt: '2026-09-25T11:00:00Z',
    createdByName: 'Sarah Jenkins (Warehouse Staff)'
  },
  {
    id: 'del-002',
    reference: 'WH/OUT/00002',
    customer: 'Metro Construct & Fabrication',
    sourceWarehouseId: 'wh-2',
    sourceLocationId: 'loc-wh2-shipping',
    scheduledDate: '2026-09-27',
    step: 'packing',
    status: 'ready',
    items: [
      {
        id: 'di-2',
        productId: 'prod-steel-frames',
        productName: 'Steel Chassis Frames',
        sku: 'STL-FRM-05',
        demandQty: 4,
        pickedQty: 4,
        packedQty: 2,
        uom: 'Units'
      }
    ],
    notes: 'Order currently at packaging line stage. Scheduled for evening dispatch.',
    createdAt: '2026-09-25T14:20:00Z',
    createdByName: 'Alex Morgan'
  },
  {
    id: 'del-003',
    reference: 'WH/OUT/00003',
    customer: 'Kensington Engineering Lab',
    sourceWarehouseId: 'wh-1',
    sourceLocationId: 'loc-wh1-rack-a',
    scheduledDate: '2026-09-28',
    step: 'draft',
    status: 'draft',
    items: [
      {
        id: 'di-3',
        productId: 'prod-steel-rods',
        productName: 'Steel Rods',
        sku: 'STL-ROD-01',
        demandQty: 15,
        pickedQty: 0,
        packedQty: 0,
        uom: 'Units'
      }
    ],
    notes: 'Awaiting customer account sign-off before picking begins.',
    createdAt: '2026-09-26T09:15:00Z',
    createdByName: 'Alex Morgan'
  }
];

export const initialTransfers: InternalTransfer[] = [
  {
    id: 'int-001',
    reference: 'WH/INT/00001',
    sourceWarehouseId: 'wh-1',
    sourceLocationId: 'loc-wh1-main',
    destWarehouseId: 'wh-2',
    destLocationId: 'loc-wh2-prod-floor',
    scheduledDate: '2026-09-25',
    status: 'done',
    items: [
      {
        id: 'ti-1',
        productId: 'prod-steel-rods',
        productName: 'Steel Rods',
        sku: 'STL-ROD-01',
        quantity: 20,
        uom: 'Units'
      }
    ],
    notes: 'Moved reinforcement rods from Main Store to Production Floor assembly rack.',
    createdAt: '2026-09-25T08:00:00Z',
    validatedAt: '2026-09-25T13:45:00Z',
    createdByName: 'Alex Morgan'
  },
  {
    id: 'int-002',
    reference: 'WH/INT/00002',
    sourceWarehouseId: 'wh-1',
    sourceLocationId: 'loc-wh1-rack-a',
    destWarehouseId: 'wh-1',
    destLocationId: 'loc-wh1-rack-b',
    scheduledDate: '2026-09-27',
    status: 'ready',
    items: [
      {
        id: 'ti-2',
        productId: 'prod-fasteners',
        productName: 'M8 Heavy Duty Fasteners',
        sku: 'FST-HD-99',
        quantity: 5,
        uom: 'Boxes'
      }
    ],
    notes: 'Slot re-allocation from Rack A to Rack B for high-frequency picking.',
    createdAt: '2026-09-26T07:30:00Z',
    createdByName: 'Sarah Jenkins (Warehouse Staff)'
  }
];

export const initialAdjustments: StockAdjustment[] = [
  {
    id: 'adj-001',
    reference: 'WH/ADJ/00001',
    warehouseId: 'wh-1',
    locationId: 'loc-wh1-main',
    productId: 'prod-raw-steel',
    productName: 'Industrial Raw Steel',
    sku: 'STL-RAW-100',
    uom: 'kg',
    recordedQty: 163,
    countedQty: 160,
    difference: -3,
    reason: 'Damaged Items',
    notes: '3 kg steel damaged by transport hoist hook. Adjusted down to 160 kg physical count.',
    status: 'done',
    createdAt: '2026-09-25T16:00:00Z',
    validatedAt: '2026-09-25T16:15:00Z',
    createdByName: 'Alex Morgan'
  }
];

export const initialStockLedger: StockLedgerEntry[] = [
  {
    id: 'mve-001',
    date: '2026-09-24 14:30',
    reference: 'WH/IN/00001',
    documentType: 'Receipt',
    productId: 'prod-steel-rods',
    productName: 'Steel Rods',
    sku: 'STL-ROD-01',
    fromLocationName: 'Vendor Suppliers',
    toLocationName: 'Main Store',
    quantity: 50,
    uom: 'Units',
    status: 'Done',
    performedBy: 'Alex Morgan',
    notes: 'Vendor delivery confirmed by quality checkpoint'
  },
  {
    id: 'mve-002',
    date: '2026-09-25 11:00',
    reference: 'WH/OUT/00001',
    documentType: 'Delivery',
    productId: 'prod-chairs',
    productName: 'Ergonomic Office Chairs',
    sku: 'CHR-ERG-02',
    fromLocationName: 'Main Store',
    toLocationName: 'Customer Delivery',
    quantity: -10,
    uom: 'Units',
    status: 'Done',
    performedBy: 'Sarah Jenkins',
    notes: 'Customer dispatch signed out on dispatch slip'
  },
  {
    id: 'mve-003',
    date: '2026-09-25 13:45',
    reference: 'WH/INT/00001',
    documentType: 'Internal',
    productId: 'prod-steel-rods',
    productName: 'Steel Rods',
    sku: 'STL-ROD-01',
    fromLocationName: 'Main Store',
    toLocationName: 'Production Floor',
    quantity: 20,
    uom: 'Units',
    status: 'Done',
    performedBy: 'Alex Morgan',
    notes: 'Internal transfer: Main Store -> Production Floor'
  },
  {
    id: 'mve-004',
    date: '2026-09-25 16:15',
    reference: 'WH/ADJ/00001',
    documentType: 'Adjustment',
    productId: 'prod-raw-steel',
    productName: 'Industrial Raw Steel',
    sku: 'STL-RAW-100',
    fromLocationName: 'Main Store',
    toLocationName: 'Inventory Scraps & Adjustments',
    quantity: -3,
    uom: 'kg',
    status: 'Done',
    performedBy: 'Alex Morgan',
    notes: '3 kg steel damaged - physical count mismatch corrected'
  }
];

export const initialReorderingRules: ReorderingRule[] = [
  {
    id: 'rr-1',
    productId: 'prod-steel-rods',
    productName: 'Steel Rods',
    sku: 'STL-ROD-01',
    warehouseId: 'wh-1',
    minQty: 40,
    maxQty: 200,
    toOrderQty: 100,
    active: true
  },
  {
    id: 'rr-2',
    productId: 'prod-chairs',
    productName: 'Ergonomic Office Chairs',
    sku: 'CHR-ERG-02',
    warehouseId: 'wh-1',
    minQty: 15,
    maxQty: 60,
    toOrderQty: 30,
    active: true
  },
  {
    id: 'rr-3',
    productId: 'prod-raw-steel',
    productName: 'Industrial Raw Steel',
    sku: 'STL-RAW-100',
    warehouseId: 'wh-1',
    minQty: 50,
    maxQty: 500,
    toOrderQty: 200,
    active: true
  },
  {
    id: 'rr-4',
    productId: 'prod-steel-frames',
    productName: 'Steel Chassis Frames',
    sku: 'STL-FRM-05',
    warehouseId: 'wh-2',
    minQty: 12,
    maxQty: 50,
    toOrderQty: 25,
    active: true
  },
  {
    id: 'rr-5',
    productId: 'prod-fasteners',
    productName: 'M8 Heavy Duty Fasteners',
    sku: 'FST-HD-99',
    warehouseId: 'wh-1',
    minQty: 25,
    maxQty: 120,
    toOrderQty: 50,
    active: true
  }
];
