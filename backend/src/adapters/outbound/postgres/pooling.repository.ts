import { PrismaClient } from '@prisma/client';
import { PoolingRepository } from '../../../core/ports/pooling.repository';
import { Pool } from '../../../core/domain/pool.entity';

export class PrismaPoolingRepository implements PoolingRepository {
    constructor(private prisma: PrismaClient) { }

    async savePool(pool: Pool): Promise<void> {
        await this.prisma.pool.create({
            data: {
                id: pool.id,
                year: pool.year,
                createdAt: pool.createdAt,
                members: {
                    create: pool.members.map(m => ({
                        shipId: m.shipId,
                        cbBefore: m.cbBefore,
                        cbAfter: m.cbAfter
                    }))
                }
            }
        });
    }

    async findAllPools(year: number): Promise<Pool[]> {
        const pools = await this.prisma.pool.findMany({
            where: { year },
            include: { members: true }
        });

        return pools.map(p => ({
            id: p.id,
            year: p.year,
            createdAt: p.createdAt,
            members: p.members.map(m => ({
                shipId: m.shipId,
                cbBefore: m.cbBefore,
                cbAfter: m.cbAfter
            }))
        }));
    }
}
