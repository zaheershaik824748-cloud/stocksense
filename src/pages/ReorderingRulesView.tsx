import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Clock, 
  AlertTriangle, 
  Plus, 
  PackagePlus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  ArrowRight,
  X,
  Search
} from 'lucide-react';
import { ReorderingRule } from '../types';

interface ReorderingRulesViewProps {
  onNavigateToReceipts: () => void;
}

export const ReorderingRulesView: React.FC<ReorderingRulesViewProps> = ({ onNavigateToReceipts }) => {
  const { 
    reorderingRules, 
    products, 
    warehouses, 
    locations, 
    getProductTotalStock, 
    addReorderingRule, 
    updateReorderingRule, 
    deleteReorderingRule,
    createReceipt
  } = useInventory();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ReorderingRule | null>(null);

  const [productId, setProductId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [minQty, setMinQty] = useState(20);
  const [maxQty, setMaxQty] = useState(100);
  const [toOrderQty, setToOrderQty] = useState(50);

  const openCreateModal = () => {
    setEditingRule(null);
    setProductId(products[0]?.id || '');
    setWarehouseId(warehouses[0]?.id || '');
    setMinQty(25);
    setMaxQty(100);
    setToOrderQty(50);
    setIsModalOpen(true);
  };

  const openEditModal = (rule: ReorderingRule) => {
    setEditingRule(rule);
    setProductId(rule.productId);
    setWarehouseId(rule.warehouseId);
    setMinQty(rule.minQty);
    setMaxQty(rule.maxQty);
    setToOrderQty(rule.toOrderQty);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (editingRule) {
      updateReorderingRule(editingRule.id, {
        productId,
        productName: product.name,
        sku: product.sku,
        warehouseId,
        minQty: Number(minQty),
        maxQty: Number(maxQty),
        toOrderQty: Number(toOrderQty)
      });
    } else {
      addReorderingRule({
        productId,
        productName: product.name,
        sku: product.sku,
        warehouseId,
        minQty: Number(minQty),
        maxQty: Number(maxQty),
        toOrderQty: Number(toOrderQty),
        active: true
      });
    }
    setIsModalOpen(false);
  };

  // Quick 1-click Reorder Trigger to create an incoming Receipt
  const handleQuickReorder = (rule: ReorderingRule) => {
    const product = products.find((p) => p.id === rule.productId);
    const wh = warehouses.find((w) => w.id === rule.warehouseId) || warehouses[0];
    const targetLoc = locations.find((l) => l.warehouseId === wh.id && l.type === 'internal') || locations[0];

    const receipt = createReceipt({
      vendor: `Automated Restock Partner (${product?.categoryName || 'Vendor'})`,
      destinationWarehouseId: wh.id,
      destinationLocationId: targetLoc.id,
      scheduledDate: new Date().toISOString().slice(0, 10),
      items: [
        {
          id: `ri-auto-${Date.now()}`,
          productId: rule.productId,
          productName: rule.productName,
          sku: rule.sku,
          expectedQty: rule.toOrderQty,
          receivedQty: rule.toOrderQty,
          uom: product?.uom || 'Units'
        }
      ],
      notes: `Automated replenishment triggered by Reordering Rule: Stock was below min threshold (${rule.minQty}). Target order: ${rule.toOrderQty}.`
    });

    onNavigateToReceipts();
  };

  const filteredRules = reorderingRules.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.productName.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-1 border border-purple-200">
            <Clock className="w-3.5 h-3.5" />
            Navigation: 1. Products → Reordering Rules
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Automated Reordering Rules</h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain minimum stock buffers and trigger automatic restock receipts before stock-outs occur.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Rule
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rules by product or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-purple-500 outline-hidden"
          />
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Product / SKU</th>
                <th className="py-3 px-4">Warehouse</th>
                <th className="py-3 px-4 text-center">Min Quantity</th>
                <th className="py-3 px-4 text-center">Max Quantity</th>
                <th className="py-3 px-4 text-center">Current Stock</th>
                <th className="py-3 px-4 text-center">Order Qty</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRules.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No reordering rules defined.
                  </td>
                </tr>
              ) : (
                filteredRules.map((rule) => {
                  const currentStock = getProductTotalStock(rule.productId);
                  const isTriggered = currentStock <= rule.minQty;
                  const wh = warehouses.find((w) => w.id === rule.warehouseId);
                  const product = products.find((p) => p.id === rule.productId);

                  return (
                    <tr
                      key={rule.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isTriggered ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{rule.productName}</div>
                        <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-bold">
                          {rule.sku}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {wh ? `${wh.name} (${wh.code})` : 'All Facilities'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                        {rule.minQty} {product?.uom}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                        {rule.maxQty} {product?.uom}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-mono font-extrabold px-2.5 py-0.5 rounded text-xs ${
                            isTriggered
                              ? 'text-amber-800 bg-amber-100 border border-amber-300 animate-pulse-subtle'
                              : 'text-slate-900 bg-slate-100'
                          }`}
                        >
                          {currentStock} {product?.uom}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-purple-700">
                        +{rule.toOrderQty} {product?.uom}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isTriggered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Trigger Alert
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Adequate Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isTriggered && (
                            <button
                              onClick={() => handleQuickReorder(rule)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                              title="Generate Restock Receipt for this rule"
                            >
                              <PackagePlus className="w-3.5 h-3.5" />
                              Order Now
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(rule)}
                            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteReorderingRule(rule.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingRule ? 'Edit Reordering Rule' : 'New Reordering Rule'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Product *</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  disabled={!!editingRule}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Warehouse *</label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    value={minQty}
                    onChange={(e) => setMinQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Ceiling</label>
                  <input
                    type="number"
                    value={maxQty}
                    onChange={(e) => setMaxQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Replenish Qty</label>
                  <input
                    type="number"
                    value={toOrderQty}
                    onChange={(e) => setToOrderQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-mono"
                  />
                </div>
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-xs transition-colors"
                >
                  {editingRule ? 'Save Changes' : 'Create Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
