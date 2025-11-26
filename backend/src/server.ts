import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Adapters
import { PrismaRouteRepository } from './adapters/outbound/postgres/route.repository';
import { PrismaComplianceRepository } from './adapters/outbound/postgres/compliance.repository';
import { PrismaPoolingRepository } from './adapters/outbound/postgres/pooling.repository';
import { RouteController } from './adapters/inbound/http/route.controller';
import { ComplianceController } from './adapters/inbound/http/compliance.controller';
import { PoolingController } from './adapters/inbound/http/pooling.controller';

// Core
import { RouteService } from './core/application/route.service';
import { ComplianceService } from './core/application/compliance.service';
import { PoolingService } from './core/application/pooling.service';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

// Dependency Injection
const routeRepo = new PrismaRouteRepository(prisma);
const complianceRepo = new PrismaComplianceRepository(prisma);
const poolingRepo = new PrismaPoolingRepository(prisma);

const routeService = new RouteService(routeRepo);
const complianceService = new ComplianceService(complianceRepo, routeRepo);
const poolingService = new PoolingService(poolingRepo, complianceRepo);

const routeController = new RouteController(routeService);
const complianceController = new ComplianceController(complianceService);
const poolingController = new PoolingController(poolingService);

// Routes
app.get('/routes', routeController.getAllRoutes);
app.post('/routes/:id/baseline', routeController.setBaseline);
app.get('/routes/comparison', routeController.getComparison);

app.get('/compliance/cb', complianceController.calculateCompliance);
app.get('/compliance/adjusted-cb', complianceController.getAdjustedCompliance);

app.post('/banking/bank', complianceController.bankSurplus);
// app.post('/banking/apply', complianceController.applyBanked); // Implement if needed

app.post('/pools', poolingController.createPool);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
