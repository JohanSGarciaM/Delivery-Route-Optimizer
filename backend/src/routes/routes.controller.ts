import { Body, Controller, Post } from '@nestjs/common';

import { CalculateRouteDto } from './dto/calculate-route.dto.js';
import { RoutesService } from './routes.service.js';


@Controller('routes')
export class RoutesController {
  constructor(
    private readonly routesService: RoutesService,
  ) {}

  @Post('calculate')
  calculateRoute(@Body() body: CalculateRouteDto) {
    return this.routesService.calculateRoute(body);
  }
}