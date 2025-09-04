import { IsString, IsOptional, IsInt, Min, IsPositive, IsDecimal } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDecimal()
  @IsPositive()
  precio: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  categoria?: string;
}
