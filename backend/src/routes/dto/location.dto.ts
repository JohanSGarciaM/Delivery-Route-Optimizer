import { IsNumber, IsString } from "class-validator";

export class LocationDto {
    @IsString()
    placeId: string;

    @IsString()
    address: string;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;
}