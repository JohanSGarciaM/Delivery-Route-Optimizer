import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Route } from './entities/route.entity.js';
import { Delivery } from './entities/delivery.entity.js';
import { CalculateRouteDto } from './dto/calculate-route.dto.js';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,

    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
  ) {}

  async calculateRoute(data: CalculateRouteDto) {
    const route = this.routeRepository.create({
      originAddress: data.origin.address,
      originLatitude: data.origin.latitude,
      originLongitude: data.origin.longitude,
    });

    const savedRoute = await this.routeRepository.save(route);

    const deliveries = data.deliveries.map((delivery) =>
      this.deliveryRepository.create({
        placeId: delivery.placeId,
        address: delivery.address,
        latitude: delivery.latitude,
        longitude: delivery.longitude,
        optimizedOrder: delivery.order,
        routeId: savedRoute.id,
      }),
    );

    const savedDeliveries =
      await this.deliveryRepository.save(deliveries);

    return {
      route: savedRoute,
      deliveries: savedDeliveries,
    };
  }
}