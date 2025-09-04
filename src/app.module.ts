import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaModule } from './Prisma/prisma.module';
import { ClientesModule } from './Modules/Clients/client.module';

@Module({
  imports: [PrismaModule,PrismaClient, ClientesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
