import { PrismaClient } from '@prisma/client';
import { RouteRepository } from '../../../core/ports/route.repository';
import { Route } from '../../../core/domain/route.entity';

export class PrismaRouteRepository implements RouteRepository {
    constructor(private prisma: PrismaClient) { }

    async findAll(): Promise<Route[]> {
        const routes = await this.prisma.route.findMany();
        return routes.map(r => ({
            ...r,
            id: r.id, // Ensure ID is mapped correctly if needed, though Prisma returns it
        }));
    }

    async findById(id: string): Promise<Route | null> {
        const route = await this.prisma.route.findUnique({ where: { id } });
        return route;
    }

    async setBaseline(id: string): Promise<void> {
        // Unset current baseline
        await this.prisma.route.updateMany({
            where: { isBaseline: true },
            data: { isBaseline: false }
        });

        // Set new baseline
        await this.prisma.route.update({
            where: { id },
            data: { isBaseline: true }
        });
    }

    async findBaseline(): Promise<Route | null> {
        return this.prisma.route.findFirst({ where: { isBaseline: true } });
    }
}
