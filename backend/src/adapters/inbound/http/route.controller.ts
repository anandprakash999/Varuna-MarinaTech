import { Request, Response } from 'express';
import { RouteService } from '../../../core/application/route.service';

export class RouteController {
    constructor(private routeService: RouteService) { }

    getAllRoutes = async (req: Request, res: Response) => {
        try {
            const routes = await this.routeService.getAllRoutes();
            res.json(routes);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };

    setBaseline = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.routeService.setBaseline(id);
            res.status(200).send();
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };

    getComparison = async (req: Request, res: Response) => {
        try {
            const comparison = await this.routeService.getComparison();
            res.json(comparison);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };
}
