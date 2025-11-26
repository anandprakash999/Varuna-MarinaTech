import { PoolingService } from '../src/core/application/pooling.service';
import { PoolingRepository } from '../src/core/ports/pooling.repository';
import { ComplianceRepository } from '../src/core/ports/compliance.repository';
import { Pool } from '../src/core/domain/pool.entity';
import { ComplianceBalance } from '../src/core/domain/compliance.entity';

describe('PoolingService', () => {
    let poolingService: PoolingService;
    let mockPoolingRepo: jest.Mocked<PoolingRepository>;
    let mockComplianceRepo: jest.Mocked<ComplianceRepository>;

    beforeEach(() => {
        mockPoolingRepo = {
            savePool: jest.fn(),
            findAllPools: jest.fn(),
        };
        mockComplianceRepo = {
            saveCompliance: jest.fn(),
            getCompliance: jest.fn(),
            saveBankEntry: jest.fn(),
            getBankEntries: jest.fn(),
        };
        poolingService = new PoolingService(mockPoolingRepo, mockComplianceRepo);
    });

    it('should create a valid pool and distribute surplus', async () => {
        const shipIds = ['S1', 'S2', 'S3'];
        const year = 2025;

        const compliances: ComplianceBalance[] = [
            { shipId: 'S1', year, cb: 100, status: 'SURPLUS' }, // Surplus
            { shipId: 'S2', year, cb: -40, status: 'DEFICIT' }, // Deficit
            { shipId: 'S3', year, cb: -50, status: 'DEFICIT' }, // Deficit
        ];

        mockComplianceRepo.getCompliance.mockImplementation(async (id) => {
            return compliances.find(c => c.shipId === id) || null;
        });

        const pool = await poolingService.createPool(shipIds, year);

        expect(pool).toBeDefined();
        expect(mockPoolingRepo.savePool).toHaveBeenCalled();


        const s1 = pool.members.find(m => m.shipId === 'S1');
        const s2 = pool.members.find(m => m.shipId === 'S2');
        const s3 = pool.members.find(m => m.shipId === 'S3');

        expect(s1?.cbAfter).toBe(10);
        expect(s2?.cbAfter).toBe(0);
        expect(s3?.cbAfter).toBe(0);
    });

    it('should throw error if total CB is negative', async () => {
        const shipIds = ['S1', 'S2'];
        const year = 2025;

        const compliances: ComplianceBalance[] = [
            { shipId: 'S1', year, cb: 10, status: 'SURPLUS' },
            { shipId: 'S2', year, cb: -20, status: 'DEFICIT' },
        ];

        mockComplianceRepo.getCompliance.mockImplementation(async (id) => {
            return compliances.find(c => c.shipId === id) || null;
        });

        await expect(poolingService.createPool(shipIds, year))
            .rejects.toThrow('Pool total compliance balance is negative');
    });
});
