import { Pool } from '../domain/pool.entity';

export interface PoolingRepository {
    savePool(pool: Pool): Promise<void>;
    findAllPools(year: number): Promise<Pool[]>;
}
