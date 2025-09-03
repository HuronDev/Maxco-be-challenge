import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API Ventas')
    .setDescription(
      'API para gestión de clientes, zonas, productos, vendedores y ventas',
    )
    .setVersion('1.0')
    .setContact('Carlos Andres Paredes', '', 'carlos.paredes23@hotmail.com')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useLogger(['error', 'warn', 'log']);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
