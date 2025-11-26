import { ComplianceBalance } from './compliance.entity';

export interface Pool {
    id: string;
    year: number;
    createdAt: Date;
    members: PoolMember[];
}

export interface PoolMember {
    shipId: string;
    cbBefore: number;
    cbAfter: number;
}
