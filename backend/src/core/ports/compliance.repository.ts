import { ComplianceBalance, BankEntry } from '../domain/compliance.entity';

export interface ComplianceRepository {
    saveCompliance(compliance: ComplianceBalance): Promise<void>;
    getCompliance(shipId: string, year: number): Promise<ComplianceBalance | null>;
    saveBankEntry(entry: BankEntry): Promise<void>;
    getBankEntries(shipId: string): Promise<BankEntry[]>;
}
