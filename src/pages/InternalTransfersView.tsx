import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  ArrowRightLeft, 
  Plus, 
  Search, 
  CheckCircle2, 
  Building2, 
  ArrowRight, 
  Trash2, 
  X,
  Layers
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { TransferItem } from '../types';

export const InternalTransfersView: React.FC = () => {
  const { 
    transfers, 
    products, 
    warehouses, 
    locations, 
    createTransfer, 
    validateTransfer,
    getProductStockByLocation 
  } = useInventory();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [sourceWarehouseId, setSourceWarehouseId] = useState('');
  const [sourceLocationId, setSourceLocationId] = useState('');
  const [destWarehouseId, setDestWarehouseId] = useState('');
  const [destLocationId, setDestLocationId] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([
    { productId: products[0]?.id || '', quantity: 20 }
  ]);

  const openCreateModal = () => {
    const wh1 = warehouses[0]?.id || '';
    const wh2 = warehouses[1]?.id || warehouses[0]?.id || '';
    const loc1 = locations.find((l) => l.warehouseId === wh1 && l.type === 'internal')?.id || locations[0]?.id || '';
    const loc2 = locations.find((l) => l.warehouseId === wh2 && l.type === 'internal' && l.id !== loc1)?.id || locations[1]?.id || '';

    setSourceWarehouseId(wh1);
    setSourceLocationId(loc1);
    setDestWarehouseId(wh2);
    setDestLocationId(loc2);
    setScheduledDate(new Date().toISOString().slice(0, 10));
    setNotes('');
    setItems([{ productId: products[0]?.id || '', quantity: 20 }]);
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setItems([...items, { productId: products[0]?.id || '', quantity: 10 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceLocationId === destLocationId) {
      alert('Source and destination locations cannot be identical.');
      return;
    }
    if (items.length === 0) return;

    const formattedItems: TransferItem[] = items.map((it) => {
      const p = products.find((prod) => prod.id === it.productId);
      return {
        id: `ti-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: it.productId,
        productName: p?.name || 'Item',
        sku: p?.sku || 'SKU',
        quantity: Number(it.quantity),
        uom: p?.uom || 'Units'
      };
    });

    createTransfer({
      sourceWarehouseId,
      sourceLocationId,
      destWarehouseId,
      destLocationId,
      scheduledDate,
      items: formattedItems,
      notes
    });

    setIsModalOpen(false);
  };

  const filteredTransfers = transfers.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.reference.toLowerCase().includes(q) ||
        t.items.some((i) => i.productName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-1 border border-blue-200">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Operations: Internal Transfers
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Internal Company Transfers</h2>
          <p className="text-xs text-slate-500 mt-1">
            Reallocate stock between warehouses, production floors, and storage racks without altering overall company inventory.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Transfer
        </button>
      </div>

      {/* Examples Card matching PDF Page 3 */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-slate-700">Supported Transfer Scenarios:</span>
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium text-slate-700">
            Main Warehouse → Production Floor
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium text-slate-700">
            Rack A → Rack B
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium text-slate-700">
            Warehouse 1 → Warehouse 2
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference or product..."
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
            <option value="all">All Transfers ({transfers.length})</option>
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
                <th className="py-3 px-4">Source Location</th>
                <th className="py-3 px-4">Destination Location</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Moved Items</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No internal transfers recorded.
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((t) => {
                  const srcLoc = locations.find((l) => l.id === t.sourceLocationId);
                  const destLoc = locations.find((l) => l.id === t.destLocationId);

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-purple-950">
                        {t.reference}
                      </td>
                      <td className="py-3 px-4 text-slate-800">
                        <div className="font-semibold">{srcLoc?.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{srcLoc?.code}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-800">
                        <div className="font-semibold">{destLoc?.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{destLoc?.code}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {t.scheduledDate}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {t.items.map((it) => (
                            <div key={it.id} className="text-slate-800 flex items-center gap-1.5">
                              <span className="font-bold text-blue-700 font-mono">
                                {it.quantity} {it.uom}
                              </span>
                              <span>{it.productName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({it.sku})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={t.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {t.status !== 'done' && t.status !== 'canceled' ? (
                          <button
                            onClick={() => validateTransfer(t.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Validate Move
                          </button>
                        ) : (
                          <span className="text-[11px] text-blue-600 font-semibold font-mono">
                            ✓ Transferred
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
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Schedule Internal Stock Transfer</h3>
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
                {/* Source */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    From (Source)
                  </span>
                  <div>
                    <label className="block text-slate-600 mb-1">Source Warehouse</label>
                    <select
                      value={sourceWarehouseId}
                      onChange={(e) => {
                        setSourceWarehouseId(e.target.value);
                        const loc = locations.find((l) => l.warehouseId === e.target.value && l.type === 'internal');
                        if (loc) setSourceLocationId(loc.id);
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-hidden font-medium"
                    >
                      {warehouses.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">Source Location *</label>
                    <select
                      value={sourceLocationId}
                      onChange={(e) => setSourceLocationId(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-hidden font-medium"
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

                {/* Destination */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    To (Destination)
                  </span>
                  <div>
                    <label className="block text-slate-600 mb-1">Destination Warehouse</label>
                    <select
                      value={destWarehouseId}
                      onChange={(e) => {
                        setDestWarehouseId(e.target.value);
                        const loc = locations.find((l) => l.warehouseId === e.target.value && l.type === 'internal' && l.id !== sourceLocationId);
                        if (loc) setDestLocationId(loc.id);
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-hidden font-medium"
                    >
                      {warehouses.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">Destination Location *</label>
                    <select
                      value={destLocationId}
                      onChange={(e) => setDestLocationId(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-hidden font-medium"
                    >
                      {locations
                        .filter((l) => l.type === 'internal' && (!destWarehouseId || l.warehouseId === destWarehouseId))
                        .map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name} ({loc.code})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
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

              {/* Items Section */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Products to Relocate</span>
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
                                {p.name} ({p.sku}) — Available at source: {getProductStockByLocation(p.id, sourceLocationId)} {p.uom}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-32">
                          <input
                            type="number"
                            placeholder="Move Qty"
                            value={it.quantity}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[idx].quantity = Number(e.target.value);
                              setItems(newItems);
                            }}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-hidden font-mono font-bold text-blue-700"
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
                <label className="block font-bold text-slate-700 mb-1">Transfer Purpose / Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Move raw steel to assembly production floor..."
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs transition-colors"
                >
                  Confirm Transfer Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
