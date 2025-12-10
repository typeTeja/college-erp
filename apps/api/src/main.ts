import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: 'http://localhost:3000', // Frontend URL
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });

    // Global Validation Pipe
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // Cookie Parser
    app.use(cookieParser());

    // Swagger Documentation
    const config = new DocumentBuilder()
        .setTitle('College ERP API')
        .setDescription('The College ERP basic API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(3001);
}
bootstrap();
