import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { AlertTriangle, ArrowRight, X, PackagePlus } from 'lucide-react';

interface LowStockBannerProps {
  onNavigateToReorder: () => void;
  onNavigateToProducts: () => void;
}

export const LowStockBanner: React.FC<LowStockBannerProps> = ({
  onNavigateToReorder,
  onNavigateToProducts
}) => {
  const { getLowStockProducts } = useInventory();
  const [dismissed, setDismissed] = useState(false);
  const lowStockItems = getLowStockProducts();

  if (dismissed || lowStockItems.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-sm transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="p-1 bg-white/20 rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-white animate-bounce" />
        </div>
        <div>
          <span className="font-semibold tracking-wide">Low Stock Alert: </span>
          <span>
            {lowStockItems.length} {lowStockItems.length === 1 ? 'item is' : 'items are'} at or below minimum threshold (
            {lowStockItems.slice(0, 2).map((item) => `${item.product.name}: ${item.currentStock} ${item.product.uom}`).join(', ')}
            {lowStockItems.length > 2 && ` and ${lowStockItems.length - 2} more`}
            ).
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNavigateToReorder}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-amber-700 hover:bg-amber-50 rounded-lg font-medium text-xs shadow-sm transition-all"
        >
          <PackagePlus className="w-3.5 h-3.5" />
          Review Reordering Rules
          <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors"
          title="Dismiss alert for now"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
