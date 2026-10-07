import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';

export default function SupplierFormModal({ isOpen, onClose, initialData = null }) {
  const { addSupplier, updateSupplier, availableProducts } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    product: availableProducts[0] || 'Industrial Steel',
    cost: '',
    quality: '',
    deliveryTime: '',
    reliability: '',
    capacity: '',
    location: '',
    contact: '',
    status: 'Active',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        product: initialData.product || availableProducts[0],
        cost: initialData.cost || '',
        quality: initialData.quality || '',
        deliveryTime: initialData.deliveryTime || '',
        reliability: initialData.reliability || '',
        capacity: initialData.capacity || '',
        location: initialData.location || '',
        contact: initialData.contact || '',
        status: initialData.status || 'Active',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        name: '',
        product: availableProducts[0] || 'Industrial Steel',
        cost: '',
        quality: '',
        deliveryTime: '',
        reliability: '',
        capacity: '',
        location: '',
        contact: '',
        status: 'Active',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen, availableProducts]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Supplier name is required.";
    if (!formData.product.trim()) errs.product = "Product is required.";

    const costNum = Number(formData.cost);
    if (formData.cost === '' || isNaN(costNum) || costNum <= 0) {
      errs.cost = "Cost must be a positive number.";
    }

    const qualityNum = Number(formData.quality);
    if (formData.quality === '' || isNaN(qualityNum) || qualityNum < 0 || qualityNum > 100) {
      errs.quality = "Quality must be between 0 and 100%.";
    }

    const deliveryNum = Number(formData.deliveryTime);
    if (formData.deliveryTime === '' || isNaN(deliveryNum) || deliveryNum <= 0) {
      errs.deliveryTime = "Delivery time must be greater than 0 days.";
    }

    const relNum = Number(formData.reliability);
    if (formData.reliability === '' || isNaN(relNum) || relNum < 0 || relNum > 100) {
      errs.reliability = "Reliability must be between 0 and 100%.";
    }

    const capNum = Number(formData.capacity);
    if (formData.capacity === '' || isNaN(capNum) || capNum <= 0) {
      errs.capacity = "Capacity must be a positive integer.";
    }

    if (!formData.location.trim()) errs.location = "Location is required.";
    if (!formData.contact.trim()) errs.contact = "Contact information is required.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      cost: Number(formData.cost),
      quality: Number(formData.quality),
      deliveryTime: Number(formData.deliveryTime),
      reliability: Number(formData.reliability),
      capacity: Number(formData.capacity),
      historicalAudits: initialData?.historicalAudits || 40,
      successfulDeliveries: initialData?.successfulDeliveries || Math.round(40 * (Number(formData.quality) / 100))
    };

    if (initialData?.id) {
      updateSupplier({ ...payload, id: initialData.id });
    } else {
      addSupplier(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Supplier Record" : "Add New Supplier"}
      subtitle="Enter audited commercial, operational, and quality parameters"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Product */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supplier Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Paramount Alloy Corp"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-0.5">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supplied Product <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-white"
            >
              {availableProducts.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cost & Delivery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Unit Batch Cost (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="e.g. 52000"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                errors.cost ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.cost && <p className="text-[11px] text-rose-500 mt-0.5">{errors.cost}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Delivery Lead Time (Days) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={formData.deliveryTime}
              onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
              placeholder="e.g. 5"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                errors.deliveryTime ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.deliveryTime && <p className="text-[11px] text-rose-500 mt-0.5">{errors.deliveryTime}</p>}
          </div>
        </div>

        {/* Quality & Reliability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quality Rating (0 - 100%) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={formData.quality}
              onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
              placeholder="e.g. 92"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                errors.quality ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.quality && <p className="text-[11px] text-rose-500 mt-0.5">{errors.quality}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reliability Score (0 - 100%) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={formData.reliability}
              onChange={(e) => setFormData({ ...formData, reliability: e.target.value })}
              placeholder="e.g. 94"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                errors.reliability ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.reliability && <p className="text-[11px] text-rose-500 mt-0.5">{errors.reliability}</p>}
          </div>
        </div>

        {/* Capacity & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Monthly Capacity (Units) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="e.g. 1200"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                errors.capacity ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.capacity && <p className="text-[11px] text-rose-500 mt-0.5">{errors.capacity}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vendor Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="Active">Active</option>
              <option value="Preferred">Preferred</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Geographic Location <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Pune, Maharashtra"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                errors.location ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.location && <p className="text-[11px] text-rose-500 mt-0.5">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Dispatch / Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="e.g. contact@domain.com | +91 99999 00000"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                errors.contact ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.contact && <p className="text-[11px] text-rose-500 mt-0.5">{errors.contact}</p>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Auditing Notes & Certifications
          </label>
          <textarea
            rows="2"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="ISO standards, special tooling, warehouse proximity..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-all"
          >
            {initialData ? "Save Changes" : "Create Supplier"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
