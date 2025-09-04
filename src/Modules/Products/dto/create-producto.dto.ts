import { IsString, IsOptional, IsInt, Min, IsPositive, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({
    example: 'Filtro de Aceite Toyota',
    description: 'Nombre del repuesto de auto',
  })
  @IsString()
  nombre: string;

  @ApiProperty({
    example: 'Filtro de aceite compatible con Toyota Corolla 2015-2020',
    description: 'Descripción del repuesto (opcional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({
    example: 25.99,
    description: 'Precio del repuesto en dólares',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio: number;

  @ApiProperty({
    example: 50,
    description: 'Cantidad disponible en stock del repuesto',
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: 'Filtros',
    description: 'Categoría del repuesto (opcional, ejemplo: Frenos, Motor, Suspensión, Filtros, etc.)',
    required: false,
  })
  @IsString()
  @IsOptional()
  categoria?: string;
}
