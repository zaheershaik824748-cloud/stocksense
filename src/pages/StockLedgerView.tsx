import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  FileSpreadsheet,
  Boxes,
  RotateCcw
} from 'lucide-react';
import { DocumentType } from '../types';

export const StockLedgerView: React.FC = () => {
  const { stockLedger, products } = useInventory();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');

  const filteredEntries = stockLedger.filter((entry) => {
    if (typeFilter !== 'all' && entry.documentType !== typeFilter) return false;
    if (selectedProduct !== 'all' && entry.productId !== selectedProduct) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        entry.reference.toLowerCase().includes(q) ||
        entry.productName.toLowerCase().includes(q) ||
        entry.sku.toLowerCase().includes(q) ||
        entry.fromLocationName.toLowerCase().includes(q) ||
        entry.toLocationName.toLowerCase().includes(q) ||
        (entry.notes && entry.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Reference',
      'Type',
      'SKU',
      'Product',
      'From Location',
      'To Location',
      'Quantity',
      'Unit',
      'Status',
      'Performed By',
      'Notes'
    ];
    const rows = filteredEntries.map((e) => [
      `"${e.date}"`,
      `"${e.reference}"`,
      `"${e.documentType}"`,
      `"${e.sku}"`,
      `"${e.productName}"`,
      `"${e.fromLocationName}"`,
      `"${e.toLocationName}"`,
      e.quantity,
      `"${e.uom}"`,
      `"${e.status}"`,
      `"${e.performedBy}"`,
      `"${e.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StockSense_Stock_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-1 border border-purple-200">
            <History className="w-3.5 h-3.5" />
            Navigation: 3. Move History / Stock Ledger
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Stock Ledger Audit Trail</h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable trace of every stock movement, receipts from vendors, deliveries, internal shifts, and count adjustments.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Download className="w-4 h-4 text-slate-500" />
          Export Ledger (CSV)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference, SKU, location, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-purple-500 outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Document Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:bg-white focus:border-purple-500 outline-hidden font-medium"
            >
              <option value="all">All Types</option>
              <option value="Receipt">Receipts</option>
              <option value="Delivery">Deliveries</option>
              <option value="Internal">Internal Moves</option>
              <option value="Adjustment">Adjustments</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Product:</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:bg-white focus:border-purple-500 outline-hidden font-medium max-w-[180px] truncate"
            >
              <option value="all">All Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Document Ref</th>
                <th className="py-3 px-4">Doc Type</th>
                <th className="py-3 px-4">Product / SKU</th>
                <th className="py-3 px-4">From Location</th>
                <th className="py-3 px-4 text-center">→</th>
                <th className="py-3 px-4">To Location</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4">Author / Staff</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No ledger entries match the criteria.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  let typeBadge = 'bg-slate-100 text-slate-700';
                  if (entry.documentType === 'Receipt') typeBadge = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                  if (entry.documentType === 'Delivery') typeBadge = 'bg-amber-50 text-amber-700 border border-amber-200';
                  if (entry.documentType === 'Internal') typeBadge = 'bg-blue-50 text-blue-700 border border-blue-200';
                  if (entry.documentType === 'Adjustment') typeBadge = 'bg-rose-50 text-rose-700 border border-rose-200';

                  const isPositive = entry.quantity > 0;
                  const isNegative = entry.quantity < 0;

                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {entry.date}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-purple-950">
                        {entry.reference}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${typeBadge}`}>
                          {entry.documentType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{entry.productName}</div>
                        <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-bold">
                          {entry.sku}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {entry.fromLocationName}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-400">
                        <ArrowRight className="w-3.5 h-3.5 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {entry.toLocationName}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            isNegative
                              ? 'text-rose-700 bg-rose-50'
                              : isPositive
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-slate-700'
                          }`}
                        >
                          {entry.quantity > 0 ? `+${entry.quantity}` : entry.quantity} {entry.uom}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {entry.performedBy}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate" title={entry.notes}>
                        {entry.notes || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
