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
        if (!producto) {
          throw new NotFoundException(`Producto ${d.productoId} no encontrado`);
        }

        const precioUnitario = Number(producto.precio);
        const subtotal = precioUnitario * d.cantidad;

        return {
          productoId: d.productoId,
          cantidad: d.cantidad,
          precio_unitario: precioUnitario,
          subtotal,
        };
      }),
    );

    // Calculamos el monto total de la venta
    const monto_total = detallesConPrecio.reduce((sum, d) => sum + d.subtotal, 0);

    // Creamos la venta con los detalles calculados
    return this.prisma.venta.create({
      data: {
        clienteId: data.clienteId,
        vendedorId: data.vendedorId,
        zonaId: data.zonaId,
        fecha: data.fecha ? new Date(data.fecha) : new Date(),
        monto_total,
        detalles: { create: detallesConPrecio },
      },
      include: {
        detalles: true,
        cliente: true,
        vendedor: true,
        zona: true,
      },
    });
  }

  async findAll() {
    return this.prisma.venta.findMany({
      include: { detalles: true, cliente: true, vendedor: true, zona: true },
    });
  }

  async findOne(id: number) {
    const venta = await this.prisma.venta.findUnique({
      where: { id },
      include: { detalles: true, cliente: true, vendedor: true, zona: true },
    });

    if (!venta) throw new NotFoundException(`Venta ${id} no encontrada`);

    return venta;
  }
}
