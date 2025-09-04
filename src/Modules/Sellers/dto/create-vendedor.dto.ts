import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendedorDto {
  @ApiProperty({ example: 'Lucía Fernández', description: 'Nombre del vendedor' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'lucia@empresa.com', description: 'Email único del vendedor' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '0994444444', description: 'Teléfono del vendedor', required: false })
  @IsString()
  @IsOptional()
  telefono?: string;
}
