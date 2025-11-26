import React, { useState } from 'react';
import { RoutesTable } from './components/RoutesTable';
import { CompareTab } from './components/CompareTab';
import { BankingTab } from './components/BankingTab';
import { PoolingTab } from './components/PoolingTab';
import { Ship, BarChart3, Wallet, Users, Anchor } from 'lucide-react';

function App() {
    const [activeTab, setActiveTab] = useState<'routes' | 'compare' | 'banking' | 'pooling'>('routes');

    const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-6 py-4 w-full transition-all duration-200 ${activeTab === id
                    ? 'bg-blue-600 text-white shadow-lg transform translate-x-2 rounded-l-xl'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 text-white fixed h-full shadow-2xl z-10">
                <div className="p-8 flex items-center gap-3 border-b border-slate-800">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Anchor className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">FuelEU Maritime</h1>
                        <p className="text-xs text-slate-400">Compliance Platform</p>
                    </div>
                </div>

                <nav className="mt-8 space-y-2 pl-4">
                    <NavItem id="routes" label="Route Management" icon={Ship} />
                    <NavItem id="compare" label="Compliance Analysis" icon={BarChart3} />
                    <NavItem id="banking" label="Banking & Surplus" icon={Wallet} />
                    <NavItem id="pooling" label="Pooling Manager" icon={Users} />
                </nav>

                <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
                    <div className="bg-slate-800 rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">Current Target (2025)</p>
                        <p className="text-lg font-bold text-emerald-400">89.34 gCO₂e/MJ</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-8 overflow-y-auto h-screen">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">
                            {activeTab === 'routes' && 'Fleet Routes'}
                            {activeTab === 'compare' && 'Compliance Analysis'}
                            {activeTab === 'banking' && 'Banking Operations'}
                            {activeTab === 'pooling' && 'Pool Management'}
                        </h2>
                        <p className="text-slate-500 mt-1">Manage and monitor your fleet's environmental compliance</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-900">Admin User</p>
                            <p className="text-xs text-slate-500">Varuna Project</p>
                        </div>
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                            AU
                        </div>
                    </div>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[calc(100vh-12rem)]">
                    {activeTab === 'routes' && <RoutesTable />}
                    {activeTab === 'compare' && <CompareTab />}
                    {activeTab === 'banking' && <BankingTab />}
                    {activeTab === 'pooling' && <PoolingTab />}
                </div>
            </main>
        </div>
    );
}

export default App;
