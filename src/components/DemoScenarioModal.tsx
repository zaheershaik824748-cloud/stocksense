import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Play, 
  CheckCircle, 
  ArrowRight, 
  Boxes, 
  ArrowRightLeft, 
  Truck, 
  SlidersHorizontal, 
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react';

interface DemoScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewLedger: () => void;
}

export const DemoScenarioModal: React.FC<DemoScenarioModalProps> = ({
  isOpen,
  onClose,
  onViewLedger
}) => {
  const { runPDFDemoScenario, resetToDefaultData, getProductStockByLocation, products, locations } = useInventory();
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const steelProd = products.find((p) => p.sku === 'STL-RAW-100') || products[0];
  const mainStoreLoc = locations.find((l) => l.code === 'WH1/MAIN-STORE') || locations[0];
  const prodRackLoc = locations.find((l) => l.code === 'WH2/PROD-RACK') || locations[3];

  const mainStoreQty = steelProd ? getProductStockByLocation(steelProd.id, mainStoreLoc.id) : 0;
  const prodRackQty = steelProd ? getProductStockByLocation(steelProd.id, prodRackLoc.id) : 0;

  const handleRun = () => {
    setIsRunning(true);
    runPDFDemoScenario();
    setTimeout(() => {
      setIsRunning(false);
      setCompleted(true);
    }, 600);
  };

  const handleReset = () => {
    resetToDefaultData();
    setCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            PDF Flow Simulation
          </div>
          <h2 className="text-xl font-bold">Simplified Inventory Flow Walkthrough</h2>
          <p className="text-purple-100 text-xs mt-1">
            Automates the exact 4-step example from the StockSense problem statement specification.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Current Live Stock Peek */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              Live Stock for "{steelProd?.name}" ({steelProd?.sku}):
            </span>
            <div className="flex gap-4">
              <span className="text-slate-600">
                Main Store: <strong className="text-purple-700 font-mono text-sm">{mainStoreQty} kg</strong>
              </span>
              <span className="text-slate-600">
                Production Rack: <strong className="text-indigo-700 font-mono text-sm">{prodRackQty} kg</strong>
              </span>
            </div>
          </div>

          {/* 4 Steps Card Grid */}
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-colors shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-sm">
                <Boxes className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900">Step 1: Receive Goods from Vendor</h4>
                  <span className="text-xs font-bold text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded">
                    +100 kg
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Receive 100 kg Industrial Steel into Main Store from Vendor. Stock increases automatically by +100.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-colors shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-sm">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900">Step 2: Move to Production Rack</h4>
                  <span className="text-xs font-bold text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded">
                    40 kg Transfer
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Internal transfer: Main Store → Production Rack. Company total stock is unchanged, but location balance updates.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-colors shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-sm">
                <Truck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900">Step 3: Deliver Finished Goods</h4>
                  <span className="text-xs font-bold text-rose-600 font-mono bg-rose-50 px-2 py-0.5 rounded">
                    -20 kg
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customer shipment dispatched from Production Rack. Validates Pick & Pack and reduces stock by -20 kg.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-colors shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-bold text-sm">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900">Step 4: Adjust Damaged Items</h4>
                  <span className="text-xs font-bold text-rose-600 font-mono bg-rose-50 px-2 py-0.5 rounded">
                    -3 kg Damaged
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Physical count mismatch: 3 kg damaged. System automatically updates stock balance and records reason in Stock Ledger.
                </p>
              </div>
            </div>
          </div>

          {completed && (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">Scenario Executed Successfully!</span> Every single movement was logged with precise timestamps, locations, and audit tracking in the Stock Ledger.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset State
          </button>

          <div className="flex items-center gap-2">
            {completed && (
              <button
                onClick={() => {
                  onClose();
                  onViewLedger();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all"
              >
                View Stock Ledger
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl shadow-md transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? 'Simulating Operations...' : 'Run 4-Step Scenario'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
