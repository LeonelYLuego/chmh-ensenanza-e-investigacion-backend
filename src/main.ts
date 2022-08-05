import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AllExceptionsFilter } from "@utils/exceptions/all-exceptions-filter";
import { AppModule } from "app.module";


/** Starts a program's execution  */
async function bootstrap() {
  // Create a new application of Nestjs
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle(
      'Centenario Hospital Miguel Hidalgo - Departamento Enseñanza e Investigación API',
    )
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Global functionalities of Nestjs
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.useGlobalPipes(new ValidationPipe());

  // Enable Cors
  app.enableCors();

  // Application port
  await app.listen(3000);
}
bootstrap();
