import { Injectable } from '@nestjs/common';

import { CalculateRouteDto } from './dto/calculate-route.dto.js';
import { GoogleRoutesService } from './google-routes.service.js';
import { RouteOptimizerService } from './route-optimizer.service.js';

@Injectable()
export class RoutesService {
constructor(
private readonly googleRoutesService: GoogleRoutesService,

private readonly routeOptimizerService: RouteOptimizerService,

) {}

async calculateRoute(data: CalculateRouteDto) {
const googleMatrix =
await this.googleRoutesService.getTravelTimeMatrix(data);

const optimization =
  this.routeOptimizerService.optimize(
    googleMatrix.durationMatrix,
  );

const finalRoute =
  await this.googleRoutesService.getFinalRoute(
    data,
    optimization.order,
  );

return {
  optimization: {
    order: optimization.order,
    totalDuration: optimization.totalDuration,
  },

  googleRoute: finalRoute,
};

}
}