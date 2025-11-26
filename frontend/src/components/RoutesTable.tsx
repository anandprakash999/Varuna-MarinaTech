import React, { useEffect, useState } from 'react';
import { getRoutes, setBaseline } from '../adapters/infrastructure/api';
import { Anchor, Fuel, Activity, Zap, MapPin } from 'lucide-react';

interface Route {
    id: string;
    routeId: string;
    vesselType: string;
    fuelType: string;
    year: number;
    ghgIntensity: number;
    fuelConsumption: number;
    distance: number;
    totalEmissions: number;
    isBaseline: boolean;
}

export const RoutesTable: React.FC = () => {
    const [routes, setRoutes] = useState<Route[]>([]);

    const fetchRoutes = async () => {
        try {
            const data = await getRoutes();
            setRoutes(data);
        } catch (e) {
            console.warn('Backend not reachable, using mock data');
            setRoutes([
                { id: '1', routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500, isBaseline: false },
                { id: '2', routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200, isBaseline: false },
                { id: '3', routeId: 'R003', vesselType: 'Tanker', fuelType: 'MGO', year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700, isBaseline: false },
                { id: '4', routeId: 'R004', vesselType: 'RoRo', fuelType: 'HFO', year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800, totalEmissions: 4300, isBaseline: true },
                { id: '5', routeId: 'R005', vesselType: 'Container', fuelType: 'LNG', year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distance: 11900, totalEmissions: 4400, isBaseline: false },
            ]);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const handleSetBaseline = async (id: string) => {
        try {
            await setBaseline(id);
            fetchRoutes();
        } catch (e) {
            console.warn('Backend not reachable, updating baseline locally');
            // Update baseline locally when backend is not available
            setRoutes(prevRoutes =>
                prevRoutes.map(route => ({
                    ...route,
                    isBaseline: route.id === id
                }))
            );
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {routes.map((route) => (
                    <div
                        key={route.id}
                        className={`relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg ${route.isBaseline
                                ? 'bg-blue-50 border-blue-200 shadow-md'
                                : 'bg-white border-slate-100 hover:border-blue-100'
                            }`}
                    >
                        {route.isBaseline && (
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                BASELINE
                            </div>
                        )}

                        <div className="p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-lg ${route.isBaseline ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                                    <Anchor size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{route.routeId}</h3>
                                    <p className="text-xs text-slate-500">{route.vesselType}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Fuel size={14} />
                                        <span>Fuel Type</span>
                                    </div>
                                    <span className="font-medium text-slate-700">{route.fuelType}</span>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Activity size={14} />
                                        <span>GHG Intensity</span>
                                    </div>
                                    <span className="font-medium text-slate-700">{route.ghgIntensity} gCO₂e/MJ</span>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Zap size={14} />
                                        <span>Consumption</span>
                                    </div>
                                    <span className="font-medium text-slate-700">{route.fuelConsumption} t</span>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <MapPin size={14} />
                                        <span>Distance</span>
                                    </div>
                                    <span className="font-medium text-slate-700">{route.distance} km</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => handleSetBaseline(route.id)}
                                    disabled={route.isBaseline}
                                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${route.isBaseline
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    {route.isBaseline ? 'Current Baseline' : 'Set as Baseline'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
