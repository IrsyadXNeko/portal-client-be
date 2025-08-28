import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { migrate } from './migrate';
import { startSchedulers } from './jobs/scheduler';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

async function bootstrap() {
  await migrate();
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('Invoice Service API').setDescription('API documentation for Invoice Service').setVersion('1.0').addBearerAuth().build()

  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./swagger-invoice.json', JSON.stringify(document, null, 2));
  fs.writeFileSync('./swagger-invoice.yaml', yaml.dump(document));

  SwaggerModule.setup('docs', app, document);
  
  app.getHttpAdapter().get('/swagger.json', (req, res) => {
    res.json(document);
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  startSchedulers();
}
bootstrap();
