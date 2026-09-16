import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CalculateRouteDto } from './dto/calculate-route.dto.js';

@Injectable()
export class GoogleRoutesService {
    private readonly apiKey: string;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.apiKey =
            this.configService.get<string>('MAPS_SERVER_KEY') ?? '';
    }

    async testConnection() {
        if (!this.apiKey) {
            throw new Error(
                'MAPS_SERVER_KEY no está configurada en el archivo .env',
            );
        }

        console.log('Consultando Google Routes API..');

        return {
            message: 'GoogleRoutesService Funcionando',
        };
    }
    async getTravelTimeMatrix(data : CalculateRouteDto) {
        if (!this.apiKey) {
            throw new Error(
                'MAPS_SERVER_KEY no está configurada en el archivo .env',
            );
        }

        const points = [
            data.origin,
            ...data.deliveries,
        ];

        const origins = points.map((point) => ({
            waypoint: {
                location: {
                    latLng: {
                        latitude: point.latitude,
                        longitude: point.longitude,
                    },
                },
            },
        }));

        const destinations = points.map((point) => ({
            waypoint: {
                location: {
                    latLng: {
                        latitude: point.latitude,
                        longitude: point.longitude,
                    },
                },
            },
        }));

        const url = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';
    
        const body = {
            origins,
            destinations,
            travelMode: 'DRIVE',
            routingPreference: 'TRAFFIC_AWARE',
        };

        const response = await fetch(url, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': this.apiKey,
                'X-Goog-FieldMask':
                    'originIndex,destinationIndex,duration,distanceMeters',
            },

            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(
                `Google Routes API respondió ${response.status}: ${errorText}`,
            );
        }

        const result = await response.text();

        const matrixResponse = JSON.parse(result);

        const size = points.length;

        const durationMatrix = Array.from(
            { length: size },
            () => Array(size).fill(0),
        );

        const distanceMatrix = Array.from(
            { length: size },
            () => Array(size).fill(0),
        );

        for ( const item of matrixResponse) {
            const originIndex = item.originIndex;
            const destinationIndex = item.destinationIndex;

            durationMatrix[originIndex][destinationIndex] =
                this.parseDuration(item.duration);

            distanceMatrix[originIndex][destinationIndex] =
                item.distanceMeters ?? '0'
        }

        console.log(`Matriz procesada para ${size} puntos.`);

        return {
            durationMatrix,
            distanceMatrix,
        };
    }

    async getFinalRoute(
        data: CalculateRouteDto,
        optimizedOrder: number[],
    ) {
        if (!this.apiKey) {
            throw new Error(
                'MAPS_SERVER_KEY no está configurado en el archivo .env',
            );
        }

        const origin = data.origin;

        const orderedDeliveries = optimizedOrder.map(
            (pointIndex) =>
                data.deliveries[pointIndex - 1],
        );

        const finalDelivery = orderedDeliveries[orderedDeliveries.length - 1];

        const intermediateDeliveries = orderedDeliveries.slice(0, -1);

        const requestBody = {
            origin: {
                location: {
                    latLng: {
                        latitude: origin.latitude,
                        longitude: origin.longitude,
                    },
                },
            },

            destination: {
                location: {
                    latLng: {
                        latitude: finalDelivery.latitude,
                        longitude: finalDelivery.longitude,
                    },
                },
            },

            intermediates: intermediateDeliveries.map(
                (delivery) => ({
                    location: {
                        latLng: {
                            latitude: delivery.latitude,
                            longitude: delivery.longitude,
                        },
                    },
                }),
            ),

            travelMode: 'DRIVE',

            routingPreference: 'TRAFFIC_AWARE',

            optimizeWaypointOrder: false,
        };

        const response = await fetch(
            'https://routes.googleapis.com/directions/v2:computeRoutes',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': this.apiKey,
                    'X-Goog-FieldMask':
                    'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs',
                },
                body: JSON.stringify(requestBody),
            },
        );

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(
                `Google Routes API respondió ${response.status}: ${errorText}`,
            );
        }

        const result = await response.json();

        console.log('Tramos de la ruta:', result.routes?.[0]?.legs,);
        
        return result;
    }


    private parseDuration(duration: string): number {
        return Number(duration.replace('s',''));
    }
   
}