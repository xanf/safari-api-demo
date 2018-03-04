import Router from 'koa-router';
import jwtMiddleware from 'koa-jwt';

import { NotAuthorizedError } from '../helpers/error';
import { getCustomerFullInfoByPhoneNumber } from '../db/repositories/customer';
import config from '../config';

const router = new Router();

router.use(jwtMiddleware({ secret: config.secret }));
router.use((ctx, next) => {
  if (!ctx.state.user.type === 'customer') {
    throw new NotAuthorizedError();
  }
  return next();
});

router.get('/', async ctx => {
  ctx.body = await getCustomerFullInfoByPhoneNumber(ctx.state.user.phoneNumber);
});

export default router;
