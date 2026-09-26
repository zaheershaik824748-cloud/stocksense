import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Plus, 
  Search, 
  Package, 
  AlertTriangle, 
  Edit, 
  Trash2, 
  Boxes, 
  ArrowRight,
  X,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { Product } from '../types';

interface ProductsViewProps {
  onNavigateToStockAvailability: () => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ onNavigateToStockAvailability }) => {
  const { 
    products, 
    categories, 
    locations, 
    getProductTotalStock, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useInventory();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state matching PDF Core Feature #1:
  // - Name
  // - SKU / Code
  // - Category
  // - Unit of Measure
  // - Initial stock (optional)
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [uom, setUom] = useState('Units');
  const [price, setPrice] = useState(25);
  const [reorderMin, setReorderMin] = useState(20);
  const [reorderMax, setReorderMax] = useState(100);
  const [initialStock, setInitialStock] = useState<number>(0);
  const [initialLocationId, setInitialLocationId] = useState('');
  const [description, setDescription] = useState('');

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setCategoryId(categories[0]?.id || '');
    setUom('Units');
    setPrice(500);
    setReorderMin(15);
    setReorderMax(80);
    setInitialStock(50);
    setInitialLocationId(locations[0]?.id || '');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategoryId(p.categoryId);
    setUom(p.uom);
    setPrice(p.price);
    setReorderMin(p.reorderMin);
    setReorderMax(p.reorderMax);
    setInitialStock(0);
    setDescription(p.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === categoryId);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        sku,
        categoryId,
        categoryName: cat?.name || 'General',
        uom,
        price: Number(price),
        reorderMin: Number(reorderMin),
        reorderMax: Number(reorderMax),
        description
      });
    } else {
      addProduct(
        {
          name,
          sku,
          categoryId,
          categoryName: cat?.name || 'General',
          uom,
          price: Number(price),
          reorderMin: Number(reorderMin),
          reorderMax: Number(reorderMax),
          initialStock: Number(initialStock),
          description
        },
        initialLocationId
      );
    }
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Product Catalog</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create and maintain product codes, units of measurement, categories, and inventory parameters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToStockAvailability}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Boxes className="w-4 h-4 text-slate-500" />
            Stock Per Location
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:bg-white focus:border-purple-500 outline-hidden font-medium"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">SKU / Code</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Unit of Measure</th>
                <th className="py-3 px-4 text-right">Unit Price (₹)</th>
                <th className="py-3 px-4 text-right">Total Stock</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const stock = getProductTotalStock(p.id);
                  const isOutOfStock = stock === 0;
                  const isLowStock = stock > 0 && stock <= p.reorderMin;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-purple-900">
                        {p.sku}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        {p.description && (
                          <div className="text-[10px] text-slate-400 truncate max-w-xs">{p.description}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                          <Tag className="w-3 h-3 text-slate-400" />
                          {p.categoryName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {p.uom}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        ₹{p.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {stock} {p.uom}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            Low ({p.reorderMin} Min)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingProduct ? 'Edit Product Details' : 'Create New Product'}
              </h3>
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
                  <label className="block font-bold text-slate-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Steel Rods"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    SKU / Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. STL-ROD-01"
                    className="w-full p-2.5 font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Unit of Measure (UoM) *
                  </label>
                  <select
                    value={uom}
                    onChange={(e) => setUom(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
                  >
                    <option value="Units">Units</option>
                    <option value="kg">kg (Kilograms)</option>
                    <option value="m">m (Meters)</option>
                    <option value="Boxes">Boxes</option>
                    <option value="Liters">Liters</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Alert Qty</label>
                  <input
                    type="number"
                    value={reorderMin}
                    onChange={(e) => setReorderMin(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Target Qty</label>
                  <input
                    type="number"
                    value={reorderMax}
                    onChange={(e) => setReorderMax(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-mono"
                  />
                </div>
              </div>

              {!editingProduct && (
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-purple-900 mb-1">
                      Initial Stock (Optional)
                    </label>
                    <input
                      type="number"
                      value={initialStock}
                      onChange={(e) => setInitialStock(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-purple-200 rounded-lg focus:border-purple-500 outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-purple-900 mb-1">
                      Initial Location
                    </label>
                    <select
                      value={initialLocationId}
                      onChange={(e) => setInitialLocationId(e.target.value)}
                      className="w-full p-2 bg-white border border-purple-200 rounded-lg focus:border-purple-500 outline-hidden"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} ({loc.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Material specs, manufacturer details..."
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-xs transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
