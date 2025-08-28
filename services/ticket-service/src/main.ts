import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { migrate } from './migrate';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

async function bootstrap() {
  await migrate();
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('Ticket Service API').setDescription('API documentation for Ticket Service').setVersion('1.0').addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./swagger-ticket', JSON.stringify(document, null, 2));
  fs.writeFileSync('./swagger-ticket', yaml.dump(document));

  SwaggerModule.setup('docs', app, document);
  
  app.getHttpAdapter().get('/swagger.json', (req, res) => {
    res.json(document);
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
