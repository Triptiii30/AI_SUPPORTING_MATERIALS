import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { evaluateFuzzySupplier } from '../../algorithms/fuzzyLogic';
import { calculateProbabilityMetrics } from '../../algorithms/bayesianReasoning';
import { MapPin, Phone, CheckCircle, Package, Clock, Shield, Award, BarChart2 } from 'lucide-react';

export default function SupplierDetailModal({ supplier, isOpen, onClose }) {
  if (!supplier) return null;

  // Run Fuzzy evaluation
  const fuzzy = evaluateFuzzySupplier(supplier);
  const prob = calculateProbabilityMetrics(supplier);

  // Derive ratings
  const qualityLevel = supplier.quality >= 90 ? "Excellent" : supplier.quality >= 80 ? "Good" : "Moderate";
  const reliabilityLevel = supplier.reliability >= 90 ? "High" : supplier.reliability >= 80 ? "Moderate" : "Low";
  const deliveryLevel = supplier.deliveryTime <= 4 ? "Fast" : supplier.deliveryTime <= 6 ? "Good" : "Moderate";
  const costLevel = supplier.cost <= 45000 ? "Highly Competitive" : supplier.cost <= 55000 ? "Moderate" : "Premium";
  const capacityLevel = supplier.capacity >= 1200 ? "High / Scalable" : supplier.capacity >= 800 ? "Suitable" : "Limited";

  // Quick overall score
  const overallScore = Math.round(
    (supplier.quality * 0.35) + 
    (supplier.reliability * 0.35) + 
    (Math.max(0, 100 - (supplier.deliveryTime * 7)) * 0.15) + 
    (Math.min(100, (supplier.capacity / 12)) * 0.15)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={supplier.name}
      subtitle={`Product: ${supplier.product} | Status: ${supplier.status}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Core Attributes Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Unit Cost</span>
            <span className="text-lg font-bold text-slate-800">₹{supplier.cost.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Commercial benchmark</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase block">Quality Rate</span>
            <span className="text-lg font-bold text-emerald-800">{supplier.quality}%</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">QA Pass Index</span>
          </div>

          <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-200">
            <span className="text-[11px] font-semibold text-sky-700 uppercase block">Reliability</span>
            <span className="text-lg font-bold text-sky-800">{supplier.reliability}%</span>
            <span className="text-[10px] text-sky-600 block mt-0.5">SLA Compliance</span>
          </div>

          <div className="p-3 rounded-xl bg-violet-50/60 border border-violet-200">
            <span className="text-[11px] font-semibold text-violet-700 uppercase block">Lead Time</span>
            <span className="text-lg font-bold text-violet-800">{supplier.deliveryTime} Days</span>
            <span className="text-[10px] text-violet-600 block mt-0.5">Dispatch Velocity</span>
          </div>
        </div>

        {/* Visual Performance Gauges */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-brand-600" />
            Operational Performance Indicators
          </h4>

          {/* Quality Progress */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Quality Benchmark</span>
              <span className="text-slate-800">{supplier.quality}% ({qualityLevel})</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${supplier.quality}%` }}
              />
            </div>
          </div>

          {/* Reliability Progress */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Reliability & SLA Compliance</span>
              <span className="text-slate-800">{supplier.reliability}% ({reliabilityLevel})</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sky-500 rounded-full transition-all duration-500" 
                style={{ width: `${supplier.reliability}%` }}
              />
            </div>
          </div>

          {/* Delivery Efficiency */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Delivery Velocity (Optimal ≤ 4d)</span>
              <span className="text-slate-800">{supplier.deliveryTime} Days ({deliveryLevel})</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-violet-500 rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(10, Math.min(100, 110 - (supplier.deliveryTime * 10)))}%` }}
              />
            </div>
          </div>

          {/* Capacity */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Batch Monthly Capacity</span>
              <span className="text-slate-800">{supplier.capacity} Units ({capacityLevel})</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (supplier.capacity / 2000) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Evaluation Panel */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-brand-950 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-brand-400" />
              <div>
                <h4 className="text-sm font-bold tracking-tight">AI Evaluation Assessment</h4>
                <p className="text-[11px] text-slate-400">Integrated Multi-Criteria & Fuzzy Logic Synthesis</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Overall Score</span>
              <span className="text-xl font-extrabold text-emerald-400">{overallScore}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Quality:</span>
              <span className="font-semibold text-emerald-300">{qualityLevel}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Reliability:</span>
              <span className="font-semibold text-sky-300">{reliabilityLevel}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Delivery:</span>
              <span className="font-semibold text-violet-300">{deliveryLevel}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Cost Benchmark:</span>
              <span className="font-semibold text-amber-300">{costLevel}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Capacity:</span>
              <span className="font-semibold text-teal-300">{capacityLevel}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Fuzzy Assessment:</span>
              <span className="font-semibold text-brand-300">{fuzzy.linguisticVerdict}</span>
            </div>
          </div>
        </div>

        {/* Location & Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="font-medium text-slate-800 block">Hub Location</span>
              <span>{supplier.location}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="font-medium text-slate-800 block">Contact & Dispatch</span>
              <span>{supplier.contact}</span>
            </div>
          </div>
        </div>

        {supplier.notes && (
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <span className="font-semibold text-slate-700 block mb-0.5">Auditor Notes</span>
            <p className="text-slate-600 leading-relaxed">{supplier.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
