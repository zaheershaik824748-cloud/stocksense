import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Building2, 
  CheckCircle2, 
  Save, 
  LogOut, 
  Sparkles,
  Users,
  Check
} from 'lucide-react';
import { UserRole } from '../types';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, switchRole, logout, warehouses } = useInventory();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'Inventory Manager');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, role });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-1 border border-purple-200">
          <UserIcon className="w-3.5 h-3.5" />
          Navigation: 7. Profile Menu → My Profile
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">User Profile & Roles</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage identity, operational role scopes, and warehouse assignment privileges.
        </p>
      </div>

      {/* Target User Roles Scope (Explicitly defined in PDF Page 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inventory Manager Card */}
        <div
          onClick={() => {
            setRole('Inventory Manager');
            switchRole('Inventory Manager');
          }}
          className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
            user?.role === 'Inventory Manager'
              ? 'bg-purple-50/50 border-purple-500 ring-2 ring-purple-500/20 shadow-md'
              : 'bg-white border-slate-200 hover:border-purple-300'
          }`}
        >
          {user?.role === 'Inventory Manager' && (
            <span className="absolute top-4 right-4 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Active Role
            </span>
          )}
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Inventory Manager</h3>
              <p className="text-[11px] text-purple-700 font-medium">Target User Persona (PDF Page 1)</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Manage incoming & outgoing stock, reordering buffer rules, suppliers, count adjustments, and multi-warehouse setups.
          </p>
          <ul className="mt-3 space-y-1 text-[11px] text-slate-500">
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-purple-600" />
              <span>Full receipt validation & inventory adjustments</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-purple-600" />
              <span>Reordering rules & low stock alert definitions</span>
            </li>
          </ul>
        </div>

        {/* Warehouse Staff Card */}
        <div
          onClick={() => {
            setRole('Warehouse Staff');
            switchRole('Warehouse Staff');
          }}
          className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
            user?.role === 'Warehouse Staff'
              ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
              : 'bg-white border-slate-200 hover:border-indigo-300'
          }`}
        >
          {user?.role === 'Warehouse Staff' && (
            <span className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Active Role
            </span>
          )}
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Warehouse Staff</h3>
              <p className="text-[11px] text-indigo-700 font-medium">Target User Persona (PDF Page 1)</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Perform physical warehouse floor operations: internal moves, picking orders, packaging goods, and counting stock.
          </p>
          <ul className="mt-3 space-y-1 text-[11px] text-slate-500">
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pick & pack delivery orders</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-indigo-600" />
              <span>Internal moves (Main Warehouse → Floor, Rack A → B)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-purple-100 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-purple-700 text-white flex items-center justify-center text-xl font-bold">
                {user?.name?.slice(0, 2).toUpperCase() || 'US'}
              </div>
            )}
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{user?.name}</h4>
              <p className="text-slate-500 text-xs">{user?.email}</p>
              <span className="inline-block mt-1 font-mono text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-bold">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-xs transition-colors"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
