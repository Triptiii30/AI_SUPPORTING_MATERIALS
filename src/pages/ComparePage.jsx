import React from 'react';
import { 
  GitCompare, 
  Award, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Layers 
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Legend, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import Badge from '../components/common/Badge';
import { useApp } from '../context/AppContext';
import { scoreSuppliers } from '../algorithms/scoringEngine';

export default function ComparePage() {
  const { suppliers, compareIds, setCompareIds, weights, requirements, setInspectSupplier } = useApp();

  const handleToggleSelect = (id) => {
    if (compareIds.includes(id)) {
      if (compareIds.length <= 2) {
        alert("Please keep at least 2 suppliers selected for comparative analysis.");
        return;
      }
      setCompareIds(compareIds.filter(i => i !== id));
    } else {
      if (compareIds.length >= 4) {
        alert("Comparative matrix is optimized for up to 4 concurrent suppliers.");
        return;
      }
      setCompareIds([...compareIds, id]);
    }
  };

  const selectedSuppliers = suppliers.filter(s => compareIds.includes(s.id));

  // Run scoring across the selected group
  const scoredSelected = scoreSuppliers(selectedSuppliers, weights, requirements);
  const bestMatchScored = scoredSelected[0] || null;

  // Determine best values per category
  const bestCost = Math.min(...selectedSuppliers.map(s => s.cost));
  const bestQuality = Math.max(...selectedSuppliers.map(s => s.quality));
  const bestDelivery = Math.min(...selectedSuppliers.map(s => s.deliveryTime));
  const bestReliability = Math.max(...selectedSuppliers.map(s => s.reliability));
  const bestCapacity = Math.max(...selectedSuppliers.map(s => s.capacity));

  // Radar Chart Data preparation
  const radarMetrics = [
    { metric: "Quality", key: "quality", max: 100 },
    { metric: "Reliability", key: "reliability", max: 100 },
    { 
      metric: "Delivery Speed", 
      compute: (s) => Math.max(20, Math.min(100, 110 - (s.deliveryTime * 10))) 
    },
    { 
      metric: "Cost Advantage", 
      compute: (s) => {
        const costs = selectedSuppliers.map(x => x.cost);
        const maxC = Math.max(...costs);
        const minC = Math.min(...costs);
        if (maxC === minC) return 80;
        return Math.round(50 + ((maxC - s.cost) / (maxC - minC)) * 50);
      } 
    },
    { 
      metric: "Capacity Scale", 
      compute: (s) => Math.min(100, Math.round((s.capacity / 1800) * 100)) 
    }
  ];

  const radarData = radarMetrics.map(m => {
    const row = { metric: m.metric };
    selectedSuppliers.forEach(s => {
      row[s.name] = m.compute ? m.compute(s) : s[m.key];
    });
    return row;
  });

  const radarColors = ["#0284c7", "#10b981", "#8b5cf6", "#f59e0b"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Multi-Supplier Matrix Comparison</h2>
          <p className="text-xs text-slate-500">
            Side-by-side trade-off evaluation with category-level best value identification
          </p>
        </div>

        {/* Selection pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Select (2–4):</span>
          {suppliers.map(s => {
            const isSelected = compareIds.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => handleToggleSelect(s.id)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  isSelected
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s.name.replace(" Suppliers", "").replace(" Industries", "")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Best Match Banner */}
      {bestMatchScored && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 p-5 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                Recommended Choice
              </span>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                BEST MATCH: {bestMatchScored.supplier.name}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Achieved top composite weighted rating of {bestMatchScored.finalScore}% among selected candidate suppliers.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">MCDM Score</span>
              <span className="text-2xl font-black text-emerald-400">{bestMatchScored.finalScore}%</span>
            </div>
            <button
              onClick={() => setInspectSupplier(bestMatchScored.supplier)}
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-all"
            >
              Inspect Profile
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-4 w-48 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  Evaluation Parameter
                </th>
                {selectedSuppliers.map((s, idx) => {
                  const scoredItem = scoredSelected.find(x => x.supplier.id === s.id);
                  const isWinner = bestMatchScored?.supplier.id === s.id;
                  return (
                    <th key={s.id} className={`py-4 px-4 min-w-[180px] ${isWinner ? 'bg-emerald-50/50' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm block">{s.name}</span>
                          <span className="text-[11px] font-normal text-slate-500">{s.product}</span>
                        </div>
                        {isWinner && (
                          <Badge variant="success" className="text-[10px]">Leader</Badge>
                        )}
                      </div>
                      <div className="mt-2 text-xs font-semibold text-brand-600">
                        Score: {scoredItem?.finalScore || '--'}%
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Cost Row */}
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-700 bg-slate-50/50">
                  <div className="flex items-center space-x-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>Unit Batch Cost</span>
                  </div>
                </td>
                {selectedSuppliers.map(s => {
                  const isBest = s.cost === bestCost;
                  return (
                    <td key={s.id} className={`py-3.5 px-4 ${isBest ? 'bg-emerald-50/30' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 text-sm">₹{s.cost.toLocaleString()}</span>
                        {isBest && <Badge variant="success">Lowest Cost</Badge>}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Quality Row */}
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-700 bg-slate-50/50">
                  <div className="flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Quality Rating</span>
                  </div>
                </td>
                {selectedSuppliers.map(s => {
                  const isBest = s.quality === bestQuality;
                  return (
                    <td key={s.id} className={`py-3.5 px-4 ${isBest ? 'bg-emerald-50/30' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 text-sm">{s.quality}%</span>
                        {isBest && <Badge variant="success">Highest Quality</Badge>}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Delivery Row */}
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-700 bg-slate-50/50">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Delivery Lead Time</span>
                  </div>
                </td>
                {selectedSuppliers.map(s => {
                  const isBest = s.deliveryTime === bestDelivery;
                  return (
                    <td key={s.id} className={`py-3.5 px-4 ${isBest ? 'bg-emerald-50/30' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 text-sm">{s.deliveryTime} days</span>
                        {isBest && <Badge variant="success">Fastest Lead</Badge>}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Reliability Row */}
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-700 bg-slate-50/50">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reliability Score</span>
                  </div>
                </td>
                {selectedSuppliers.map(s => {
                  const isBest = s.reliability === bestReliability;
                  return (
                    <td key={s.id} className={`py-3.5 px-4 ${isBest ? 'bg-emerald-50/30' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 text-sm">{s.reliability}%</span>
                        {isBest && <Badge variant="success">Most Reliable</Badge>}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Capacity Row */}
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-700 bg-slate-50/50">
                  <div className="flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Batch Capacity</span>
                  </div>
                </td>
                {selectedSuppliers.map(s => {
                  const isBest = s.capacity === bestCapacity;
                  return (
                    <td key={s.id} className={`py-3.5 px-4 ${isBest ? 'bg-emerald-50/30' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 text-sm">{s.capacity} units</span>
                        {isBest && <Badge variant="success">Highest Scale</Badge>}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Location Row */}
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-700 bg-slate-50/50">
                  <span>Logistics Base</span>
                </td>
                {selectedSuppliers.map(s => (
                  <td key={s.id} className="py-3.5 px-4 text-slate-600">
                    {s.location}
                  </td>
                ))}
              </tr>

              {/* Action Row */}
              <tr className="bg-slate-50/50">
                <td className="py-3.5 px-4 font-semibold text-slate-700">Actions</td>
                {selectedSuppliers.map(s => (
                  <td key={s.id} className="py-3.5 px-4">
                    <button
                      onClick={() => setInspectSupplier(s)}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-slate-700 font-semibold text-xs shadow-xs"
                    >
                      View Details
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Radar Chart Multi-Attribute Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Multi-Dimensional Capability Radar</h3>
            <p className="text-xs text-slate-500">
              Normalized comparison across Quality, Reliability, Lead Speed, Cost Advantage, and Capacity
            </p>
          </div>
          <Badge variant="brand">Radar Profile</Badge>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#475569' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <RechartsTooltip />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {selectedSuppliers.map((s, idx) => (
                <Radar
                  key={s.id}
                  name={s.name}
                  dataKey={s.name}
                  stroke={radarColors[idx % radarColors.length]}
                  fill={radarColors[idx % radarColors.length]}
                  fillOpacity={0.2}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
