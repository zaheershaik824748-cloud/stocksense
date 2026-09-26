import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Boxes, 
  AlertTriangle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowRightLeft, 
  SlidersHorizontal,
  Package, 
  Filter, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { DocumentType, OperationStatus } from '../types';
import { ActiveTab } from '../components/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenDemoModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenDemoModal }) => {
  const {
    getDashboardKPIs,
    getLowStockProducts,
    products,
    warehouses,
    locations,
    categories,
    receipts,
    deliveries,
    transfers,
    adjustments,
    validateReceipt,
    validateDelivery,
    validateTransfer,
    validateAdjustment
  } = useInventory();

  // Dynamic Filters as requested in the PDF:
  // - By document type: Receipts / Delivery / Internal / Adjustments
  // - By status: Draft, Waiting, Ready, Done, Canceled
  // - By warehouse or location
  // - By product category
  const [filterDocType, setFilterDocType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterWarehouse, setFilterWarehouse] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const kpis = getDashboardKPIs();
  const lowStockItems = getLowStockProducts();

  // Consolidate operations into a unified interactive list for the dynamic filters
  const allOperations = [
    ...receipts.map((r) => ({
      id: r.id,
      docType: 'Receipt' as DocumentType,
      reference: r.reference,
      partner: r.vendor,
      warehouseId: r.destinationWarehouseId,
      locationId: r.destinationLocationId,
      date: r.scheduledDate,
      status: r.status,
      itemsSummary: r.items.map((i) => `${i.productName} (${i.expectedQty} ${i.uom})`).join(', '),
      itemProductIds: r.items.map((i) => i.productId),
      raw: r
    })),
    ...deliveries.map((d) => ({
      id: d.id,
      docType: 'Delivery' as DocumentType,
      reference: d.reference,
      partner: d.customer,
      warehouseId: d.sourceWarehouseId,
      locationId: d.sourceLocationId,
      date: d.scheduledDate,
      status: d.status,
      itemsSummary: d.items.map((i) => `${i.productName} (${i.demandQty} ${i.uom})`).join(', '),
      itemProductIds: d.items.map((i) => i.productId),
      raw: d
    })),
    ...transfers.map((t) => ({
      id: t.id,
      docType: 'Internal' as DocumentType,
      reference: t.reference,
      partner: 'Internal Move',
      warehouseId: t.sourceWarehouseId,
      locationId: t.sourceLocationId,
      date: t.scheduledDate,
      status: t.status,
      itemsSummary: t.items.map((i) => `${i.productName} (${i.quantity} ${i.uom})`).join(', '),
      itemProductIds: t.items.map((i) => i.productId),
      raw: t
    })),
    ...adjustments.map((a) => ({
      id: a.id,
      docType: 'Adjustment' as DocumentType,
      reference: a.reference,
      partner: a.reason,
      warehouseId: a.warehouseId,
      locationId: a.locationId,
      date: a.createdAt.slice(0, 10),
      status: a.status === 'done' ? ('done' as OperationStatus) : ('draft' as OperationStatus),
      itemsSummary: `${a.productName} (${a.difference > 0 ? `+${a.difference}` : a.difference} ${a.uom})`,
      itemProductIds: [a.productId],
      raw: a
    }))
  ];

  // Apply PDF Dynamic Filters
  const filteredOperations = allOperations.filter((op) => {
    // By document type
    if (filterDocType !== 'all' && op.docType !== filterDocType) return false;

    // By status
    if (filterStatus !== 'all' && op.status !== filterStatus) return false;

    // By warehouse or location
    if (filterWarehouse !== 'all') {
      const isWarehouseMatch = op.warehouseId === filterWarehouse;
      const isLocationMatch = op.locationId === filterWarehouse;
      if (!isWarehouseMatch && !isLocationMatch) return false;
    }

    // By product category
    if (filterCategory !== 'all') {
      const matchCat = op.itemProductIds.some((pId) => {
        const prod = products.find((p) => p.id === pId);
        return prod?.categoryId === filterCategory;
      });
      if (!matchCat) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        op.reference.toLowerCase().includes(q) ||
        op.partner.toLowerCase().includes(q) ||
        op.itemsSummary.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome with Quick PDF Scenario Trigger */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-purple-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Odoo Problem Statement Reference Implementation
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Centralized Stock & Warehouse Operations
          </h2>
          <p className="text-purple-200 text-sm mt-2 leading-relaxed">
            Digitize incoming receipts, outgoing shipments, multi-location transfers, and physical counts with automatic real-time stock ledger auditing.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenDemoModal}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 text-xs sm:text-sm"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            Run 4-Step Flow Walkthrough
          </button>
          <button
            onClick={() => onNavigate('ledger')}
            className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl backdrop-blur-md transition-all text-xs sm:text-sm"
          >
            View Stock Ledger
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dashboard KPIs as explicitly defined in PDF Page 1 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Dashboard KPIs
          </h3>
          <span className="text-xs text-slate-500">Real-time synchronized</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* KPI 1: Total Products in Stock */}
          <div
            onClick={() => onNavigate('products')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Products in Stock</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{kpis.totalProductsInStock}</span>
              <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-mono">
                {kpis.totalStockUnits} units
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Active catalog SKUs</p>
          </div>

          {/* KPI 2: Low Stock / Out of Stock Items */}
          <div
            onClick={() => onNavigate('reordering-rules')}
            className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group bg-gradient-to-br from-white to-amber-50/30"
          >
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-xs font-semibold uppercase tracking-wider">Low / Out of Stock</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-700">{kpis.lowStockItemsCount}</span>
              {kpis.outOfStockItemsCount > 0 ? (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-mono">
                  {kpis.outOfStockItemsCount} Out
                </span>
              ) : (
                <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Under threshold
                </span>
              )}
            </div>
            <p className="text-[11px] text-amber-700/80 mt-2">Requires reordering</p>
          </div>

          {/* KPI 3: Pending Receipts */}
          <div
            onClick={() => onNavigate('receipts')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Receipts</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{kpis.pendingReceiptsCount}</span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Incoming
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Awaiting validation</p>
          </div>

          {/* KPI 4: Pending Deliveries */}
          <div
            onClick={() => onNavigate('deliveries')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Deliveries</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{kpis.pendingDeliveriesCount}</span>
              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                Outgoing
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Pick / pack / ship</p>
          </div>

          {/* KPI 5: Internal Transfers Scheduled */}
          <div
            onClick={() => onNavigate('transfers')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Internal Transfers</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{kpis.internalTransfersScheduledCount}</span>
              <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                Scheduled
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Between locations</p>
          </div>
        </div>
      </div>

      {/* Low Stock Callout Cards if any items are under minimum */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Critical Low Stock Notice ({lowStockItems.length} Products)
              </h4>
            </div>
            <button
              onClick={() => onNavigate('receipts')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-2 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Restock Receipt
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map(({ product, currentStock }) => (
              <div
                key={product.id}
                className="bg-white p-3.5 rounded-xl border border-amber-200 flex items-center justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs">{product.name}</span>
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      {product.sku}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Threshold: <span className="font-bold text-slate-700">{product.reorderMin} {product.uom}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    {currentStock} {product.uom}
                  </span>
                  <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
                    Needs +{Math.max(10, product.reorderMax - currentStock)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Filters Section (Explicitly required in PDF Page 1) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">Dynamic Inventory Operations Filter</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter across Receipts, Deliveries, Internal Moves, and Adjustments simultaneously.
            </p>
          </div>

          {/* Quick Clear Filter */}
          {(filterDocType !== 'all' || filterStatus !== 'all' || filterWarehouse !== 'all' || filterCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setFilterDocType('all');
                setFilterStatus('all');
                setFilterWarehouse('all');
                setFilterCategory('all');
                setSearchQuery('');
              }}
              className="text-xs text-purple-600 hover:text-purple-800 font-semibold underline underline-offset-2 self-start md:self-auto"
            >
              Reset all dynamic filters
            </button>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* 1. By Document Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Document Type
            </label>
            <select
              value={filterDocType}
              onChange={(e) => setFilterDocType(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-hidden font-medium"
            >
              <option value="all">All Document Types</option>
              <option value="Receipt">Receipts (Incoming)</option>
              <option value="Delivery">Delivery (Outgoing)</option>
              <option value="Internal">Internal Transfers</option>
              <option value="Adjustment">Stock Adjustments</option>
            </select>
          </div>

          {/* 2. By Status */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-hidden font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="waiting">Waiting</option>
              <option value="ready">Ready</option>
              <option value="done">Done</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* 3. By Warehouse or Location */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Warehouse / Location
            </label>
            <select
              value={filterWarehouse}
              onChange={(e) => setFilterWarehouse(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-hidden font-medium"
            >
              <option value="all">All Warehouses & Locations</option>
              <optgroup label="Warehouses">
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.code})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Locations">
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.code})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* 4. By Product Category */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Product Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-hidden font-medium"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Filter Text
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ref, item, partner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Filtered Results Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Partner / Destination</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Items / Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOperations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No operations match the selected dynamic filters.
                  </td>
                </tr>
              ) : (
                filteredOperations.map((op) => {
                  let docTypeBadge = 'bg-slate-100 text-slate-700';
                  if (op.docType === 'Receipt') docTypeBadge = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                  if (op.docType === 'Delivery') docTypeBadge = 'bg-amber-50 text-amber-700 border border-amber-200';
                  if (op.docType === 'Internal') docTypeBadge = 'bg-blue-50 text-blue-700 border border-blue-200';
                  if (op.docType === 'Adjustment') docTypeBadge = 'bg-rose-50 text-rose-700 border border-rose-200';

                  return (
                    <tr key={`${op.docType}-${op.id}`} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${docTypeBadge}`}>
                          {op.docType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-purple-950">
                        {op.reference}
                      </td>
                      <td className="py-3 px-4 text-slate-800">
                        {op.partner}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {op.date}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={op.itemsSummary}>
                        {op.itemsSummary}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={op.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {op.status !== 'done' && op.status !== 'canceled' ? (
                          <button
                            onClick={() => {
                              if (op.docType === 'Receipt') validateReceipt(op.id);
                              if (op.docType === 'Delivery') validateDelivery(op.id);
                              if (op.docType === 'Internal') validateTransfer(op.id);
                              if (op.docType === 'Adjustment') validateAdjustment(op.id);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Validate
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Launchpad to Operations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('receipts')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Receipts</h4>
          <p className="text-xs text-slate-500 mt-1">
            Vendor deliveries with automatic location stock increment.
          </p>
          <div className="mt-3 flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
            <span>Manage Receipts</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('deliveries')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Delivery Orders</h4>
          <p className="text-xs text-slate-500 mt-1">
            Picking & packing workflow with automated stock decrement.
          </p>
          <div className="mt-3 flex items-center text-xs font-semibold text-amber-600 group-hover:translate-x-1 transition-transform">
            <span>Manage Deliveries</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('transfers')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Internal Transfers</h4>
          <p className="text-xs text-slate-500 mt-1">
            Move stock between warehouses or floor racks safely.
          </p>
          <div className="mt-3 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
            <span>Manage Transfers</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('adjustments')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Stock Adjustments</h4>
          <p className="text-xs text-slate-500 mt-1">
            Reconcile physical counts vs system records and log damage.
          </p>
          <div className="mt-3 flex items-center text-xs font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
            <span>Manage Adjustments</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
