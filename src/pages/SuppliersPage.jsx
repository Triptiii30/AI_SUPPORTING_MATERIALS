import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Building2, 
  SlidersHorizontal,
  CheckCircle,
  Clock,
  Shield,
  Layers
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { useApp } from '../context/AppContext';

export default function SuppliersPage({ onOpenAdd, onEditSupplier }) {
  const { suppliers, deleteSupplier, setInspectSupplier } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('ALL');

  const productsList = ['ALL', ...Array.from(new Set(suppliers.map(s => s.product)))];

  const filtered = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProduct = selectedProduct === 'ALL' || s.product === selectedProduct;
    return matchesSearch && matchesProduct;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Preferred': return <Badge variant="brand">Preferred</Badge>;
      case 'Active': return <Badge variant="success">Active</Badge>;
      case 'Under Review': return <Badge variant="warning">Under Review</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Supplier Registry & Directory</h2>
          <p className="text-xs text-slate-500">
            Manage audited vendor profiles, technical capabilities, and contractual parameters
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Supplier Button */}
          <button
            onClick={onOpenAdd}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search supplier or location..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Product:</span>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          >
            {productsList.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Supplier Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Supplier Name</th>
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Unit Cost</th>
                <th className="py-3 px-3">Quality</th>
                <th className="py-3 px-3">Lead Time</th>
                <th className="py-3 px-3">Reliability</th>
                <th className="py-3 px-3">Capacity</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name & Location */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div>
                        <span className="hover:text-brand-600 cursor-pointer" onClick={() => setInspectSupplier(s)}>
                          {s.name}
                        </span>
                        <span className="block text-[11px] font-normal text-slate-400">{s.location}</span>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {s.product}
                      </span>
                    </td>

                    {/* Cost */}
                    <td className="py-3.5 px-3 font-semibold text-slate-700">
                      ₹{s.cost.toLocaleString()}
                    </td>

                    {/* Quality */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-emerald-700">{s.quality}%</span>
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${s.quality}%` }} />
                        </div>
                      </div>
                    </td>

                    {/* Delivery Time */}
                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {s.deliveryTime} days
                    </td>

                    {/* Reliability */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-sky-700">{s.reliability}%</span>
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-500" style={{ width: `${s.reliability}%` }} />
                        </div>
                      </div>
                    </td>

                    {/* Capacity */}
                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {s.capacity.toLocaleString()} units
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {getStatusBadge(s.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          title="View Detailed Evaluation Profile"
                          onClick={() => setInspectSupplier(s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Edit Supplier"
                          onClick={() => onEditSupplier(s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete Supplier"
                          onClick={() => {
                            if (window.confirm(`Delete supplier "${s.name}"?`)) {
                              deleteSupplier(s.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-400 text-xs">
                    No suppliers match the selected search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} of {suppliers.length} registered suppliers</span>
          <span className="font-mono text-[11px] text-slate-400">LocalStorage Synced</span>
        </div>
      </div>
    </div>
  );
}
