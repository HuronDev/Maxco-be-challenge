import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
        if (producto.stock < d.cantidad) {
          throw new BadRequestException(
            `No hay suficiente stock para el producto ${producto.nombre}`,
          );
        }

        const subtotal = Number(producto.precio) * d.cantidad;

        await this.prisma.producto.update({
          where: { id: d.productoId },
          data: { stock: producto.stock - d.cantidad },
        });

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
    const ventas = await this.prisma.venta.findMany({
      include: {
        detalles: { include: { producto: true } },
        cliente: true,
        vendedor: true,
        zona: true,
      },
      orderBy: { fecha: 'desc' },
    });

    const resultado = ventas.flatMap((venta) =>
      venta.detalles.map((detalle) => ({
        ventaId: venta.id,
        cliente: venta.cliente.nombre,
        vendedor: venta.vendedor.nombre,
        zona: venta.zona.nombre,
        fecha: venta.fecha.toISOString().split('T')[0],
        productoId: detalle.productoId,
        producto: detalle.producto.nombre,
        cantidad: detalle.cantidad,
        precio_unitario: Number(detalle.precio_unitario),
        subtotal: Number(detalle.subtotal),
      })),
    );

    return resultado;
  }

  async updateCantidadDetalle(
    ventaId: number,
    productoId: number,
    nuevaCantidad: number,
  ) {
    const detalle = await this.prisma.detalleVenta.findFirst({
      where: { ventaId, productoId },
      include: { producto: true },
    });

    if (!detalle)
      throw new NotFoundException(
        `Detalle de producto ${productoId} no encontrado en la venta ${ventaId}`,
      );

    const deltaCantidad = nuevaCantidad - detalle.cantidad;
    if (deltaCantidad > 0 && detalle.producto.stock < deltaCantidad) {
      throw new BadRequestException(
        `Stock insuficiente para el producto ${detalle.producto.nombre}`,
      );
    }

    const nuevoSubtotal = Number(detalle.producto.precio) * nuevaCantidad;
    await this.prisma.detalleVenta.update({
      where: { id: detalle.id },
      data: {
        cantidad: nuevaCantidad,
        subtotal: nuevoSubtotal,
      },
    });
    await this.prisma.producto.update({
      where: { id: productoId },
      data: {
        stock: { decrement: deltaCantidad },
      },
    });
    const detalles = await this.prisma.detalleVenta.findMany({
      where: { ventaId },
    });
    const monto_total = detalles.reduce(
      (sum, d) => sum + Number(d.subtotal),
      0,
    );

    return this.prisma.venta.update({
      where: { id: ventaId },
      data: { monto_total },
    });
  }

  async remove(id: number) {
    const venta = await this.prisma.venta.findUnique({ where: { id } });
    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }
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
    return this.prisma.zona.findMany({
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
