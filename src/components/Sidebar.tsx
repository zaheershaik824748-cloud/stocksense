import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Tag,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  SlidersHorizontal,
  History,
  Building2,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  PlayCircle,
  HelpCircle,
  Users
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'products'
  | 'stock-availability'
  | 'categories'
  | 'reordering-rules'
  | 'receipts'
  | 'deliveries'
  | 'transfers'
  | 'adjustments'
  | 'ledger'
  | 'warehouses'
  | 'profile';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDemoModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDemoModal
}) => {
  const { user, logout, switchRole, getDashboardKPIs, getLowStockProducts } = useInventory();
  const [productsOpen, setProductsOpen] = useState(true);
  const [operationsOpen, setOperationsOpen] = useState(true);

  const kpis = getDashboardKPIs();
  const lowStockCount = getLowStockProducts().length;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/40 font-black text-lg">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">StockSense</span>
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded font-mono font-medium">IMS</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Modular Inventory Engine</p>
          </div>
        </div>
      </div>

      {/* Demo Scenario Button */}
      <div className="px-3 pt-3">
        <button
          onClick={onOpenDemoModal}
          className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800/80 hover:to-indigo-800/80 border border-purple-700/50 rounded-xl text-xs font-semibold text-purple-200 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span>PDF Flow Walkthrough</span>
          </div>
          <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-300 border border-purple-500/30">
            4-Step
          </span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {/* Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'dashboard'
              ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-900/30'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </div>
        </button>

        {/* 1. Products Section */}
        <div className="pt-2">
          <button
            onClick={() => setProductsOpen(!productsOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-purple-400" />
              <span>1. Products</span>
            </div>
            {productsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {productsOpen && (
            <div className="mt-1 space-y-0.5 pl-2">
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  activeTab === 'products'
                    ? 'bg-purple-600/30 text-purple-200 font-semibold border-l-2 border-purple-500'
                    : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                <span>Products Catalog</span>
                {lowStockCount > 0 && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 rounded font-mono">
                    {lowStockCount} low
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('stock-availability')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  activeTab === 'stock-availability'
                    ? 'bg-purple-600/30 text-purple-200 font-semibold border-l-2 border-purple-500'
                    : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                <span>Stock Per Location</span>
                <Boxes className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  activeTab === 'categories'
                    ? 'bg-purple-600/30 text-purple-200 font-semibold border-l-2 border-purple-500'
                    : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                <span>Product Categories</span>
                <Tag className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('reordering-rules')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  activeTab === 'reordering-rules'
                    ? 'bg-purple-600/30 text-purple-200 font-semibold border-l-2 border-purple-500'
                    : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                <span>Reordering Rules</span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          )}
        </div>

        {/* 2. Operations Section */}
        <div className="pt-2">
          <button
            onClick={() => setOperationsOpen(!operationsOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Boxes className="w-3.5 h-3.5 text-indigo-400" />
              <span>2. Operations</span>
            </div>
            {operationsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {operationsOpen && (
            <div className="mt-1 space-y-0.5 pl-2">
              {/* Receipts */}
              <button
                onClick={() => setActiveTab('receipts')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  activeTab === 'receipts'
                    ? 'bg-purple-600/30 text-purple-200 font-semibold border-l-2 border-purple-500'
                    : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Receipts (Incoming)</span>
                </div>
                {kpis.pendingReceiptsCount > 0 && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 rounded font-mono">
                    {kpis.pendingReceiptsCount}
                  </span>
                )}
              </button>

              {/* Delivery Orders */}
              <button
                onClick={() => setActiveTab('deliveries')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  activeTab === 'deliveries'
                    ? 'bg-purple-600/30 text-purple-200 font-semibold border-l-2 border-purple-500'
                    : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Delivery Orders (Outgoing)</span>
                </div>
                {kpis.pendingDeliveriesCount > 0 && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 rounded font-mono">
                    {kpis.pendingDeliveriesCount}
                  </span>
                )}
              </button>

              {/* Internal Transfers */}
              <button
                onClick={() => setActiveTab('transfers')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  activeTab === 'transfers'
                    ? 'bg-purple-600/30 text-purple-200 font-semibold border-l-2 border-purple-500'
                    : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
                  <span>Internal Transfers</span>
                </div>
                {kpis.internalTransfersScheduledCount > 0 && (
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 rounded font-mono">
                    {kpis.internalTransfersScheduledCount}
                  </span>
                )}
              </button>

              {/* Inventory Adjustment */}
              <button
                onClick={() => setActiveTab('adjustments')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  activeTab === 'adjustments'
                    ? 'bg-purple-600/30 text-purple-200 font-semibold border-l-2 border-purple-500'
                    : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
                  <span>Stock Adjustments</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* 3. Move History / Stock Ledger */}
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'ledger'
                ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-900/30'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-purple-300 shrink-0" />
              <span>3. Move History (Ledger)</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Audit</span>
          </button>
        </div>

        {/* 6. Settings (Warehouse) */}
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('warehouses')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'warehouses'
                ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-900/30'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-indigo-300 shrink-0" />
              <span>Settings & Warehouses</span>
            </div>
          </button>
        </div>
      </nav>

      {/* 7. Profile Menu (Left Sidebar) */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Active Role
          </span>
          <button
            onClick={() =>
              switchRole(user?.role === 'Inventory Manager' ? 'Warehouse Staff' : 'Inventory Manager')
            }
            className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 flex items-center gap-1"
            title="Toggle between Manager and Staff roles to test permissions"
          >
            <Users className="w-3 h-3" />
            Switch
          </button>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                  {user?.name?.slice(0, 2).toUpperCase() || 'US'}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-slate-950"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-purple-300 truncate font-medium">{user?.role || 'Staff'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>My Profile</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
