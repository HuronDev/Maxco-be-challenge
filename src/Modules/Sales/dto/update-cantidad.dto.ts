import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateCantidadDto {
  @ApiProperty({ description: 'Nueva cantidad del producto', example: 3 })
  @IsInt()
  @IsPositive()
  cantidad: number;
}
