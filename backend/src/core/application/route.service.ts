import { Route, RouteComparison } from '../domain/route.entity';
import { RouteRepository } from '../ports/route.repository';

export class RouteService {
    private static readonly TARGET_INTENSITY_2025 = 89.3368;

    constructor(private routeRepository: RouteRepository) { }

    async getAllRoutes(): Promise<Route[]> {
        return this.routeRepository.findAll();
    }

    async setBaseline(id: string): Promise<void> {
        await this.routeRepository.setBaseline(id);
    }

    async getComparison(): Promise<RouteComparison[]> {
        const baseline = await this.routeRepository.findBaseline();
        const routes = await this.routeRepository.findAll();

        if (!baseline) {
            throw new Error('No baseline route set');
        }

        return routes.map(route => {
            // Formula: percentDiff = ((comparison / baseline) - 1) * 100
            // Note: The requirement says "comparison / baseline", but usually it's (actual - baseline) / baseline.
            // Let's follow the requirement: ((comparison / baseline) - 1) * 100
            // Wait, if comparison is higher (worse), it should be positive?
            // If baseline is 91.16 and target is 89.33.
            // Let's stick to the requirement formula: ((comparison / baseline) - 1) * 100
            // But wait, "comparison" here refers to the route being compared TO the baseline?
            // Or is "baseline" the reference?
            // "Use target = 89.3368 gCO2e/MJ (2 % below 91.16)"
            // "Display: Table with baseline vs comparison routes"
            // "Formula: percentDiff = ((comparison / baseline) - 1) * 100"

            // Let's assume 'comparison' is the route's intensity and 'baseline' is the baseline route's intensity.

            const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;

            // Compliant if intensity <= TARGET_INTENSITY_2025
            const isCompliant = route.ghgIntensity <= RouteService.TARGET_INTENSITY_2025;

            return {
                route,
                percentDiff,
                isCompliant
            };
        });
    }
}
