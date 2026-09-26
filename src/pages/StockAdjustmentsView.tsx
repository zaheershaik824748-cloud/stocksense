import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  SlidersHorizontal, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  FileText, 
  X,
  History
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { AdjustmentReason } from '../types';

export const StockAdjustmentsView: React.FC = () => {
  const { 
    adjustments, 
    products, 
    warehouses, 
    locations, 
    getProductStockByLocation, 
    createAdjustment, 
    validateAdjustment 
  } = useInventory();

  const [search, setSearch] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [warehouseId, setWarehouseId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [productId, setProductId] = useState('');
  const [countedQty, setCountedQty] = useState<number>(0);
  const [reason, setReason] = useState<AdjustmentReason>('Damaged Items');
  const [notes, setNotes] = useState('');

  const openCreateModal = () => {
    const wh = warehouses[0]?.id || '';
    const loc = locations.find((l) => l.warehouseId === wh && l.type === 'internal')?.id || locations[0]?.id || '';
    const prod = products[0]?.id || '';
    const currentRecorded = getProductStockByLocation(prod, loc);

    setWarehouseId(wh);
    setLocationId(loc);
    setProductId(prod);
    setCountedQty(Math.max(0, currentRecorded - 3)); // default to small adjustment e.g. -3 damage like PDF
    setReason('Damaged Items');
    setNotes('3 kg steel damaged by warehouse hoist clamp');
    setIsModalOpen(true);
  };

  const selectedProduct = products.find((p) => p.id === productId);
  const recordedQty = productId && locationId ? getProductStockByLocation(productId, locationId) : 0;
  const difference = countedQty - recordedQty;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !locationId) return;

    const newAdj = createAdjustment({
      warehouseId,
      locationId,
      productId,
      productName: selectedProduct.name,
      sku: selectedProduct.sku,
      uom: selectedProduct.uom,
      recordedQty,
      countedQty: Number(countedQty),
      reason,
      notes
    });

    // Auto-validate immediately so stock updates seamlessly
    validateAdjustment(newAdj.id);

    setIsModalOpen(false);
  };

  const filteredAdjustments = adjustments.filter((a) => {
    if (reasonFilter !== 'all' && a.reason !== reasonFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.reference.toLowerCase().includes(q) ||
        a.productName.toLowerCase().includes(q) ||
        a.sku.toLowerCase().includes(q) ||
        a.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-1 border border-rose-200">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Operations: Stock Adjustments (Physical Count)
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Stock Adjustments</h2>
          <p className="text-xs text-slate-500 mt-1">
            Reconcile physical inventory counts against system records and log damage, shrinkage, or audit corrections.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Adjustment
        </button>
      </div>

      {/* PDF Specification Explanation Card */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-800">Inventory Adjustment Reconciliation Flow:</span>
          <p className="text-slate-500 mt-0.5">
            1. Select Product & Location → 2. Review Recorded System Qty → 3. Input Counted Physical Qty → 4. System auto-updates balance & logs ledger.
          </p>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-slate-700 shrink-0">
          Example: 3 kg steel damaged → Stock: −3
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference, product, or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-purple-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Reason:</label>
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:bg-white focus:border-purple-500 outline-hidden font-medium"
          >
            <option value="all">All Reasons ({adjustments.length})</option>
            <option value="Damaged Items">Damaged Items</option>
            <option value="Physical Count Mismatch">Physical Count Mismatch</option>
            <option value="Loss / Theft">Loss / Theft</option>
            <option value="Found Items">Found Items</option>
            <option value="Annual Audit">Annual Audit</option>
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
                <th className="py-3 px-4">Product / SKU</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Recorded Qty</th>
                <th className="py-3 px-4 text-center">Physical Count</th>
                <th className="py-3 px-4 text-center">Difference</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAdjustments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No stock adjustments recorded.
                  </td>
                </tr>
              ) : (
                filteredAdjustments.map((a) => {
                  const loc = locations.find((l) => l.id === a.locationId);

                  return (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-purple-950">
                        {a.reference}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{a.productName}</div>
                        <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-bold">
                          {a.sku}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div>{loc?.name || 'Storage'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{loc?.code}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600">
                        {a.recordedQty} {a.uom}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                        {a.countedQty} {a.uom}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-mono font-extrabold px-2 py-0.5 rounded text-xs ${
                            a.difference < 0
                              ? 'text-rose-700 bg-rose-50 border border-rose-200'
                              : a.difference > 0
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                              : 'text-slate-600 bg-slate-100'
                          }`}
                        >
                          {a.difference > 0 ? `+${a.difference}` : a.difference} {a.uom}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{a.reason}</span>
                        {a.notes && (
                          <div className="text-[10px] text-slate-400 truncate max-w-xs">{a.notes}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={a.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {a.status !== 'done' ? (
                          <button
                            onClick={() => validateAdjustment(a.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Apply Adjustment
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">
                            Reconciled ✓
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">Record Physical Inventory Count</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Warehouse</label>
                  <select
                    value={warehouseId}
                    onChange={(e) => {
                      setWarehouseId(e.target.value);
                      const loc = locations.find((l) => l.warehouseId === e.target.value && l.type === 'internal');
                      if (loc) setLocationId(loc.id);
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
                  <label className="block font-bold text-slate-700 mb-1">Location / Bin *</label>
                  <select
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
                  >
                    {locations
                      .filter((l) => l.type === 'internal' && (!warehouseId || l.warehouseId === warehouseId))
                      .map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} ({loc.code})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Product *</label>
                <select
                  value={productId}
                  onChange={(e) => {
                    setProductId(e.target.value);
                    const cur = getProductStockByLocation(e.target.value, locationId);
                    setCountedQty(cur);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — [{p.uom}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Count Reconciliation Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">System Recorded</div>
                  <div className="text-lg font-mono font-bold text-slate-800 mt-1">
                    {recordedQty} <span className="text-xs font-normal text-slate-500">{selectedProduct?.uom}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-purple-200">
                  <label className="block text-[10px] uppercase font-bold text-purple-700 mb-1">
                    Physical Counted *
                  </label>
                  <input
                    type="number"
                    value={countedQty}
                    onChange={(e) => setCountedQty(Number(e.target.value))}
                    className="w-full text-center font-mono font-bold text-lg text-purple-900 border border-purple-300 rounded-md py-0.5 outline-hidden focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Difference</div>
                  <div
                    className={`text-lg font-mono font-black mt-1 ${
                      difference < 0 ? 'text-rose-600' : difference > 0 ? 'text-emerald-600' : 'text-slate-600'
                    }`}
                  >
                    {difference > 0 ? `+${difference}` : difference} <span className="text-xs font-normal text-slate-500">{selectedProduct?.uom}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Adjustment *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as AdjustmentReason)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
                >
                  <option value="Damaged Items">Damaged Items (Scrap)</option>
                  <option value="Physical Count Mismatch">Physical Count Mismatch</option>
                  <option value="Loss / Theft">Loss / Theft</option>
                  <option value="Found Items">Found Items (Positive Variance)</option>
                  <option value="Annual Audit">Annual Stock Audit</option>
                  <option value="Expired / Scrap">Expired / Obsolete Scrap</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Explanation</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 3 kg steel damaged during forklift offloading..."
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
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-xs transition-colors"
                >
                  Apply & Record Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
