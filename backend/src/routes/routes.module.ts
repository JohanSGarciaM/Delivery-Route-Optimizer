import { Module } from '@nestjs/common';

import { RoutesController } from './routes.controller.js';
import { RoutesService } from './routes.service.js';
import { GoogleRoutesService } from './google-routes.service.js';
import { RouteOptimizerService } from './route-optimizer.service.js';

@Module({
controllers: [RoutesController],
providers: [
RoutesService,
GoogleRoutesService,
RouteOptimizerService,
],
})
export class RoutesModule {}
