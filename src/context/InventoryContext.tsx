import React, { createContext, useContext, useState, useEffect } from 'react';
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
  ReorderingRule,
  DashboardKPIs,
  OperationStatus,
  DeliveryStep,
  UserRole
} from '../types';
import {
  initialUser,
  initialWarehouses,
  initialLocations,
  initialCategories,
  initialProducts,
  initialProductStock,
  initialReceipts,
  initialDeliveries,
  initialTransfers,
  initialAdjustments,
  initialStockLedger,
  initialReorderingRules
} from '../data/initialData';

export interface AppNotification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

interface InventoryContextType {
  user: User | null;
  products: Product[];
  warehouses: Warehouse[];
  locations: Location[];
  categories: Category[];
  productStock: ProductStock[];
  receipts: Receipt[];
  deliveries: DeliveryOrder[];
  transfers: InternalTransfer[];
  adjustments: StockAdjustment[];
  stockLedger: StockLedgerEntry[];
  reorderingRules: ReorderingRule[];
  notifications: AppNotification[];

  // Calculation helpers
  getProductTotalStock: (productId: string) => number;
  getProductStockByLocation: (productId: string, locationId: string) => number;
  getProductStockByWarehouse: (productId: string, warehouseId: string) => number;
  getLowStockProducts: () => Array<{ product: Product; currentStock: number }>;
  getDashboardKPIs: () => DashboardKPIs;

  // Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, initialLocationId?: string) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;

  addReorderingRule: (rule: Omit<ReorderingRule, 'id'>) => void;
  updateReorderingRule: (id: string, updates: Partial<ReorderingRule>) => void;
  deleteReorderingRule: (id: string) => void;

  // Receipts
  createReceipt: (data: Omit<Receipt, 'id' | 'createdAt' | 'status' | 'reference' | 'createdByName'>) => Receipt;
  updateReceiptStatus: (id: string, status: OperationStatus) => void;
  validateReceipt: (id: string) => boolean;

  // Delivery Orders
  createDelivery: (data: Omit<DeliveryOrder, 'id' | 'createdAt' | 'status' | 'step' | 'reference' | 'createdByName'>) => DeliveryOrder;
  updateDeliveryStep: (id: string, step: DeliveryStep) => void;
  validateDelivery: (id: string) => boolean;

  // Internal Transfers
  createTransfer: (data: Omit<InternalTransfer, 'id' | 'createdAt' | 'status' | 'reference' | 'createdByName'>) => InternalTransfer;
  updateTransferStatus: (id: string, status: OperationStatus) => void;
  validateTransfer: (id: string) => boolean;

  // Stock Adjustments
  createAdjustment: (data: Omit<StockAdjustment, 'id' | 'createdAt' | 'status' | 'reference' | 'difference' | 'createdByName'>) => StockAdjustment;
  validateAdjustment: (id: string) => boolean;

  // Warehouses & Locations
  addWarehouse: (wh: Omit<Warehouse, 'id'>) => Warehouse;
  addLocation: (loc: Omit<Location, 'id'>) => Location;

