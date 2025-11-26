import { Request, Response } from 'express';
import { PoolingService } from '../../../core/application/pooling.service';

export class PoolingController {
    constructor(private poolingService: PoolingService) { }

    createPool = async (req: Request, res: Response) => {
        try {
            const { shipIds, year } = req.body;
            if (!shipIds || !Array.isArray(shipIds) || !year) {
                return res.status(400).json({ error: 'Invalid input' });
            }
            const pool = await this.poolingService.createPool(shipIds, Number(year));
            res.json(pool);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };
}
