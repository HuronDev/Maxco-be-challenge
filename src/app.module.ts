import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaModule } from './Prisma/prisma.module';
import { ClientesModule } from './Modules/Clients/client.module';
import { ZonasModule } from './Modules/Zonas/zonas.module';
import { ProductosModule } from './Modules/Products/productos.module';

@Module({
  imports: [
    PrismaModule,
    PrismaClient,
    ClientesModule,
    ZonasModule,
    ProductosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
