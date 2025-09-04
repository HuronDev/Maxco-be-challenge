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

  // specific methods

  async zonasConMasVentasPorVendedor() {
    const grupos = await this.prisma.venta.groupBy({
      by: ['vendedorId', 'zonaId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const resultados = await Promise.all(
      grupos.map(async (g) => {
        const vendedor = await this.prisma.vendedor.findUnique({
          where: { id: g.vendedorId },
        });
        const zona = await this.prisma.zona.findUnique({
          where: { id: g.zonaId },
        });

        return {
          vendedor: vendedor?.nombre || 'Desconocido',
          zona: zona?.nombre || 'Desconocida',
          totalVentas: g._count.id,
        };
      }),
    );

    return resultados;
  }

  async zonasSinVentas(fechaInicio: string, fechaFin: string) {
    const zonas = await this.prisma.zona.findMany({
      where: {
        ventas: {
          none: {
            fecha: {
              gte: new Date(fechaInicio),
              lte: new Date(fechaFin),
            },
          },
        },
      },
    });

    return zonas;
  }

  async vendedoresSinVentas(fechaInicio: string, fechaFin: string) {
    const ventas = await this.prisma.venta.findMany({
      where: {
        fecha: {
          gte: new Date(fechaInicio),
          lte: new Date(fechaFin),
        },
      },
      select: { vendedorId: true },
    });

    const vendedoresConVentas = ventas.map((v) => v.vendedorId);
    return this.prisma.vendedor.findMany({
      where: {
        id: { notIn: vendedoresConVentas },
      },
    });
  }

  async ventasPorClientePorAño(anios: number[]) {
    const ventas = await this.prisma.venta.findMany({
      include: {
        cliente: true,
        zona: true, 
      },
    });

    const resultado = ventas.reduce(
      (acc, venta) => {
        const anio = new Date(venta.fecha).getFullYear();
        if (!anios.includes(anio)) return acc;

        const key = venta.clienteId;

        if (!acc[key]) {
          acc[key] = {
            idCliente: venta.cliente.id,
            nombreCliente: venta.cliente.nombre,
            zona: venta.zona.nombre, 
            ventas: {},
          };
        }

        acc[key].ventas[anio] =
          (acc[key].ventas[anio] || 0) + Number(venta.monto_total);

        return acc;
      },
      {} as Record<number, any>,
    );

    return Object.values(resultado);
  }
}
