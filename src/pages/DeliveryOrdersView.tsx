import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  ArrowUpRight, 
  Plus, 
  Search, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  PackageCheck, 
  Box, 
  Trash2, 
  X,
  Truck,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { DeliveryItem } from '../types';

export const DeliveryOrdersView: React.FC = () => {
  const { 
    deliveries, 
    products, 
    warehouses, 
    locations, 
    createDelivery, 
    updateDeliveryStep, 
    validateDelivery,
    getProductStockByLocation 
  } = useInventory();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [customer, setCustomer] = useState('');
  const [sourceWarehouseId, setSourceWarehouseId] = useState('');
  const [sourceLocationId, setSourceLocationId] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{ productId: string; demandQty: number }>>([
    { productId: products[1]?.id || products[0]?.id || '', demandQty: 10 }
  ]);

  const openCreateModal = () => {
    const defaultWh = warehouses[0]?.id || '';
    const defaultLoc = locations.find((l) => l.warehouseId === defaultWh && l.type === 'internal')?.id || locations[0]?.id || '';
    setCustomer('');
    setSourceWarehouseId(defaultWh);
    setSourceLocationId(defaultLoc);
    setScheduledDate(new Date().toISOString().slice(0, 10));
    setNotes('');
    setItems([{ productId: products[1]?.id || products[0]?.id || '', demandQty: 10 }]);
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setItems([...items, { productId: products[0]?.id || '', demandQty: 5 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim() || items.length === 0) return;

    const formattedItems: DeliveryItem[] = items.map((it) => {
      const p = products.find((prod) => prod.id === it.productId);
      return {
        id: `di-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: it.productId,
        productName: p?.name || 'Item',
        sku: p?.sku || 'SKU',
        demandQty: Number(it.demandQty),
        pickedQty: 0,
        packedQty: 0,
        uom: p?.uom || 'Units'
      };
    });

    createDelivery({
      customer,
      sourceWarehouseId,
      sourceLocationId,
      scheduledDate,
      items: formattedItems,
      notes
    });

    setIsModalOpen(false);
  };

  const filteredDeliveries = deliveries.filter((d) => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        d.reference.toLowerCase().includes(q) ||
        d.customer.toLowerCase().includes(q) ||
        d.items.some((i) => i.productName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-1 border border-amber-200">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Operations: Delivery Orders (Outgoing Goods)
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customer Delivery Orders</h2>
          <p className="text-xs text-slate-500 mt-1">
            Execute picking, packing, and validation stages. Stock automatically decreases upon dispatch validation.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Delivery Order
        </button>
      </div>

      {/* Workflow Process Banner as defined in PDF: 1. Pick items -> 2. Pack items -> 3. Validate */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border border-slate-800 text-xs">
        <div className="flex items-center gap-2 font-bold text-purple-300">
          <Truck className="w-4 h-4 text-amber-400" />
          <span>Core Outgoing Workflow Stages:</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">1</span>
            <span>Pick Items</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">2</span>
            <span>Pack Items</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">3</span>
            <span>Validate (Stock −)</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference, customer, or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-purple-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:bg-white focus:border-purple-500 outline-hidden font-medium"
          >
            <option value="all">All Orders ({deliveries.length})</option>
            <option value="draft">Draft</option>
            <option value="ready">Ready (Picking / Packing)</option>
            <option value="done">Done (Shipped)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Source Location</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Demand Items</th>
                <th className="py-3 px-4 text-center">Process Stage</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Workflow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No delivery orders found.
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((d) => {
                  const srcLoc = locations.find((l) => l.id === d.sourceLocationId);
                  const srcWh = warehouses.find((w) => w.id === d.sourceWarehouseId);

                  return (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-purple-950">
                        {d.reference}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{d.customer}</div>
                        {d.notes && (
                          <div className="text-[10px] text-slate-400 truncate max-w-xs">{d.notes}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div>{srcLoc?.name || 'Main Storage'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{srcWh?.name}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {d.scheduledDate}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {d.items.map((it) => {
                            const avail = getProductStockByLocation(it.productId, d.sourceLocationId);
                            const hasEnough = avail >= it.demandQty;

                            return (
                              <div key={it.id} className="text-slate-800 flex items-center gap-1.5">
                                <span className="font-bold text-rose-700 font-mono">
                                  -{it.demandQty} {it.uom}
                                </span>
                                <span>{it.productName}</span>
                                {d.status !== 'done' && (
                                  <span
                                    className={`text-[9px] font-mono px-1 rounded ${
                                      hasEnough ? 'text-slate-500 bg-slate-100' : 'text-rose-700 bg-rose-50 font-bold'
                                    }`}
                                  >
                                    (Avail: {avail})
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono text-xs uppercase px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {d.step}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={d.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {d.status === 'done' ? (
                          <span className="text-[11px] text-emerald-600 font-semibold font-mono">
                            ✓ Stock Decreased
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {d.step === 'draft' && (
                              <button
                                onClick={() => updateDeliveryStep(d.id, 'picking')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                              >
                                <PackageCheck className="w-3 h-3" />
                                1. Pick Items
                              </button>
                            )}

                            {d.step === 'picking' && (
                              <button
                                onClick={() => updateDeliveryStep(d.id, 'packing')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                              >
                                <Box className="w-3 h-3" />
                                2. Pack Items
                              </button>
                            )}

                            {(d.step === 'packing' || d.step === 'ready') && (
                              <button
                                onClick={() => validateDelivery(d.id)}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                3. Validate
                              </button>
                            )}
                          </div>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Create Customer Delivery Order</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer / Client *</label>
                  <input
                    type="text"
                    required
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="e.g. Global Tech Solutions Inc."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheduled Date *</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Source Warehouse</label>
                  <select
                    value={sourceWarehouseId}
                    onChange={(e) => {
                      setSourceWarehouseId(e.target.value);
                      const loc = locations.find((l) => l.warehouseId === e.target.value && l.type === 'internal');
                      if (loc) setSourceLocationId(loc.id);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Source Storage Location *</label>
                  <select
                    value={sourceLocationId}
                    onChange={(e) => setSourceLocationId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
                  >
                    {locations
                      .filter((l) => l.type === 'internal' && (!sourceWarehouseId || l.warehouseId === sourceWarehouseId))
                      .map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} ({loc.code})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Items Section */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Products to Ship</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Product Line
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((it, idx) => {
                    const avail = getProductStockByLocation(it.productId, sourceLocationId);

                    return (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                        <div className="flex-1">
                          <select
                            value={it.productId}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[idx].productId = e.target.value;
                              setItems(newItems);
                            }}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-hidden font-medium"
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.sku}) — Available: {getProductStockByLocation(p.id, sourceLocationId)} {p.uom}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-32">
                          <input
                            type="number"
                            placeholder="Demand Qty"
                            value={it.demandQty}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[idx].demandQty = Number(e.target.value);
                              setItems(newItems);
                            }}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-hidden font-mono font-bold text-rose-700"
                          />
                        </div>

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Shipping Notes / Sales Order</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Sales order reference, carrier instructions..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs transition-colors"
                >
                  Create Delivery Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
