import React from 'react';
import { 
  Users, 
  Package, 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  PlusCircle,
  Cpu
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import MetricCard from '../components/common/MetricCard';
import Badge from '../components/common/Badge';
import { useApp } from '../context/AppContext';
import { scoreSuppliers } from '../algorithms/scoringEngine';

export default function DashboardPage({ onOpenAddSupplier }) {
  const { suppliers, requirements, weights, setActiveTab, setInspectSupplier, runDemoRecommendation } = useApp();

  // Compute stats
  const totalSuppliers = suppliers.length;
  const uniqueProducts = Array.from(new Set(suppliers.map(s => s.product))).length;
  const avgQuality = totalSuppliers ? Math.round(suppliers.reduce((a, b) => a + b.quality, 0) / totalSuppliers) : 0;
  const avgReliability = totalSuppliers ? Math.round(suppliers.reduce((a, b) => a + b.reliability, 0) / totalSuppliers) : 0;

  // Run AI scoring to find top supplier
  const scoredList = scoreSuppliers(suppliers, weights, requirements);
  const topSupplierScored = scoredList[0] || null;
  const topSupplier = topSupplierScored?.supplier || suppliers[0];

  // Performance Chart Data
  const performanceChartData = suppliers.slice(0, 6).map(s => ({
    name: s.name.replace(" Suppliers", "").replace(" Industries", "").replace(" Co.", ""),
    Quality: s.quality,
    Reliability: s.reliability,
    Delivery: s.deliveryTime
  }));

  // Quality vs Cost Chart Data
  const qualityVsCostData = suppliers.map(s => ({
    name: s.name,
    cost: s.cost / 1000, // in k
    quality: s.quality,
    product: s.product
  }));

  return (
    <div className="space-y-6">
      {/* Welcome & Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-brand-950 rounded-2xl p-6 text-white shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-2 border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Supply Chain Decision Support Platform</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
            Intelligent Supplier Evaluation & Multi-Criteria Decision Engine
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            An AI-powered decision support platform for evaluating suppliers using knowledge-based reasoning, statistical reasoning and intelligent decision-making.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAddSupplier}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
          <button
            onClick={runDemoRecommendation}
            className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center gap-1.5 hover:scale-[1.02]"
          >
            <Cpu className="w-4 h-4" />
            <span>Run AI Pipeline</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard
          title="Total Suppliers"
          value={totalSuppliers}
          subtext="Audited in Knowledge Base"
          icon={Users}
          color="brand"
        />
        <MetricCard
          title="Products Catalog"
          value={uniqueProducts}
          subtext="Procurement Categories"
          icon={Package}
          color="slate"
        />
        <MetricCard
          title="Avg Quality"
          value={`${avgQuality}%`}
          trend="+2.4%"
          subtext="QA Pass Rate"
          icon={Award}
          color="emerald"
        />
        <MetricCard
          title="Avg Reliability"
          value={`${avgReliability}%`}
          trend="+1.8%"
          subtext="SLA Contract Adherence"
          icon={ShieldCheck}
          color="violet"
        />
        <MetricCard
          title="Top AI Vendor"
          value={topSupplier ? topSupplier.name.split(' ')[0] : 'None'}
          subtext={topSupplierScored ? `Score: ${topSupplierScored.finalScore}%` : 'Unrated'}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Main Grid: Latest Recommendation & Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest AI Recommendation Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Latest AI Recommendation</h3>
              </div>
              <Badge variant="success">Active Assessment</Badge>
            </div>

            {topSupplier ? (
              <div className="mt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">{topSupplier.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">Product: {topSupplier.product}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Decision Score</span>
                    <span className="text-2xl font-black text-brand-600">
                      {topSupplierScored?.finalScore || 91}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Contributing Factors:</span>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>High quality assurance benchmark ({topSupplier.quality}%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Consistent operational reliability ({topSupplier.reliability}%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Rapid dispatch lead time ({topSupplier.deliveryTime} days)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Suitable batch production capacity ({topSupplier.capacity} units)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Competitive quote: ₹{topSupplier.cost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-4">No suppliers registered.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
            <button
              onClick={() => setInspectSupplier(topSupplier)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              View Full Profile
            </button>
            <button
              onClick={() => setActiveTab('ai-decision')}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>Explore AI Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Supplier Performance Comparison Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Supplier Quality & Reliability Matrix</h3>
              <p className="text-xs text-slate-500">Benchmark across registered suppliers</p>
            </div>
            <button
              onClick={() => setActiveTab('compare')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
            >
              <span>Compare Matrix</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Quality" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={22} name="Quality (%)" />
                <Bar dataKey="Reliability" fill="#10b981" radius={[4, 4, 0, 0]} barSize={22} name="Reliability (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Row: Quality vs Cost Scatter/Chart & Recent Evaluations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quality vs Cost Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Quality vs Unit Cost Trade-off</h3>
              <p className="text-xs text-slate-500">Cost (₹ in thousands) vs Quality score (%)</p>
            </div>
            <Badge variant="brand">Pareto Trade-off</Badge>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  type="number" 
                  dataKey="cost" 
                  name="Cost" 
                  unit="k ₹" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <YAxis 
                  type="number" 
                  dataKey="quality" 
                  name="Quality" 
                  unit="%" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  domain={[70, 100]}
                />
                <RechartsTooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg">
                          <p className="font-bold text-brand-300">{data.name}</p>
                          <p>Cost: ₹{(data.cost * 1000).toLocaleString()}</p>
                          <p>Quality: {data.quality}%</p>
                          <p className="text-slate-400 text-[10px]">Product: {data.product}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Suppliers" data={qualityVsCostData} fill="#6366f1" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Supplier Evaluations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Evaluated Suppliers</h3>
            <button
              onClick={() => setActiveTab('suppliers')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              View All
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {suppliers.slice(0, 5).map((s) => (
              <div 
                key={s.id} 
                onClick={() => setInspectSupplier(s)}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{s.name}</h4>
                  <p className="text-[11px] text-slate-500">{s.product} • {s.deliveryTime}d lead</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700">{s.quality}% QA</span>
                  <span className="text-[10px] text-slate-400 block">₹{s.cost.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