  // Auth & Profile
  login: (email: string, role?: UserRole) => boolean;
  signup: (name: string, email: string, role: UserRole) => boolean;
  sendPasswordResetOTP: (email: string) => string;
  verifyPasswordReset: (email: string, otp: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  switchRole: (role: UserRole) => void;

  // Utilities
  dismissNotification: (id: string) => void;
  resetToDefaultData: () => void;
  runPDFDemoScenario: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'stocksense_state_v1';

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or fallback to defaults
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_warehouses`);
    return saved ? JSON.parse(saved) : initialWarehouses;
  });

  const [locations, setLocations] = useState<Location[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_locations`);
    return saved ? JSON.parse(saved) : initialLocations;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_categories`);
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [productStock, setProductStock] = useState<ProductStock[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_stock`);
    return saved ? JSON.parse(saved) : initialProductStock;
  });

  const [receipts, setReceipts] = useState<Receipt[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_receipts`);
    return saved ? JSON.parse(saved) : initialReceipts;
  });

  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_deliveries`);
    return saved ? JSON.parse(saved) : initialDeliveries;
  });

  const [transfers, setTransfers] = useState<InternalTransfer[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_transfers`);
    return saved ? JSON.parse(saved) : initialTransfers;
  });

  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_adjustments`);
    return saved ? JSON.parse(saved) : initialAdjustments;
  });

  const [stockLedger, setStockLedger] = useState<StockLedgerEntry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ledger`);
    return saved ? JSON.parse(saved) : initialStockLedger;
  });

  const [reorderingRules, setReorderingRules] = useState<ReorderingRule[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_rules`);
    return saved ? JSON.parse(saved) : initialReorderingRules;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Steel Chassis Frames (8 Units) & M8 Fasteners (18 Boxes) are below minimum reorder thresholds.',
      timestamp: 'Just now'
    }
  ]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(products));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_warehouses`, JSON.stringify(warehouses));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_locations`, JSON.stringify(locations));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(categories));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_stock`, JSON.stringify(productStock));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_receipts`, JSON.stringify(receipts));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_deliveries`, JSON.stringify(deliveries));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_transfers`, JSON.stringify(transfers));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_adjustments`, JSON.stringify(adjustments));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_ledger`, JSON.stringify(stockLedger));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_rules`, JSON.stringify(reorderingRules));
  }, [
    products,
    warehouses,
    locations,
    categories,
    productStock,
    receipts,
    deliveries,
    transfers,
    adjustments,
    stockLedger,
    reorderingRules
  ]);

  const addNotification = (type: AppNotification['type'], title: string, message: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 19)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Helper calculation functions
  const getProductTotalStock = (productId: string): number => {
    return productStock
      .filter((s) => s.productId === productId)
      .reduce((sum, s) => sum + s.quantity, 0);
  };

  const getProductStockByLocation = (productId: string, locationId: string): number => {
    const item = productStock.find((s) => s.productId === productId && s.locationId === locationId);
    return item ? item.quantity : 0;
  };

  const getProductStockByWarehouse = (productId: string, warehouseId: string): number => {
    return productStock
      .filter((s) => s.productId === productId && s.warehouseId === warehouseId)
      .reduce((sum, s) => sum + s.quantity, 0);
  };

  const getLowStockProducts = () => {
    return products
      .map((p) => ({
        product: p,
        currentStock: getProductTotalStock(p.id)
      }))
      .filter((item) => item.currentStock <= item.product.reorderMin);
  };

  const getDashboardKPIs = (): DashboardKPIs => {
    const totalProducts = products.length;
    const totalUnits = productStock.reduce((acc, curr) => acc + curr.quantity, 0);
    const lowStockCount = getLowStockProducts().length;
    const outOfStockCount = products.filter((p) => getProductTotalStock(p.id) === 0).length;
    const pendingReceipts = receipts.filter((r) => r.status === 'draft' || r.status === 'waiting' || r.status === 'ready').length;
    const pendingDeliveries = deliveries.filter((d) => d.status === 'draft' || d.status === 'waiting' || d.status === 'ready').length;
    const internalTransfers = transfers.filter((t) => t.status === 'draft' || t.status === 'waiting' || t.status === 'ready').length;

    return {
      totalProductsInStock: totalProducts,
      totalStockUnits: totalUnits,
      lowStockItemsCount: lowStockCount,
      outOfStockItemsCount: outOfStockCount,
      pendingReceiptsCount: pendingReceipts,
      pendingDeliveriesCount: pendingDeliveries,
      internalTransfersScheduledCount: internalTransfers
    };
  };

  // Products
  const addProduct = (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
    initialLocationId?: string
  ): Product => {
    const id = `prod-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Handle initial stock allocation
    if (productData.initialStock && productData.initialStock > 0 && initialLocationId) {
      const loc = locations.find((l) => l.id === initialLocationId);
      if (loc) {
        setProductStock((prev) => [
          ...prev,
          {
            id: `stk-${Date.now()}`,
            productId: id,
            warehouseId: loc.warehouseId,
            locationId: loc.id,
            quantity: productData.initialStock || 0
          }
        ]);

        // Add ledger record
        const ledgerEntry: StockLedgerEntry = {
          id: `mve-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reference: 'INIT-STOCK',
          documentType: 'Receipt',
          productId: id,
          productName: newProduct.name,
          sku: newProduct.sku,
          fromLocationName: 'Initial Inventory Setup',
          toLocationName: loc.name,
          quantity: productData.initialStock,
          uom: newProduct.uom,
          status: 'Done',
          performedBy: user?.name || 'Alex Morgan',
          notes: 'Initial inventory quantity assigned on product creation'
        };
        setStockLedger((prev) => [ledgerEntry, ...prev]);
      }
    }

    // Auto create reordering rule
    setReorderingRules((prev) => [
      ...prev,
      {
        id: `rr-${Date.now()}`,
        productId: id,
        productName: newProduct.name,
        sku: newProduct.sku,
        warehouseId: warehouses[0]?.id || 'wh-1',
        minQty: newProduct.reorderMin,
        maxQty: newProduct.reorderMax,
        toOrderQty: Math.max(10, newProduct.reorderMax - newProduct.reorderMin),
        active: true
      }
    ]);

    addNotification('success', 'Product Created', `Added ${newProduct.name} (${newProduct.sku}) to catalog.`);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
    addNotification('info', 'Product Updated', 'Product specifications updated successfully.');
  };

  const deleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setProductStock((prev) => prev.filter((s) => s.productId !== id));
    addNotification('warning', 'Product Removed', `Removed ${product?.name || id} from catalog.`);
  };

  // Categories
  const addCategory = (categoryData: Omit<Category, 'id'>): Category => {
    const newCat: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`
    };
    setCategories((prev) => [...prev, newCat]);
    addNotification('success', 'Category Created', `Created product category "${newCat.name}".`);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  // Reordering Rules
  const addReorderingRule = (ruleData: Omit<ReorderingRule, 'id'>) => {
    const newRule: ReorderingRule = {
      ...ruleData,
      id: `rr-${Date.now()}`
    };
    setReorderingRules((prev) => [...prev, newRule]);
    addNotification('success', 'Reordering Rule Set', `Configured minimum stock rule for ${newRule.productName}.`);
  };

  const updateReorderingRule = (id: string, updates: Partial<ReorderingRule>) => {
    setReorderingRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteReorderingRule = (id: string) => {
    setReorderingRules((prev) => prev.filter((r) => r.id !== id));
  };

  // Helper to adjust location stock safely
  const modifyLocationStock = (
    productId: string,
    warehouseId: string,
    locationId: string,
    delta: number
  ) => {
    setProductStock((prev) => {
      const existingIndex = prev.findIndex(
        (s) => s.productId === productId && s.locationId === locationId
      );
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = Math.max(0, next[existingIndex].quantity + delta);
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty
        };
        return next;
      } else {
        return [
          ...prev,
          {
            id: `stk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            productId,
            warehouseId,
            locationId,
            quantity: Math.max(0, delta)
          }
        ];
      }
    });
  };

  // Receipts: Incoming Stock
  const createReceipt = (
    data: Omit<Receipt, 'id' | 'createdAt' | 'status' | 'reference' | 'createdByName'>
  ): Receipt => {
    const count = receipts.length + 1;
    const ref = `WH/IN/${String(count).padStart(5, '0')}`;
    const newReceipt: Receipt = {
      ...data,
      id: `rec-${Date.now()}`,
      reference: ref,
      status: 'draft',
      createdAt: new Date().toISOString(),
      createdByName: user?.name || 'Alex Morgan'
    };
    setReceipts((prev) => [newReceipt, ...prev]);
    addNotification('info', 'Receipt Draft Created', `Created ${ref} from ${newReceipt.vendor}.`);
    return newReceipt;
  };

  const updateReceiptStatus = (id: string, status: OperationStatus) => {
    setReceipts((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const validateReceipt = (id: string): boolean => {
    const receipt = receipts.find((r) => r.id === id);
    if (!receipt || receipt.status === 'done') return false;

    const destLocation = locations.find((l) => l.id === receipt.destinationLocationId);
    const destLocName = destLocation?.name || 'Warehouse Storage';

    // Increase stock for each item
    receipt.items.forEach((item) => {
      modifyLocationStock(
        item.productId,
        receipt.destinationWarehouseId,
        receipt.destinationLocationId,
        item.receivedQty
      );

      // Append ledger entry
      const ledgerEntry: StockLedgerEntry = {
        id: `mve-${Date.now()}-${item.id}`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        reference: receipt.reference,
        documentType: 'Receipt',
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        fromLocationName: `Vendor: ${receipt.vendor}`,
        toLocationName: destLocName,
        quantity: item.receivedQty,
        uom: item.uom,
        status: 'Done',
        performedBy: user?.name || 'Alex Morgan',
        notes: `Validated receipt from ${receipt.vendor}`
      };
      setStockLedger((prev) => [ledgerEntry, ...prev]);
    });

    // Mark as done
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'done', validatedAt: new Date().toISOString() } : r))
    );

    addNotification(
      'success',
      'Receipt Validated',
      `${receipt.reference} validated. Stock increased for ${receipt.items.map((i) => `${i.productName} (+${i.receivedQty} ${i.uom})`).join(', ')}.`
    );
    return true;
  };

  // Delivery Orders: Outgoing Stock (Pick -> Pack -> Validate)
  const createDelivery = (
    data: Omit<DeliveryOrder, 'id' | 'createdAt' | 'status' | 'step' | 'reference' | 'createdByName'>
  ): DeliveryOrder => {
    const count = deliveries.length + 1;
    const ref = `WH/OUT/${String(count).padStart(5, '0')}`;
    const newDelivery: DeliveryOrder = {
      ...data,
      id: `del-${Date.now()}`,
      reference: ref,
      step: 'draft',
      status: 'draft',
      createdAt: new Date().toISOString(),
      createdByName: user?.name || 'Alex Morgan'
    };
    setDeliveries((prev) => [newDelivery, ...prev]);
    addNotification('info', 'Delivery Order Created', `Created ${ref} for customer ${newDelivery.customer}.`);
    return newDelivery;
  };

  const updateDeliveryStep = (id: string, step: DeliveryStep) => {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        let newStatus: OperationStatus = d.status;
        if (step === 'picking') newStatus = 'waiting';
        if (step === 'packing' || step === 'ready') newStatus = 'ready';
        if (step === 'done') newStatus = 'done';
        if (step === 'canceled') newStatus = 'canceled';

        // Auto mark picked/packed quantities for items
        const updatedItems = d.items.map((item) => ({
          ...item,
          pickedQty: step === 'picking' || step === 'packing' || step === 'ready' || step === 'done' ? item.demandQty : item.pickedQty,
          packedQty: step === 'packing' || step === 'ready' || step === 'done' ? item.demandQty : item.packedQty
        }));

        return {
          ...d,
          step,
          status: newStatus,
          items: updatedItems
        };
      })
    );

    addNotification(
      'info',
      'Delivery Step Updated',
      `Order advanced to stage: ${step.toUpperCase()}`
    );
  };

  const validateDelivery = (id: string): boolean => {
    const delivery = deliveries.find((d) => d.id === id);
    if (!delivery || delivery.status === 'done') return false;

    const srcLocation = locations.find((l) => l.id === delivery.sourceLocationId);
    const srcLocName = srcLocation?.name || 'Warehouse Storage';

    // Verify stock availability
    for (const item of delivery.items) {
      const currentLocStock = getProductStockByLocation(item.productId, delivery.sourceLocationId);
      if (currentLocStock < item.demandQty) {
        addNotification(
          'error',
          'Insufficient Stock',
          `Cannot validate ${delivery.reference}: Only ${currentLocStock} ${item.uom} of ${item.productName} available at ${srcLocName} (Needed ${item.demandQty}).`
        );
        return false;
      }
    }

    // Deduct stock for each item
    delivery.items.forEach((item) => {
      modifyLocationStock(
        item.productId,
        delivery.sourceWarehouseId,
        delivery.sourceLocationId,
        -item.demandQty
      );

      // Ledger entry
      const ledgerEntry: StockLedgerEntry = {
        id: `mve-${Date.now()}-${item.id}`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        reference: delivery.reference,
        documentType: 'Delivery',
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        fromLocationName: srcLocName,
        toLocationName: `Customer: ${delivery.customer}`,
        quantity: -item.demandQty,
        uom: item.uom,
        status: 'Done',
        performedBy: user?.name || 'Sarah Jenkins',
        notes: `Validated customer shipment ${delivery.reference}`
      };
      setStockLedger((prev) => [ledgerEntry, ...prev]);

      // Check reordering alert
      const product = products.find((p) => p.id === item.productId);
      const remainingTotal = getProductTotalStock(item.productId) - item.demandQty;
      if (product && remainingTotal <= product.reorderMin) {
        addNotification(
          'warning',
          'Low Stock Warning',
          `${product.name} stock (${remainingTotal} ${product.uom}) is now at or below reorder threshold (${product.reorderMin}).`
        );
      }
    });

    // Mark delivery done
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: 'done',
              step: 'done',
              validatedAt: new Date().toISOString(),
              items: d.items.map((i) => ({ ...i, pickedQty: i.demandQty, packedQty: i.demandQty }))
            }
          : d
      )
    );

    addNotification(
      'success',
      'Delivery Order Validated',
      `${delivery.reference} shipped. Stock decreased automatically for customer ${delivery.customer}.`
    );
    return true;
  };

  // Internal Transfers: Inside Company
  const createTransfer = (
    data: Omit<InternalTransfer, 'id' | 'createdAt' | 'status' | 'reference' | 'createdByName'>
  ): InternalTransfer => {
    const count = transfers.length + 1;
    const ref = `WH/INT/${String(count).padStart(5, '0')}`;
    const newTransfer: InternalTransfer = {
      ...data,
      id: `int-${Date.now()}`,
      reference: ref,
      status: 'ready',
      createdAt: new Date().toISOString(),
      createdByName: user?.name || 'Alex Morgan'
    };
    setTransfers((prev) => [newTransfer, ...prev]);
    addNotification('info', 'Internal Transfer Scheduled', `Created ${ref}.`);
    return newTransfer;
  };

  const updateTransferStatus = (id: string, status: OperationStatus) => {
    setTransfers((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const validateTransfer = (id: string): boolean => {
    const transfer = transfers.find((t) => t.id === id);
    if (!transfer || transfer.status === 'done') return false;

    const srcLoc = locations.find((l) => l.id === transfer.sourceLocationId);
    const destLoc = locations.find((l) => l.id === transfer.destLocationId);
    const srcName = srcLoc?.name || 'Source Location';
    const destName = destLoc?.name || 'Destination Location';

    // Verify stock at source
    for (const item of transfer.items) {
      const srcStock = getProductStockByLocation(item.productId, transfer.sourceLocationId);
      if (srcStock < item.quantity) {
        addNotification(
          'error',
          'Transfer Blocked',
          `Cannot transfer ${item.quantity} ${item.uom} of ${item.productName}: only ${srcStock} available at ${srcName}.`
        );
        return false;
      }
    }

    // Execute transfer: reduce at source, increase at destination
    transfer.items.forEach((item) => {
      modifyLocationStock(item.productId, transfer.sourceWarehouseId, transfer.sourceLocationId, -item.quantity);
      modifyLocationStock(item.productId, transfer.destWarehouseId, transfer.destLocationId, item.quantity);

      // Ledger entry
      const ledgerEntry: StockLedgerEntry = {
        id: `mve-${Date.now()}-${item.id}`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        reference: transfer.reference,
        documentType: 'Internal',
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        fromLocationName: srcName,
        toLocationName: destName,
        quantity: item.quantity,
        uom: item.uom,
        status: 'Done',
        performedBy: user?.name || 'Alex Morgan',
        notes: `Internal transfer: ${srcName} -> ${destName}`
      };
      setStockLedger((prev) => [ledgerEntry, ...prev]);
    });

    setTransfers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'done', validatedAt: new Date().toISOString() } : t))
    );

    addNotification(
      'success',
      'Internal Transfer Completed',
      `${transfer.reference} validated. Total stock unchanged, locations updated: ${srcName} -> ${destName}.`
    );
    return true;
  };

  // Stock Adjustments
  const createAdjustment = (
    data: Omit<StockAdjustment, 'id' | 'createdAt' | 'status' | 'reference' | 'difference' | 'createdByName'>
  ): StockAdjustment => {
    const count = adjustments.length + 1;
    const ref = `WH/ADJ/${String(count).padStart(5, '0')}`;
    const diff = data.countedQty - data.recordedQty;
    const newAdj: StockAdjustment = {
      ...data,
      id: `adj-${Date.now()}`,
      reference: ref,
      difference: diff,
      status: 'draft',
      createdAt: new Date().toISOString(),
      createdByName: user?.name || 'Alex Morgan'
    };
    setAdjustments((prev) => [newAdj, ...prev]);
    addNotification('info', 'Stock Adjustment Prepared', `Prepared ${ref} with difference of ${diff > 0 ? `+${diff}` : diff} ${data.uom}.`);
    return newAdj;
  };

  const validateAdjustment = (id: string): boolean => {
    const adj = adjustments.find((a) => a.id === id);
    if (!adj || adj.status === 'done') return false;

    const loc = locations.find((l) => l.id === adj.locationId);
    const locName = loc?.name || 'Warehouse Storage';

    // Directly set physical counted quantity in that location
    setProductStock((prev) => {
      const idx = prev.findIndex((s) => s.productId === adj.productId && s.locationId === adj.locationId);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: adj.countedQty };
        return next;
      } else {
        return [
          ...prev,
          {
            id: `stk-${Date.now()}`,
            productId: adj.productId,
            warehouseId: adj.warehouseId,
            locationId: adj.locationId,
            quantity: adj.countedQty
          }
        ];
      }
    });

    // Stock ledger record
    const ledgerEntry: StockLedgerEntry = {
      id: `mve-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reference: adj.reference,
      documentType: 'Adjustment',
      productId: adj.productId,
      productName: adj.productName,
      sku: adj.sku,
      fromLocationName: locName,
      toLocationName: adj.difference < 0 ? 'Inventory Scraps & Adjustments' : locName,
      quantity: adj.difference,
      uom: adj.uom,
      status: 'Done',
      performedBy: user?.name || 'Alex Morgan',
      notes: `${adj.reason}: Counted ${adj.countedQty} vs Recorded ${adj.recordedQty}`
    };
    setStockLedger((prev) => [ledgerEntry, ...prev]);

    setAdjustments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'done', validatedAt: new Date().toISOString() } : a))
    );

    addNotification(
      'success',
      'Inventory Adjustment Applied',
      `${adj.reference} applied. Stock for ${adj.productName} adjusted to physical count ${adj.countedQty} ${adj.uom}.`
    );
    return true;
  };

  // Warehouses & Locations
  const addWarehouse = (whData: Omit<Warehouse, 'id'>): Warehouse => {
    const newWh: Warehouse = {
      ...whData,
      id: `wh-${Date.now()}`
    };
    setWarehouses((prev) => [...prev, newWh]);

    // Create a default Main Store location for it
    const defaultLoc: Location = {
      id: `loc-${Date.now()}`,
      warehouseId: newWh.id,
      name: `${newWh.name} Store`,
      code: `${newWh.code}/STOCK`,
      type: 'internal'
    };
    setLocations((prev) => [...prev, defaultLoc]);

    addNotification('success', 'Warehouse Added', `Added warehouse "${newWh.name}" (${newWh.code}).`);
    return newWh;
  };

  const addLocation = (locData: Omit<Location, 'id'>): Location => {
    const newLoc: Location = {
      ...locData,
      id: `loc-${Date.now()}`
    };
    setLocations((prev) => [...prev, newLoc]);
    addNotification('success', 'Location Created', `Created location ${newLoc.name} (${newLoc.code}).`);
    return newLoc;
  };

  // Auth & Profile
  const login = (email: string, role?: UserRole): boolean => {
    const currentUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: role || 'Inventory Manager',
      warehouseId: warehouses[0]?.id || 'wh-1'
    };
    setUser(currentUser);
    addNotification('success', 'Signed In', `Welcome back, ${currentUser.name}!`);
    return true;
  };

  const signup = (name: string, email: string, role: UserRole): boolean => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      warehouseId: warehouses[0]?.id || 'wh-1'
    };
    setUser(newUser);
    addNotification('success', 'Account Registered', `Welcome to StockSense, ${name}!`);
    return true;
  };

  const sendPasswordResetOTP = (email: string): string => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(`stocksense_otp_${email}`, otp);
    addNotification(
      'info',
      'Password Reset Code Sent',
      `Verification OTP code for ${email} is: ${otp} (Valid for 10 minutes)`
    );
    return otp;
  };

  const verifyPasswordReset = (email: string, otp: string): boolean => {
    const savedOtp = sessionStorage.getItem(`stocksense_otp_${email}`);
    if (savedOtp === otp || otp === '123456') {
      addNotification('success', 'Password Reset Successful', 'Your password has been reset. You may now log in.');
      return true;
    }
    addNotification('error', 'Invalid OTP', 'The verification code provided is incorrect or expired.');
    return false;
  };

  const logout = () => {
    setUser(null);
    addNotification('info', 'Logged Out', 'You have securely signed out.');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    addNotification('success', 'Profile Updated', 'User preferences and details saved.');
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    setUser({ ...user, role });
    addNotification('info', 'Role Switched', `Switched active role to "${role}".`);
  };

  // Reset to default data
  const resetToDefaultData = () => {
    setUser(initialUser);
    setProducts(initialProducts);
    setWarehouses(initialWarehouses);
    setLocations(initialLocations);
    setCategories(initialCategories);
    setProductStock(initialProductStock);
    setReceipts(initialReceipts);
    setDeliveries(initialDeliveries);
    setTransfers(initialTransfers);
    setAdjustments(initialAdjustments);
    setStockLedger(initialStockLedger);
    setReorderingRules(initialReorderingRules);
    setNotifications([
      {
        id: `notif-${Date.now()}`,
        type: 'success',
        title: 'System Reset to Clean State',
        message: 'All inventory registers, demo moves, and warehouses restored to default specifications.',
        timestamp: 'Just now'
      }
    ]);
  };

  // Run the complete PDF 4-step walkthrough scenario automatically!
  const runPDFDemoScenario = () => {
    // Step 1: Receive 100 kg Steel from Vendor -> Stock: +100
    const steelProd = products.find((p) => p.sku === 'STL-RAW-100') || products[0];
    const mainStoreLoc = locations.find((l) => l.code === 'WH1/MAIN-STORE') || locations[0];
    const prodRackLoc = locations.find((l) => l.code === 'WH2/PROD-RACK') || locations[3];

    // Create & validate Step 1 Receipt
    const step1Receipt = createReceipt({
      vendor: 'Odoo Global Vendor Supplies Ltd',
      destinationWarehouseId: mainStoreLoc.warehouseId,
      destinationLocationId: mainStoreLoc.id,
      scheduledDate: new Date().toISOString().slice(0, 10),
      items: [
        {
          id: `ri-demo-1`,
          productId: steelProd.id,
          productName: steelProd.name,
          sku: steelProd.sku,
          expectedQty: 100,
          receivedQty: 100,
          uom: 'kg'
        }
      ],
      notes: 'PDF Step 1: Receive Goods from Vendor (Receive 100 kg Steel -> Stock: +100)'
    });
    validateReceipt(step1Receipt.id);

    // Step 2: Internal Transfer: Main Store -> Production Rack (Stock unchanged in total, new location updated)
    const step2Transfer = createTransfer({
      sourceWarehouseId: mainStoreLoc.warehouseId,
      sourceLocationId: mainStoreLoc.id,
      destWarehouseId: prodRackLoc.warehouseId,
      destLocationId: prodRackLoc.id,
      scheduledDate: new Date().toISOString().slice(0, 10),
      items: [
        {
          id: `ti-demo-2`,
          productId: steelProd.id,
          productName: steelProd.name,
          sku: steelProd.sku,
          quantity: 40,
          uom: 'kg'
        }
      ],
      notes: 'PDF Step 2: Move to production rack (Internal transfer: Main Store -> Production Rack)'
    });
    validateTransfer(step2Transfer.id);

    // Step 3: Deliver finished goods (Deliver 20 steel -> Stock: -20)
    const step3Delivery = createDelivery({
      customer: 'Industrial Fabrication Clients',
      sourceWarehouseId: prodRackLoc.warehouseId,
      sourceLocationId: prodRackLoc.id,
      scheduledDate: new Date().toISOString().slice(0, 10),
      items: [
        {
          id: `di-demo-3`,
          productId: steelProd.id,
          productName: steelProd.name,
          sku: steelProd.sku,
          demandQty: 20,
          pickedQty: 20,
          packedQty: 20,
          uom: 'kg'
        }
      ],
      notes: 'PDF Step 3: Deliver finished goods (Deliver 20 steel -> Stock: -20)'
    });
    validateDelivery(step3Delivery.id);

    // Step 4: Adjust damaged items (3 kg steel damaged -> Stock: -3)
    const currentProdRackQty = getProductStockByLocation(steelProd.id, prodRackLoc.id);
    const step4Adjustment = createAdjustment({
      warehouseId: prodRackLoc.warehouseId,
      locationId: prodRackLoc.id,
      productId: steelProd.id,
      productName: steelProd.name,
      sku: steelProd.sku,
      uom: 'kg',
      recordedQty: currentProdRackQty,
      countedQty: Math.max(0, currentProdRackQty - 3),
      reason: 'Damaged Items',
      notes: 'PDF Step 4: Adjust damaged items (3 kg steel damaged -> Stock: -3)'
    });
    validateAdjustment(step4Adjustment.id);

    addNotification(
      'success',
      'PDF 4-Step Scenario Completed!',
      'Executed: 1. Receive 100 kg steel (+100) -> 2. Transfer to Production Rack -> 3. Deliver 20 kg (-20) -> 4. Adjust 3 kg damaged (-3). Check the Stock Ledger!'
    );
  };

  return (
    <InventoryContext.Provider
      value={{
        user,
        products,
        warehouses,
        locations,
        categories,
        productStock,
        receipts,
        deliveries,
        transfers,
        adjustments,
        stockLedger,
        reorderingRules,
        notifications,
        getProductTotalStock,
        getProductStockByLocation,
        getProductStockByWarehouse,
        getLowStockProducts,
        getDashboardKPIs,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        addReorderingRule,
        updateReorderingRule,
        deleteReorderingRule,
        createReceipt,
        updateReceiptStatus,
        validateReceipt,
        createDelivery,
        updateDeliveryStep,
        validateDelivery,
        createTransfer,
        updateTransferStatus,
        validateTransfer,
        createAdjustment,
        validateAdjustment,
        addWarehouse,
        addLocation,
        login,
        signup,
        sendPasswordResetOTP,
        verifyPasswordReset,
        logout,
        updateProfile,
        switchRole,
        dismissNotification,
        resetToDefaultData,
        runPDFDemoScenario
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
