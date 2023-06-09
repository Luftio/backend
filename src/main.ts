import { NestFactory } from "@nestjs/core";
import { ValidationPipe, BadRequestException } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors();

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Swagger UI
  const config = new DocumentBuilder()
    .setTitle("Luftio App Backend")
    .setDescription("Internal Luftio API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("ui", app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
