import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
  import { UpdateVendedorDto } from './dto/update-vendedor.dto';

@Injectable()
export class VendedoresService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateVendedorDto) {
    try {
      return await this.prisma.vendedor.create({ data });
    } catch (error: any) {
      if (error.code === 'P2002') {
        // unique constraint (email)
        throw new ConflictException('Ya existe un vendedor con ese email');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.vendedor.findMany({ where: { activo: true } });
  }

  async findOne(id: number) {
    const vendedor = await this.prisma.vendedor.findUnique({ where: { id } });
    if (!vendedor || !vendedor.activo) {
      throw new NotFoundException(`Vendedor ${id} no encontrado`);
    }
    return vendedor;
  }

  async update(id: number, data: UpdateVendedorDto) {
    await this.findOne(id);
    try {
      return await this.prisma.vendedor.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un vendedor con ese email');
      }
      throw error;
    }
  }

  // Soft delete: marcar como inactivo; si tiene ventas, bloquear eliminación dura
  async remove(id: number) {
    await this.findOne(id);

    const tieneVentas = await this.prisma.venta.findFirst({
      where: { vendedorId: id },
      select: { id: true },
    });

    if (tieneVentas) {
      // Política típica en sistemas de ventas: no permitir borrado si tiene ventas
      // Marcamos como inactivo en su lugar
      return this.prisma.vendedor.update({
        where: { id },
        data: { activo: false },
      });
    }

    // Si no tiene ventas, puedes optar por soft delete igualmente:
    return this.prisma.vendedor.update({
      where: { id },
      data: { activo: false },
    });
  }
}
