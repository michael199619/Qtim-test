import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';
import { ExFilter } from '@test/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { SERVICE_ID } from './constants';
import { appConfig } from './modules/config/config';

async function bootstrap() {
  const app=await NestFactory.create(AppModule);

  const configApp=app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  app.useGlobalFilters(new ExFilter());
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false,
  }));

  const config=new DocumentBuilder()
    .setTitle(SERVICE_ID)
    .setDescription('Api for admin')
    .setVersion('1.0')
    .build();
  const documentFactory=SwaggerModule.createDocument(app,config);
  SwaggerModule.setup(configApp.apiPrefix,app,documentFactory);

  await app.listen(configApp.port,() => {
    console.log(`API Client is running on port http://localhost:${configApp.port}/${configApp.apiPrefix}`);
  });
}
bootstrap();
