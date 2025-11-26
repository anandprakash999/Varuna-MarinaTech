export interface Route {
    id: string;
    routeId: string;
    vesselType: string;
    fuelType: string;
    year: number;
    ghgIntensity: number; // gCO2e/MJ
    fuelConsumption: number; // tonnes
    distance: number; // km
    totalEmissions: number; // tonnes
    isBaseline: boolean;
}

export interface RouteComparison {
    route: Route;
    percentDiff: number;
    isCompliant: boolean;
}
