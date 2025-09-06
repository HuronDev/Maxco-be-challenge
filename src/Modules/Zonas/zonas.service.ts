import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';
import { PrismaService } from '../../Prisma/prisma.service';

@Injectable()
export class ZonasService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateZonaDto) {
    return this.prisma.zona.create({ data });
  }

  async findAll() {
    return this.prisma.zona.findMany({ where: { activo: true } });
  }

  async findOne(id: number) {
    const zona = await this.prisma.zona.findUnique({ where: { id } });
    if (!zona || !zona.activo) throw new NotFoundException(`Zona ${id} no encontrada`);
    return zona;
  }

  async update(id: number, data: UpdateZonaDto) {
    await this.findOne(id);
    return this.prisma.zona.update({ where: { id }, data });
  }

  // Soft delete: marcar zona como inactiva
  async remove(id: number) {
    const zona = await this.findOne(id);

    const ventas = await this.prisma.venta.findFirst({ where: { zonaId: id } });
    if (ventas) {
      throw new BadRequestException(`No se puede borrar la zona ${id} porque tiene ventas asociadas`);
    }

    return this.prisma.zona.update({ where: { id }, data: { activo: false } });
  }
}
