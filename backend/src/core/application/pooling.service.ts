import { Pool, PoolMember } from '../domain/pool.entity';
import { PoolingRepository } from '../ports/pooling.repository';
import { ComplianceRepository } from '../ports/compliance.repository';

export class PoolingService {
    constructor(
        private poolingRepository: PoolingRepository,
        private complianceRepository: ComplianceRepository
    ) { }

    async createPool(shipIds: string[], year: number): Promise<Pool> {
        // 1. Fetch compliance for all ships
        const compliances = await Promise.all(
            shipIds.map(id => this.complianceRepository.getCompliance(id, year))
        );

        if (compliances.some(c => !c)) {
            throw new Error('Compliance not calculated for some ships');
        }

        const validCompliances = compliances.map(c => c!);

        // 2. Validate Sum(adjustedCB) >= 0
        const totalCb = validCompliances.reduce((sum, c) => sum + c.cb, 0);
        if (totalCb < 0) {
            throw new Error('Pool total compliance balance is negative');
        }

        // 3. Greedy allocation
        // Sort by CB descending (Surplus first)
        const sortedMembers = [...validCompliances].sort((a, b) => b.cb - a.cb);

        // Initialize current state
        const memberStates = sortedMembers.map(c => ({
            shipId: c.shipId,
            cbBefore: c.cb,
            cbAfter: c.cb
        }));

        // Distribute surplus to deficits
        for (let i = 0; i < memberStates.length; i++) {
            const donor = memberStates[i];
            if (donor.cbAfter <= 0) continue; // No surplus to give

            for (let j = memberStates.length - 1; j > i; j--) {
                const receiver = memberStates[j];
                if (receiver.cbAfter >= 0) continue; // Not in deficit

                const transferAmount = Math.min(donor.cbAfter, -receiver.cbAfter);

                donor.cbAfter -= transferAmount;
                receiver.cbAfter += transferAmount;

                if (donor.cbAfter === 0) break; // Donor runs out
            }
        }

        // 4. Validate exit conditions
        // Deficit ship cannot exit worse (should be impossible with this logic, but check)
        // Surplus ship cannot exit negative (impossible with this logic)

        for (const member of memberStates) {
            if (member.cbBefore < 0 && member.cbAfter < member.cbBefore) {
                throw new Error(`Ship ${member.shipId} would exit with worse deficit`);
            }
            if (member.cbBefore > 0 && member.cbAfter < 0) {
                throw new Error(`Ship ${member.shipId} would exit with negative balance`);
            }
        }

        const pool: Pool = {
            id: crypto.randomUUID(),
            year,
            createdAt: new Date(),
            members: memberStates
        };

        await this.poolingRepository.savePool(pool);
        return pool;
    }
}
