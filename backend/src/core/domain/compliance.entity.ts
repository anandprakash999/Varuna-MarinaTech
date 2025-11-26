export interface ComplianceBalance {
    shipId: string;
    year: number;
    cb: number; // gCO2e
    status: 'SURPLUS' | 'DEFICIT';
}

export interface BankEntry {
    id: string;
    shipId: string;
    year: number;
    amount: number;
    createdAt: Date;
}
