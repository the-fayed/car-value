import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsLongitude,
  IsLatitude,
  Min,
  Max,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear())
  year: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  mileage: number;
}
