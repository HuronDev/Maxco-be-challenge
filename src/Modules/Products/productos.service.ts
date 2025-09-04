import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductoDto) {
    return this.prisma.producto.create({ data });
  }

  async findAll() {
    return this.prisma.producto.findMany({ where: { activo: true } });
  }

  async findOne(id: number) {
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto || !producto.activo)
      throw new NotFoundException(`Producto ${id} no encontrado`);
    return producto;
  }

  async update(id: number, data: UpdateProductoDto) {
    await this.findOne(id);
    return this.prisma.producto.update({ where: { id }, data });
  }

  // Soft delete: marcar producto como inactivo
  async remove(id: number) {
    const producto = await this.findOne(id);

    const detalle = await this.prisma.detalleVenta.findFirst({
      where: { productoId: id },
    });
    if (detalle) {
      throw new BadRequestException(
        `No se puede borrar el producto ${id} porque tiene ventas asociadas`,
      );
    }

    return this.prisma.producto.update({
      where: { id },
      data: { activo: false },
    });
  }
}
