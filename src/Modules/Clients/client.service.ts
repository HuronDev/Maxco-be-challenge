import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-client.dto';
import { UpdateClienteDto } from './dto/update-client.dto';
import { PrismaService } from '../../Prisma/prisma.service';


@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClienteDto) {
  const clienteExistente = await this.prisma.cliente.findFirst({
    where: { email: data.email },
  });

  if (clienteExistente) {
    if (!clienteExistente.activo) {
      return this.prisma.cliente.update({
        where: { id: clienteExistente.id },
        data: { ...data, activo: true },
      });
    }
    return clienteExistente;
  }

  return this.prisma.cliente.create({ data });
}



  async findAll() {
    return this.prisma.cliente.findMany({ where: { activo: true } });
  }

  async findOne(id: number) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    if (!cliente || !cliente.activo)
      throw new NotFoundException(`Cliente ${id} no encontrado`);
    return cliente;
  }

  async update(id: number, data: UpdateClienteDto) {
    await this.findOne(id);
    return this.prisma.cliente.update({ where: { id }, data });
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);

    const ventas = await this.prisma.venta.findFirst({
      where: { clienteId: id },
    });
    if (ventas) {
      throw new BadRequestException(
        `No se puede borrar el cliente ${id} porque tiene ventas asociadas`,
      );
    }

    return this.prisma.cliente.update({
      where: { id },
      data: { activo: false },
    });
  }
}
