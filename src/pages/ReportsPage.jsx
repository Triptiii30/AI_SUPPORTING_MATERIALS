import React from 'react';
import { 
  FileText, 
  Printer, 
  Award, 
  TrendingUp, 
  Download, 
  CheckCircle2, 
  BarChart2, 
  Scale, 
  HelpCircle 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import Badge from '../components/common/Badge';
import MetricCard from '../components/common/MetricCard';
import { useApp } from '../context/AppContext';
import { scoreSuppliers } from '../algorithms/scoringEngine';

export default function ReportsPage() {
  const { suppliers, requirements, weights, setInspectSupplier } = useApp();

  const scoredList = scoreSuppliers(suppliers, weights, requirements);
  const topSupplier = scoredList[0] || null;

  // Compute Averages
  const n = suppliers.length;
  const avgQuality = n ? Math.round(suppliers.reduce((a, b) => a + b.quality, 0) / n) : 0;
  const avgReliability = n ? Math.round(suppliers.reduce((a, b) => a + b.reliability, 0) / n) : 0;
  const avgCost = n ? Math.round(suppliers.reduce((a, b) => a + b.cost, 0) / n) : 0;
  const avgDelivery = n ? (suppliers.reduce((a, b) => a + b.deliveryTime, 0) / n).toFixed(1) : 0;

  // Chart Data: Rankings
  const rankingChartData = scoredList.map((item, idx) => ({
    rank: `#${idx + 1}`,
    name: item.supplier.name.replace(" Suppliers", "").replace(" Industries", ""),
    Score: item.finalScore,
    Quality: item.supplier.quality,
    Reliability: item.supplier.reliability
  }));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Analytical Summary & Audits</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800">Procurement Decision Audit Report</h2>
          <p className="text-xs text-slate-500">
            Comprehensive evaluation rankings and Multi-Criteria Decision Making summary
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export Audit</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Top Ranked Supplier"
          value={topSupplier ? topSupplier.supplier.name.split(' ')[0] : '--'}
          subtext={topSupplier ? `Composite Score: ${topSupplier.finalScore}%` : 'Unrated'}
          icon={Award}
          color="emerald"
        />
        <MetricCard
          title="Market Avg Quality"
          value={`${avgQuality}%`}
          subtext="Audited technical pass"
          icon={TrendingUp}
          color="brand"
        />
        <MetricCard
          title="Avg Delivery Lead"
          value={`${avgDelivery} Days`}
          subtext="Standard fulfillment delay"
          icon={Scale}
          color="violet"
        />
        <MetricCard
          title="Avg Batch Cost"
          value={`₹${avgCost.toLocaleString()}`}
          subtext="Market price baseline"
          icon={BarChart2}
          color="amber"
        />
      </div>

      {/* Supplier Ranking Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Final Decision Score Hierarchy</h3>
            <p className="text-xs text-slate-500">Weighted MCDM Ranking of Registered Suppliers</p>
          </div>
          <Badge variant="brand">MCDM Ranked</Badge>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rankingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <RechartsTooltip />
              <Bar dataKey="Score" fill="#0284c7" radius={[4, 4, 0, 0]} barSize={26} name="MCDM Score (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Ranking & Reasoning Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800">Supplier Decision Ranking & Reasoning Breakdown</h3>
          <span className="text-xs text-slate-500">{scoredList.length} Suppliers Evaluated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 text-center">Rank</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Cost</th>
                <th className="py-3 px-3">Quality</th>
                <th className="py-3 px-3">Reliability</th>
                <th className="py-3 px-3">Decision Score</th>
                <th className="py-3 px-4">Reasoning & Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scoredList.map((item, idx) => {
                const isLeader = idx === 0;

                return (
                  <tr key={item.supplier.id} className={isLeader ? "bg-emerald-50/30" : "hover:bg-slate-50"}>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                        idx === 0 ? "bg-amber-100 text-amber-800" :
                        idx === 1 ? "bg-slate-200 text-slate-700" :
                        idx === 2 ? "bg-amber-50 text-amber-900" : "text-slate-400"
                      }`}>
                        {idx + 1}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <span 
                        className="cursor-pointer hover:text-brand-600"
                        onClick={() => setInspectSupplier(item.supplier)}
                      >
                        {item.supplier.name}
                      </span>
                      {isLeader && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          Top Choice
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-slate-600">{item.supplier.product}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">₹{item.supplier.cost.toLocaleString()}</td>
                    <td className="py-3.5 px-3 font-bold text-emerald-700">{item.supplier.quality}%</td>
                    <td className="py-3.5 px-3 font-bold text-sky-700">{item.supplier.reliability}%</td>

                    <td className="py-3.5 px-3">
                      <span className="text-sm font-black text-brand-600">
                        {item.finalScore}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 leading-relaxed text-[11px]">
                      {isLeader ? (
                        <span className="text-emerald-800 font-medium">
                          Leading supplier with highest composite rating across Quality ({item.supplier.quality}%) and Reliability ({item.supplier.reliability}%).
                        </span>
                      ) : (
                        <span>
                          Ranked #{idx + 1} with normalized contributions of Q:{item.contributions.quality}, R:{item.contributions.reliability}, C:{item.contributions.cost}.
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Research Literature Baseline & Academic Citations (Aligned with PBL Progress Report II) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Theoretical Foundation & Academic Literature Review
            </span>
            <h3 className="text-sm font-bold text-slate-800">Research Baseline & Referenced Publications</h3>
          </div>
          <Badge variant="brand">PBL Progress Report Reference</Badge>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The algorithmic architecture, knowledge models, and multi-criteria decision criteria implemented in this platform are grounded in foundational supply chain decision-support research papers:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Citation 1 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-brand-600 font-mono block">[1] Kam et al. (2026)</span>
              <h4 className="font-bold text-slate-800 mt-1">
                Digital platforms in supply chain and logistics management: A systematic literature review
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 italic">
                Transportation Research Part E: Logistics and Transportation Review, vol. 209, Art. 104737.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-medium">
              Focus: Digital enterprise platform integration and automated procurement workflows.
            </div>
          </div>

          {/* Citation 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-brand-600 font-mono block">[2] Alahmadi & Jamjoom (2022)</span>
              <h4 className="font-bold text-slate-800 mt-1">
                Decision support system for handling control decisions and decision-maker related to supply chain
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 italic">
                Journal of Big Data, vol. 9, Art. no. 114.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-medium">
              Focus: Decision-maker control structures and multi-factor supplier evaluation logic.
            </div>
          </div>

          {/* Citation 3 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-brand-600 font-mono block">[3] Teniwut & Hasyim (2020)</span>
              <h4 className="font-bold text-slate-800 mt-1">
                Decision support system in supply chain: A systematic literature review
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 italic">
                Uncertain Supply Chain Management, vol. 8, no. 1, pp. 131–148.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-medium">
              Focus: Inexact and uncertain supplier reasoning models under operational variance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
