import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateZonaDto {
  @ApiProperty({ example: 'Centro' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Zona central de la ciudad', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
