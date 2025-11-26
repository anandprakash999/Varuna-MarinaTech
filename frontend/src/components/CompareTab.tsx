import React, { useEffect, useState } from 'react';
import { getComparison } from '../adapters/infrastructure/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle, XCircle, TrendingDown, TrendingUp } from 'lucide-react';

interface RouteComparison {
    route: {
        routeId: string;
        ghgIntensity: number;
    };
    percentDiff: number;
    isCompliant: boolean;
}

export const CompareTab: React.FC = () => {
    const [comparisons, setComparisons] = useState<RouteComparison[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getComparison();
                setComparisons(data);
            } catch (error) {
                console.warn('Backend not reachable, using mock data');
                setComparisons([
                    { route: { routeId: 'R001', ghgIntensity: 91.0 }, percentDiff: 1.86, isCompliant: false },
                    { route: { routeId: 'R002', ghgIntensity: 88.0 }, percentDiff: -1.50, isCompliant: true },
                    { route: { routeId: 'R003', ghgIntensity: 93.5 }, percentDiff: 4.66, isCompliant: false },
                    { route: { routeId: 'R004', ghgIntensity: 89.2 }, percentDiff: -0.15, isCompliant: true },
                    { route: { routeId: 'R005', ghgIntensity: 90.5 }, percentDiff: 1.30, isCompliant: false },
                ]);
            }
        };
        fetchData();
    }, []);

    const chartData = comparisons.map(c => ({
        name: c.route.routeId,
        intensity: c.route.ghgIntensity,
        target: 89.3368
    }));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">GHG Intensity vs Target</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" />
                                <Bar dataKey="intensity" name="Actual Intensity" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.intensity > entry.target ? '#ef4444' : '#3b82f6'} />
                                    ))}
                                </Bar>
                                <Bar dataKey="target" fill="#10b981" name="Target (2025)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="space-y-4">
                    <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                        <h4 className="text-emerald-800 font-medium mb-2">Target Intensity</h4>
                        <p className="text-3xl font-bold text-emerald-600">89.34</p>
                        <p className="text-xs text-emerald-600 mt-1">gCO₂e/MJ (2025)</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h4 className="text-blue-800 font-medium mb-2">Compliant Ships</h4>
                        <p className="text-3xl font-bold text-blue-600">
                            {comparisons.filter(c => c.isCompliant).length}
                            <span className="text-lg text-blue-400 font-normal ml-1">/ {comparisons.length}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Route ID</th>
                            <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">GHG Intensity</th>
                            <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Difference</th>
                            <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {comparisons.map((item) => (
                            <tr key={item.route.routeId} className="hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-6 font-medium text-slate-900">{item.route.routeId}</td>
                                <td className="py-4 px-6 text-slate-600">{item.route.ghgIntensity.toFixed(2)}</td>
                                <td className="py-4 px-6">
                                    <div className={`flex items-center gap-1 ${item.percentDiff > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {item.percentDiff > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        <span className="font-medium">{Math.abs(item.percentDiff).toFixed(2)}%</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    {item.isCompliant ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                            <CheckCircle size={14} /> Compliant
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                            <XCircle size={14} /> Non-Compliant
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
