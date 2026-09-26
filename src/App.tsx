import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LowStockBanner } from './components/LowStockBanner';
import { NotificationToast } from './components/NotificationToast';

// Pages
import { DashboardView } from './pages/DashboardView';
import { ProductsView } from './pages/ProductsView';
import { StockAvailabilityView } from './pages/StockAvailabilityView';
import { CategoriesView } from './pages/CategoriesView';
import { ReorderingRulesView } from './pages/ReorderingRulesView';
import { ReceiptsView } from './pages/ReceiptsView';
import { DeliveryOrdersView } from './pages/DeliveryOrdersView';
import { InternalTransfersView } from './pages/InternalTransfersView';
import { StockAdjustmentsView } from './pages/StockAdjustmentsView';
import { StockLedgerView } from './pages/StockLedgerView';
import { WarehousesView } from './pages/WarehousesView';
import { ProfileView } from './pages/ProfileView';
import { AuthView } from './pages/AuthView';

const MainAppContent: React.FC = () => {
  const { user } = useInventory();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // If user is not authenticated, show sign up / login / OTP reset view
  if (!user) {
    return <AuthView onSuccess={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* 7. Profile Menu & Navigation (Left Sidebar) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Low Stock Warning Banner */}
        <LowStockBanner
          onNavigateToReorder={() => setActiveTab('reordering-rules')}
          onNavigateToProducts={() => setActiveTab('products')}
        />

        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          onSearchSelect={(sku) => {
            setActiveTab('products');
          }}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'products' && (
            <ProductsView onNavigateToStockAvailability={() => setActiveTab('stock-availability')} />
          )}

          {activeTab === 'stock-availability' && (
            <StockAvailabilityView onNavigateToTransfer={() => setActiveTab('transfers')} />
          )}

          {activeTab === 'categories' && <CategoriesView />}

          {activeTab === 'reordering-rules' && (
            <ReorderingRulesView onNavigateToReceipts={() => setActiveTab('receipts')} />
          )}

          {activeTab === 'receipts' && <ReceiptsView />}

          {activeTab === 'deliveries' && <DeliveryOrdersView />}

          {activeTab === 'transfers' && <InternalTransfersView />}

          {activeTab === 'adjustments' && <StockAdjustmentsView />}

          {activeTab === 'ledger' && <StockLedgerView />}

          {activeTab === 'warehouses' && <WarehousesView />}

          {activeTab === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Floating System Notifications */}
      <NotificationToast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <InventoryProvider>
      <MainAppContent />
    </InventoryProvider>
  );
};

export default App;
