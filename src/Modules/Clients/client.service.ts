import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-client.dto';
import { UpdateClienteDto } from './dto/update-client.dto';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClienteDto) {
    return this.prisma.cliente.create({ data });
  }

  async findAll() {
    return this.prisma.cliente.findMany();
  }

  async findOne(id: number) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    if (!cliente) throw new NotFoundException(`Cliente ${id} no encontrado`);
    return cliente;
  }

  async update(id: number, data: UpdateClienteDto) {
    await this.findOne(id); // validar existencia
    return this.prisma.cliente.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id); // validar existencia
    return this.prisma.cliente.delete({ where: { id } });
  }
}
