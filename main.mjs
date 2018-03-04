import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import config from './config';

const app = new Koa();
const demoRouter = new Router();

demoRouter.get('/', ctx => {
  ctx.body = 'Hello world';
});

app.use(cors());
app.use(demoRouter.allowedMethods());
app.use(demoRouter.routes());

app.listen(config.port);
