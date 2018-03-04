import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import config from './config';

import authRouter from './routes/auth';

const app = new Koa();
const mainRouter = new Router();

mainRouter.use('/auth', authRouter.routes(), authRouter.allowedMethods());

// app.use(errorHandler);
app.use(cors());
app.use(bodyParser());
app.use(mainRouter.allowedMethods());
app.use(mainRouter.routes());

app.listen(config.port);
