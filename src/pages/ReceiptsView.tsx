import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  ArrowDownLeft, 
  Plus, 
  Search, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  FileText, 
  Trash2, 
  X,
  Boxes,
  Truck
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { ReceiptItem } from '../types';

export const ReceiptsView: React.FC = () => {
  const { 
    receipts, 
    products, 
    warehouses, 
    locations, 
    createReceipt, 
    validateReceipt, 
    updateReceiptStatus 
  } = useInventory();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [vendor, setVendor] = useState('');
  const [destinationWarehouseId, setDestinationWarehouseId] = useState('');
  const [destinationLocationId, setDestinationLocationId] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{ productId: string; expectedQty: number; receivedQty: number }>>([
    { productId: products[0]?.id || '', expectedQty: 50, receivedQty: 50 }
  ]);

  const openCreateModal = () => {
    const defaultWh = warehouses[0]?.id || '';
    const defaultLoc = locations.find((l) => l.warehouseId === defaultWh && l.type === 'internal')?.id || locations[0]?.id || '';
    setVendor('');
    setDestinationWarehouseId(defaultWh);
    setDestinationLocationId(defaultLoc);
    setScheduledDate(new Date().toISOString().slice(0, 10));
    setNotes('');
    setItems([{ productId: products[0]?.id || '', expectedQty: 50, receivedQty: 50 }]);
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setItems([...items, { productId: products[0]?.id || '', expectedQty: 25, receivedQty: 25 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor.trim() || items.length === 0) return;

    const formattedItems: ReceiptItem[] = items.map((it) => {
      const p = products.find((prod) => prod.id === it.productId);
      return {
        id: `ri-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: it.productId,
        productName: p?.name || 'Item',
        sku: p?.sku || 'SKU',
        expectedQty: Number(it.expectedQty),
        receivedQty: Number(it.receivedQty),
        uom: p?.uom || 'Units'
      };
    });

    createReceipt({
      vendor,
      destinationWarehouseId,
      destinationLocationId,
      scheduledDate,
      items: formattedItems,
      notes
    });

    setIsModalOpen(false);
  };

  const filteredReceipts = receipts.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.reference.toLowerCase().includes(q) ||
        r.vendor.toLowerCase().includes(q) ||
        r.items.some((i) => i.productName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-1 border border-emerald-200">
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Operations: Receipts (Incoming Goods)
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Vendor Stock Receipts</h2>
          <p className="text-xs text-slate-500 mt-1">
            Accept supplier purchase shipments. Validation instantly increments stock and writes to the audit ledger.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Receipt
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference, vendor, or product..."
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
            <option value="all">All Statuses ({receipts.length})</option>
            <option value="draft">Draft</option>
            <option value="waiting">Waiting</option>
            <option value="ready">Ready</option>
            <option value="done">Done</option>
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
                <th className="py-3 px-4">Vendor / Supplier</th>
                <th className="py-3 px-4">Destination Storage</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Line Items (Qty)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No receipts found.
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((r) => {
                  const destLoc = locations.find((l) => l.id === r.destinationLocationId);
                  const destWh = warehouses.find((w) => w.id === r.destinationWarehouseId);

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-purple-950">
                        {r.reference}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{r.vendor}</div>
                        {r.notes && (
                          <div className="text-[10px] text-slate-400 truncate max-w-xs">{r.notes}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div>{destLoc?.name || 'Main Storage'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{destWh?.name}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {r.scheduledDate}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {r.items.map((it) => (
                            <div key={it.id} className="text-slate-800 flex items-center gap-1.5">
                              <span className="font-bold text-emerald-700 font-mono">
                                +{it.receivedQty} {it.uom}
                              </span>
                              <span>{it.productName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({it.sku})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={r.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {r.status !== 'done' && r.status !== 'canceled' ? (
                          <button
                            onClick={() => validateReceipt(r.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Validate Receipt
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-semibold font-mono">
                            ✓ Stock + Added
                          </span>
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
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Create Vendor Receipt</h3>
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
                  <label className="block font-bold text-slate-700 mb-1">Vendor / Supplier *</label>
                  <input
                    type="text"
                    required
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g. Apex Steel Suppliers Ltd"
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
                  <label className="block font-bold text-slate-700 mb-1">Destination Warehouse</label>
                  <select
                    value={destinationWarehouseId}
                    onChange={(e) => {
                      setDestinationWarehouseId(e.target.value);
                      const loc = locations.find((l) => l.warehouseId === e.target.value && l.type === 'internal');
                      if (loc) setDestinationLocationId(loc.id);
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
                  <label className="block font-bold text-slate-700 mb-1">Destination Location *</label>
                  <select
                    value={destinationLocationId}
                    onChange={(e) => setDestinationLocationId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
                  >
                    {locations
                      .filter((l) => l.type === 'internal' && (!destinationWarehouseId || l.warehouseId === destinationWarehouseId))
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
                  <span className="font-bold text-slate-800">Received Products</span>
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
                  {items.map((it, idx) => (
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
                              {p.name} ({p.sku}) — {p.uom}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Expected"
                          value={it.expectedQty}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[idx].expectedQty = Number(e.target.value);
                            setItems(newItems);
                          }}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-hidden font-mono"
                        />
                      </div>

                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Received"
                          value={it.receivedQty}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[idx].receivedQty = Number(e.target.value);
                            setItems(newItems);
                          }}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-hidden font-mono font-bold text-emerald-700"
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
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / PO Reference</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="PO number, supplier bill number, freight remarks..."
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs transition-colors"
                >
                  Create Receipt Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
