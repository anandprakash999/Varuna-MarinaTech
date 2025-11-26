import { Request, Response } from 'express';
import { ComplianceService } from '../../../core/application/compliance.service';

export class ComplianceController {
    constructor(private complianceService: ComplianceService) { }

    calculateCompliance = async (req: Request, res: Response) => {
        try {
            const { shipId, year } = req.query;
            if (!shipId || !year) {
                return res.status(400).json({ error: 'Missing shipId or year' });
            }
            const result = await this.complianceService.calculateCompliance(String(shipId), Number(year));
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };

    getAdjustedCompliance = async (req: Request, res: Response) => {
        try {
            const { shipId, year } = req.query;
            if (!shipId || !year) {
                return res.status(400).json({ error: 'Missing shipId or year' });
            }
            const result = await this.complianceService.getAdjustedCompliance(String(shipId), Number(year));
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };

    bankSurplus = async (req: Request, res: Response) => {
        try {
            const { shipId, year } = req.body;
            await this.complianceService.bankSurplus(shipId, year);
            res.status(200).send();
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };
}
