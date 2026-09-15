import { Body, Controller, Post } from '@nestjs/common';

import { CalculateRouteDto } from './dto/calculate-route.dto.js';
import { RoutesService } from './routes.service.js';
import { GoogleRoutesService } from './google-routes.service.js';
import { RouteOptimizerService } from './route-optimizer.service.js';

@Controller('routes')
export class RoutesController {
  constructor(
    private readonly routesService: RoutesService,
    private readonly googleRoutesService: GoogleRoutesService,
    private readonly routeOptimizerService: RouteOptimizerService,
  ) {}

  @Post('calculate')
  calculateRoute(@Body() body: CalculateRouteDto) {
    return this.routesService.calculateRoute(body);
  }

  @Post('test-google')
  testGoogle(){
    return this.googleRoutesService.testConnection();
  }

  @Post('test-matrix')
  testMatrix(@Body() body: CalculateRouteDto){
    return this.googleRoutesService.getTravelTimeMatrix(body);
  }

  @Post('test-optimizer')
  testOptimizer() {
    const durationMatrix = [
      [0, 1147, 4014],
      [1802, 0, 3069],
      [4326, 2888, 0],
    ];

    return this.routeOptimizerService.optimize(
      durationMatrix,
    );
  }
}