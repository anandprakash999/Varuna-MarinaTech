import { PrismaClient } from '@prisma/client';
import { ComplianceRepository } from '../../../core/ports/compliance.repository';
import { ComplianceBalance, BankEntry } from '../../../core/domain/compliance.entity';

export class PrismaComplianceRepository implements ComplianceRepository {
    constructor(private prisma: PrismaClient) { }

    async saveCompliance(compliance: ComplianceBalance): Promise<void> {
        await this.prisma.shipCompliance.create({
            data: {
                shipId: compliance.shipId,
                year: compliance.year,
                cb: compliance.cb
            }
        });
    }

    async getCompliance(shipId: string, year: number): Promise<ComplianceBalance | null> {
        const record = await this.prisma.shipCompliance.findFirst({
            where: { shipId, year },
            orderBy: { createdAt: 'desc' }
        });

        if (!record) return null;

        return {
            shipId: record.shipId,
            year: record.year,
            cb: record.cb,
            status: record.cb >= 0 ? 'SURPLUS' : 'DEFICIT'
        };
    }

    async saveBankEntry(entry: BankEntry): Promise<void> {
        await this.prisma.bankEntry.create({
            data: {
                id: entry.id,
                shipId: entry.shipId,
                year: entry.year,
                amount: entry.amount,
                createdAt: entry.createdAt
            }
        });
    }

    async getBankEntries(shipId: string): Promise<BankEntry[]> {
        const entries = await this.prisma.bankEntry.findMany({
            where: { shipId }
        });

        return entries.map(e => ({
            id: e.id,
            shipId: e.shipId,
            year: e.year,
            amount: e.amount,
            createdAt: e.createdAt
        }));
    }
}
