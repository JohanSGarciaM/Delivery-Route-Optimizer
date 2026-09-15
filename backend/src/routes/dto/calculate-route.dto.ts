import {IsArray,IsInt,IsString,ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto.js';


export class DeliveryDto extends LocationDto {
    @IsString()
    id: string;

    @IsInt()
    order: number;
}

export class CalculateRouteDto {

    @ValidateNested()
    @Type(() => LocationDto)
    origin: LocationDto;

    @IsArray()
    @ValidateNested({ each: true})
    @Type(() => DeliveryDto)
    deliveries: DeliveryDto[];
}