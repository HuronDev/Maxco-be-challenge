import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CreateVentaDto } from './dto/create-venta.dto';

@Injectable()
export class VentasService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateVentaDto) {
    const detallesConPrecio = await Promise.all(
      data.detalles.map(async (d) => {
        const producto = await this.prisma.producto.findUnique({
          where: { id: d.productoId },
        });
        if (!producto)
          throw new NotFoundException(`Producto ${d.productoId} no encontrado`);

        const subtotal = Number(producto.precio) * d.cantidad;

        return {
          productoId: d.productoId,
          cantidad: d.cantidad,
          precio_unitario: Number(producto.precio),
          subtotal,
        };
      }),
    );

    const monto_total = detallesConPrecio.reduce(
      (sum, d) => sum + d.subtotal,
      0,
    );

    return this.prisma.venta.create({
      data: {
        clienteId: data.clienteId,
        vendedorId: data.vendedorId,
        zonaId: data.zonaId,
        fecha: new Date(data.fecha),
        monto_total,
        detalles: { create: detallesConPrecio },
      },
      include: { detalles: true, cliente: true, vendedor: true, zona: true },
    });
  }

  async findAll() {
    return this.prisma.venta.findMany({
      include: { detalles: true, cliente: true, vendedor: true, zona: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.venta.findUnique({
      where: { id },
      include: { detalles: true, cliente: true, vendedor: true, zona: true },
    });
  }

  async update(id: number, data: CreateVentaDto) {
    const ventaExistente = await this.prisma.venta.findUnique({
      where: { id },
      include: { detalles: true },
    });
    if (!ventaExistente)
      throw new NotFoundException(`Venta ${id} no encontrada`);

    await this.prisma.detalleVenta.deleteMany({
      where: { ventaId: id },
    });

    const detallesConPrecio = await Promise.all(
      data.detalles.map(async (d) => {
        const producto = await this.prisma.producto.findUnique({
          where: { id: d.productoId },
        });
        if (!producto)
          throw new NotFoundException(`Producto ${d.productoId} no encontrado`);

        const subtotal = Number(producto.precio) * d.cantidad;
        return {
          productoId: d.productoId,
          cantidad: d.cantidad,
          precio_unitario: Number(producto.precio),
          subtotal,
        };
      }),
    );

    const monto_total = detallesConPrecio.reduce(
      (sum, d) => sum + d.subtotal,
      0,
    );

    return this.prisma.venta.update({
      where: { id },
      data: {
        clienteId: data.clienteId,
        vendedorId: data.vendedorId,
        zonaId: data.zonaId,
        fecha: new Date(data.fecha),
        monto_total,
        detalles: { create: detallesConPrecio },
      },
      include: { detalles: true, cliente: true, vendedor: true, zona: true },
    });
  }

  async remove(id: number) {
    await this.prisma.detalleVenta.deleteMany({ where: { ventaId: id } });
    return this.prisma.venta.delete({ where: { id } });
  }
}
