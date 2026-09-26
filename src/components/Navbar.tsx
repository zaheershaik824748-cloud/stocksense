import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Search, 
  Building2, 
  Bell, 
  Shield, 
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface NavbarProps {
  activeTab: ActiveTab;
  onSearchSelect?: (sku: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSearchSelect
}) => {
  const { user, warehouses, products, getLowStockProducts, resetToDefaultData } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const lowStockItems = getLowStockProducts();

  // Search filter
  const searchResults = searchTerm.trim().length > 1
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getPageTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Inventory Dashboard';
      case 'products':
        return 'Product Management & Catalog';
      case 'stock-availability':
        return 'Stock Availability Per Location';
      case 'categories':
        return 'Product Categories';
      case 'reordering-rules':
        return 'Automated Reordering Rules';
      case 'receipts':
        return 'Receipts — Incoming Stock';
      case 'deliveries':
        return 'Delivery Orders — Outgoing Goods';
      case 'transfers':
        return 'Internal Warehouse Transfers';
      case 'adjustments':
        return 'Stock Adjustments & Physical Count';
      case 'ledger':
        return 'Stock Ledger & Move Audit History';
      case 'warehouses':
        return 'Multi-Warehouse & Locations Configuration';
      case 'profile':
        return 'User Profile & Permissions';
      default:
        return 'StockSense IMS';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30 shrink-0 shadow-xs">
      {/* Title & Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          StockSense
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <h1 className="text-base font-bold text-slate-900 tracking-tight">
          {getPageTitle(activeTab)}
        </h1>
      </div>

      {/* Global SKU & Product Search + Actions */}
      <div className="flex items-center gap-4">
        {/* Global SKU Search Bar */}
        <div className="relative w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search SKU (e.g. STL-ROD-01)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs rounded-xl border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-hidden text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Quick Search Dropdown */}
          {searchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 max-h-64 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Matching SKU & Products
              </div>
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (onSearchSelect) onSearchSelect(item.sku);
                    setSearchTerm('');
                  }}
                  className="px-3 py-2 hover:bg-purple-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-[10px] text-slate-500">{item.categoryName} • {item.uom}</p>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded">
                    {item.sku}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Multi-Warehouse Selector Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium border border-slate-200">
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span>{warehouses.length} Warehouses Active</span>
        </div>

        {/* Role Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-200">
          <Shield className="w-3 h-3 text-purple-600" />
          <span>{user?.role || 'Staff'}</span>
        </div>


        {/* Reset State Button */}
        <button
          onClick={resetToDefaultData}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          title="Reset sample data"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
