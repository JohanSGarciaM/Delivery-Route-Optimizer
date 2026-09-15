import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoutesController } from './routes.controller.js';
import { RoutesService } from './routes.service.js';
import { GoogleRoutesService } from './google-routes.service.js';
import { RouteOptimizerService } from './route-optimizer.service.js';
import { Route } from './entities/route.entity.js';
import { Delivery } from './entities/delivery.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Route, Delivery]),
    ],
    controllers: [RoutesController],
    providers: [RoutesService, GoogleRoutesService, RouteOptimizerService],
})
export class RoutesModule {}