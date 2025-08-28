import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { requestLogger } from './middlewares/request-logger.middleware';
import routes from './routes';
import { requestIdMiddleware } from './middlewares/request-id.middleware';

const app = express();

app.use(cors());
app.use(helmet());
app.use(requestLogger);
app.use(requestIdMiddleware);

app.use('/', routes);

app.listen(config.port, () => {
  console.log(`🚀 API Gateway running on port ${config.port}`);
});
