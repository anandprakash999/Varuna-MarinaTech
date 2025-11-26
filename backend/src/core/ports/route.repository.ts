import { Route } from '../domain/route.entity';

export interface RouteRepository {
    findAll(): Promise<Route[]>;
    findById(id: string): Promise<Route | null>;
    setBaseline(id: string): Promise<void>;
    findBaseline(): Promise<Route | null>;
}
