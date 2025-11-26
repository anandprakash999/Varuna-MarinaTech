import React, { useState } from 'react';
import { getCompliance, bankSurplus } from '../adapters/infrastructure/api';
import { Wallet, ArrowRight, PiggyBank, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const BankingTab: React.FC = () => {
    const [shipId, setShipId] = useState('');
    const [year, setYear] = useState(2025);
    const [compliance, setCompliance] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        setLoading(true);
        try {
            const data = await getCompliance(shipId, year);
            setCompliance(data);
            setMessage('');
        } catch (error) {
            console.warn('Backend not reachable, using mock data');
            setCompliance({
                shipId: shipId || 'R001',
                year: year,
                cb: 150.5,
                status: 'SURPLUS'
            });
            setMessage('Using mock data (Backend unavailable)');
        } finally {
            setLoading(false);
        }
    };

    const handleBank = async () => {
        try {
            await bankSurplus(shipId, year);
            setMessage('Surplus banked successfully!');
            handleCheck(); // Refresh
        } catch (error: any) {
            setMessage(`Error banking surplus: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Wallet className="text-blue-600" />
                        Compliance Banking
                    </h3>
                    <p className="text-slate-500 mt-1">Check compliance balance and bank surplus for future use.</p>
                </div>

                <div className="p-8">
                    <div className="flex gap-4 mb-8">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Ship ID</label>
                            <input
                                type="text"
                                placeholder="e.g., R001"
                                value={shipId}
                                onChange={(e) => setShipId(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            />
                        </div>
                        <div className="w-32">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleCheck}
                                disabled={loading || !shipId}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium h-[42px]"
                            >
                                {loading ? 'Checking...' : 'Check Status'}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                            {message.includes('Error') ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                            {message}
                        </div>
                    )}

                    {compliance && (
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">Compliance Status</h4>
                                    <p className="text-slate-500 text-sm">Ship: {compliance.shipId} • Year: {compliance.year}</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${compliance.status === 'SURPLUS'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                    {compliance.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                    <p className="text-sm text-slate-500 mb-1">Compliance Balance</p>
                                    <p className={`text-2xl font-bold ${compliance.cb >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {compliance.cb.toFixed(2)} <span className="text-sm font-normal text-slate-400">gCO₂e</span>
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Action Available</p>
                                        <p className="font-medium text-slate-800">
                                            {compliance.cb > 0 ? 'Bank Surplus' : 'No Actions'}
                                        </p>
                                    </div>
                                    <PiggyBank className={compliance.cb > 0 ? 'text-emerald-500' : 'text-slate-300'} size={24} />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleBank}
                                    disabled={compliance.cb <= 0}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${compliance.cb <= 0
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                        }`}
                                >
                                    <PiggyBank size={20} />
                                    Bank Surplus to Account
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
