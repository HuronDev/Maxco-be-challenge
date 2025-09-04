import { IsInt, IsPositive, IsDateString, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DetalleVentaDto {
  @ApiProperty({ description: 'ID del producto', example: 3 })
  @IsInt()
  productoId: number;

  @ApiProperty({ description: 'Cantidad vendida', example: 2 })
  @IsInt()
  @IsPositive()
  cantidad: number;

  @IsPositive()
  precio_unitario: number;
}

export class CreateVentaDto {
  @ApiProperty({ description: 'ID del cliente que realiza la venta', example: 1 })
  @IsInt()
  clienteId: number;

  @ApiProperty({ description: 'ID del vendedor que realiza la venta', example: 2 })
  @IsInt()
  vendedorId: number;

  @ApiProperty({ description: 'ID de la zona donde se realiza la venta', example: 1 })
  @IsInt()
  zonaId: number;

  @ApiProperty({ description: 'Fecha de la venta', example: '2025-09-04T10:00:00.000Z' })
  @IsDateString()
  fecha: string;

  @ApiProperty({
    description: 'Lista de detalles de la venta',
    type: [DetalleVentaDto],
  })
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  @ArrayNotEmpty()
  detalles: DetalleVentaDto[];
}
