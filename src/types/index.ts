export type UserRole = 'Inventory Manager' | 'Warehouse Staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  warehouseId?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
}

export interface Location {
  id: string;
  warehouseId: string;
  name: string;
  code: string;
  type: 'internal' | 'customer' | 'vendor' | 'inventory_loss';
}

export interface ProductStock {
  id: string;
  productId: string;
  warehouseId: string;
  locationId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  uom: string; // kg, units, m, boxes, liters
  price: number;
  reorderMin: number;
  reorderMax: number;
  initialStock?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type OperationStatus = 'draft' | 'waiting' | 'ready' | 'done' | 'canceled';

export interface ReceiptItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  expectedQty: number;
  receivedQty: number;
  uom: string;
}

export interface Receipt {
  id: string;
  reference: string; // e.g. WH/IN/00001
  vendor: string;
  destinationWarehouseId: string;
  destinationLocationId: string;
  scheduledDate: string;
  status: OperationStatus;
  items: ReceiptItem[];
  notes?: string;
  createdAt: string;
  validatedAt?: string;
  createdByName: string;
}

export type DeliveryStep = 'draft' | 'picking' | 'packing' | 'ready' | 'done' | 'canceled';

export interface DeliveryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  demandQty: number;
  pickedQty: number;
  packedQty: number;
  uom: string;
}

export interface DeliveryOrder {
  id: string;
  reference: string; // e.g. WH/OUT/00001
  customer: string;
  sourceWarehouseId: string;
  sourceLocationId: string;
  scheduledDate: string;
  step: DeliveryStep;
  status: OperationStatus;
  items: DeliveryItem[];
  notes?: string;
  createdAt: string;
  validatedAt?: string;
  createdByName: string;
}

export interface TransferItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  uom: string;
}

export interface InternalTransfer {
  id: string;
  reference: string; // e.g. WH/INT/00001
  sourceWarehouseId: string;
  sourceLocationId: string;
  destWarehouseId: string;
  destLocationId: string;
  scheduledDate: string;
  status: OperationStatus;
  items: TransferItem[];
  notes?: string;
  createdAt: string;
  validatedAt?: string;
  createdByName: string;
}

export type AdjustmentReason = 
  | 'Damaged Items' 
  | 'Physical Count Mismatch' 
  | 'Loss / Theft' 
  | 'Found Items' 
  | 'Annual Audit' 
  | 'Expired / Scrap';

export interface StockAdjustment {
  id: string;
  reference: string; // e.g. WH/ADJ/00001
  warehouseId: string;
  locationId: string;
  productId: string;
  productName: string;
  sku: string;
  uom: string;
  recordedQty: number;
  countedQty: number;
  difference: number;
  reason: AdjustmentReason;
  notes?: string;
  status: 'draft' | 'done';
  createdAt: string;
  validatedAt?: string;
  createdByName: string;
}

export type DocumentType = 'Receipt' | 'Delivery' | 'Internal' | 'Adjustment';

export interface StockLedgerEntry {
  id: string;
  date: string;
  reference: string;
  documentType: DocumentType;
  productId: string;
  productName: string;
  sku: string;
  fromLocationName: string;
  toLocationName: string;
  quantity: number; // positive or negative relative movement
  uom: string;
  status: 'Done';
  performedBy: string;
  notes?: string;
}

export interface ReorderingRule {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  minQty: number;
  maxQty: number;
  toOrderQty: number;
  active: boolean;
}

export interface DashboardKPIs {
  totalProductsInStock: number;
  totalStockUnits: number;
  lowStockItemsCount: number;
  outOfStockItemsCount: number;
  pendingReceiptsCount: number;
  pendingDeliveriesCount: number;
  internalTransfersScheduledCount: number;
}
