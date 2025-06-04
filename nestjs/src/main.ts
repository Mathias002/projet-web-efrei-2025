import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // Adjust the path if necessary
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
