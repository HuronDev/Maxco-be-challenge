import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({ example: 'Carlos Perez' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'carlos@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '0991234567', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'Av. Siempre Viva 123', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;
}
