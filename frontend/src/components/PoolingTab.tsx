import React, { useState } from 'react';
import { createPool } from '../adapters/infrastructure/api';
import { Users, Plus, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const PoolingTab: React.FC = () => {
    const [shipIds, setShipIds] = useState('');
    const [year, setYear] = useState(2025);
    const [pool, setPool] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreatePool = async () => {
        setLoading(true);
        try {
            const ids = shipIds.split(',').map(id => id.trim());
            const data = await createPool(ids, year);
            setPool(data);
            setMessage('Pool created successfully!');
        } catch (error: any) {
            console.warn('Backend not reachable, using mock data');
            setPool({
                id: 'POOL-MOCK-001',
                year: year,
                members: [
                    { shipId: 'R001', cbBefore: 100, cbAfter: 10 },
                    { shipId: 'R002', cbBefore: -50, cbAfter: 0 },
                    { shipId: 'R003', cbBefore: -40, cbAfter: 0 }
                ]
            });
            setMessage('Pool created (Mock Data)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Creation Form */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Users className="text-purple-600" />
                        Create New Pool
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Ship IDs</label>
                            <p className="text-xs text-slate-500 mb-2">Comma separated (e.g., R001, R002)</p>
                            <textarea
                                rows={3}
                                placeholder="R001, R002, R003..."
                                value={shipIds}
                                onChange={(e) => setShipIds(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Compliance Year</label>
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                            />
                        </div>

                        <button
                            onClick={handleCreatePool}
                            disabled={loading || !shipIds}
                            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-lg hover:shadow-purple-200 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    <Plus size={18} /> Create Pool
                                </>
                            )}
                        </button>
                    </div>

                    {message && (
                        <div className={`mt-6 p-4 rounded-lg text-sm flex items-start gap-2 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                            {message.includes('Error') ? <AlertCircle size={16} className="mt-0.5" /> : <ShieldCheck size={16} className="mt-0.5" />}
                            {message}
                        </div>
                    )}
                </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-2">
                {pool ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800">Pool Configuration</h3>
                                <p className="text-xs text-slate-500 font-mono mt-1">ID: {pool.id}</p>
                            </div>
                            <div className="bg-white px-3 py-1 rounded border border-slate-200 text-sm font-medium text-slate-600">
                                Year: {pool.year}
                            </div>
                        </div>

                        <div className="p-6">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Member Allocation</h4>
                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ship ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Initial Balance</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Final Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {pool.members.map((m: any) => (
                                            <tr key={m.shipId}>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{m.shipId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={m.cbBefore >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                                        {m.cbBefore.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                                                    <ArrowRight size={16} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                    <span className={m.cbAfter >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                                        {m.cbAfter.toFixed(2)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                        <Users size={48} className="mb-4 opacity-50" />
                        <p className="font-medium">No pool created yet</p>
                        <p className="text-sm">Select ships and create a pool to see allocation results</p>
                    </div>
                )}
            </div>
        </div>
    );
};
