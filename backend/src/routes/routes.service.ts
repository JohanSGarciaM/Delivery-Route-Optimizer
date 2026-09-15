import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Route } from './entities/route.entity.js';
import { Delivery } from './entities/delivery.entity.js';
import { CalculateRouteDto } from './dto/calculate-route.dto.js';
import { GoogleRoutesService } from './google-routes.service.js';
import { RouteOptimizerService } from './route-optimizer.service.js';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,

    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,

    private readonly googleRoutesService: GoogleRoutesService,

    private readonly routeOptimizerService: RouteOptimizerService,

    
  ) {}

  async calculateRoute(data: CalculateRouteDto) {

    const googleMatrix =
      await this.googleRoutesService.getTravelTimeMatrix(
        data,
      );

    const optimization =
      this.routeOptimizerService.optimize(
        googleMatrix.durationMatrix,
      );

    const finalRoute =
      await this.googleRoutesService.getFinalRoute(
        data,
        optimization.order,
      );

    const route = this.routeRepository.create({
      originAddress: data.origin.address,
      originLatitude: data.origin.latitude,
      originLongitude: data.origin.longitude,
    });

    const savedRoute = await this.routeRepository.save(route);

    const deliveries = optimization.order.map(
      (pointIndex, index) => {
        const delivery =
          data.deliveries[pointIndex - 1];
    
        return this.deliveryRepository.create({
          placeId: delivery.placeId,
          address: delivery.address,
          latitude: delivery.latitude,
          longitude: delivery.longitude,

          optimizedOrder: index + 1,
          routeId: savedRoute.id,
        });
      },
    );

    const savedDeliveries =
      await this.deliveryRepository.save(deliveries);

    return {
      route: savedRoute,
      optimization: {
        order: optimization.order,
        totalDuration:
          optimization.totalDuration,
      },
      deliveries: savedDeliveries,
      googleRoute: finalRoute,
    };
  }
}