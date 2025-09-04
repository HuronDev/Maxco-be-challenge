import { Module } from '@nestjs/common';
import { ZonasService } from './zonas.service';
import { ZonasController } from './zonas.controller';
import { PrismaService } from 'src/Prisma/prisma.service';

@Module({
  controllers: [ZonasController],
  providers: [ZonasService, PrismaService],
})
export class ZonasModule {}
