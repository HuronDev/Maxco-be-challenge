 import { Module } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { ClientesService } from './client.service';
import { ClientesController } from './client.controller';
// import { ClientesService } from './clientes.service';
// import { ClientesController } from './clientes.controller';
// import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ClientesController],
  providers: [PrismaService,ClientesService],
})
export class ClientesModule {}
