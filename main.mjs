import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import config from './config';

import authRouter from './routes/auth';
import meRouter from './routes/me';

const app = new Koa();
const mainRouter = new Router();

const routers = { '/auth': authRouter, '/me': meRouter };
Object.entries(routers).forEach(([path, r]) => {
  mainRouter.use(path, r.routes(), r.allowedMethods());
});

app.use(cors());
app.use(bodyParser());
app.use(mainRouter.allowedMethods());
app.use(mainRouter.routes());

app.listen(config.port);
