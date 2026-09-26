import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Boxes, 
  Building2, 
  MapPin, 
  Search, 
  Filter, 
  ArrowRight,
  TrendingDown,
  Layers,
  ArrowRightLeft
} from 'lucide-react';

interface StockAvailabilityViewProps {
  onNavigateToTransfer: () => void;
}

export const StockAvailabilityView: React.FC<StockAvailabilityViewProps> = ({ onNavigateToTransfer }) => {
  const { products, warehouses, locations, productStock, getProductTotalStock, getProductStockByLocation } = useInventory();
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredLocations = locations.filter((loc) => {
    if (loc.type !== 'internal') return false; // display internal storage bins/floors
    if (selectedWarehouse !== 'all' && loc.warehouseId !== selectedWarehouse) return false;
    return true;
  });

  const filteredProducts = products.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-1 border border-purple-200">
            <Boxes className="w-3.5 h-3.5" />
            Navigation: 1. Products → Stock Availability
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Stock Availability Per Location
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time balance breakdown across warehouse storage bays, racks, and production floors.
          </p>
        </div>

        <button
          onClick={onNavigateToTransfer}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Move Stock (Internal Transfer)
        </button>
      </div>

      {/* Filter and Warehouse Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-purple-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Warehouse:</label>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:bg-white focus:border-purple-500 outline-hidden font-medium"
          >
            <option value="all">All Warehouses ({warehouses.length})</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name} ({wh.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 border-r border-slate-200 sticky left-0 bg-slate-50 z-10 w-64">
                  Product / SKU
                </th>
                <th className="py-3 px-3 text-center border-r border-slate-200 bg-purple-50/50 text-purple-900 w-28">
                  Total On-Hand
                </th>
                {filteredLocations.map((loc) => {
                  const wh = warehouses.find((w) => w.id === loc.warehouseId);
                  return (
                    <th key={loc.id} className="py-3 px-3 text-center border-r border-slate-100 min-w-[120px]">
                      <div className="font-bold text-slate-800">{loc.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono font-normal">
                        {wh?.code} • {loc.code}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map((p) => {
                const totalStock = getProductTotalStock(p.id);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 border-r border-slate-200 sticky left-0 bg-white z-10">
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[10px] text-purple-800 bg-purple-50 px-1.5 py-0.2 rounded font-bold">
                          {p.sku}
                        </span>
                        <span className="text-[10px] text-slate-400">{p.categoryName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center border-r border-slate-200 bg-purple-50/20 font-mono font-extrabold text-slate-900">
                      <span className={`px-2 py-0.5 rounded text-xs ${totalStock <= p.reorderMin ? 'text-amber-700 bg-amber-50' : 'text-purple-900'}`}>
                        {totalStock} {p.uom}
                      </span>
                    </td>
                    {filteredLocations.map((loc) => {
                      const qty = getProductStockByLocation(p.id, loc.id);
                      return (
                        <td key={loc.id} className="py-3 px-3 text-center border-r border-slate-100">
                          {qty > 0 ? (
                            <span className="font-mono font-bold text-slate-900 bg-slate-100/80 px-2 py-1 rounded-md text-xs">
                              {qty} <span className="text-[10px] text-slate-500 font-normal">{p.uom}</span>
                            </span>
                          ) : (
                            <span className="text-slate-300 font-mono text-xs">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warehouse Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {warehouses.map((wh) => {
          const whLocations = locations.filter((l) => l.warehouseId === wh.id && l.type === 'internal');
          const totalUnitsInWh = productStock
            .filter((s) => s.warehouseId === wh.id)
            .reduce((sum, s) => sum + s.quantity, 0);

          return (
            <div key={wh.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <h4 className="font-bold text-slate-900 text-sm">{wh.name}</h4>
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      {wh.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {wh.address}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900 font-mono">{totalUnitsInWh}</span>
                  <div className="text-[10px] text-slate-400">Total Units</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                {whLocations.map((loc) => {
                  const locUnits = productStock
                    .filter((s) => s.locationId === loc.id)
                    .reduce((sum, s) => sum + s.quantity, 0);

                  return (
                    <span
                      key={loc.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                    >
                      <span>{loc.name}:</span>
                      <strong className="font-mono text-purple-700">{locUnits}</strong>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
