import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import jwtMiddleware from 'koa-jwt';
import { getUser } from '../db/repositories/user';
import {
  createSession,
  destroySessionsBySessionId,
} from '../db/repositories/session';
import { initPinAuth, performPinAuth } from '../services/pinAuth';
import { NotFoundError } from '../helpers/error';
import config from '../config';

const router = new Router();
router.post('/customer', async ctx => {
  const { phoneNumber } = ctx.request.body;
  await initPinAuth(phoneNumber);
  ctx.body = { success: true };
});

router.post('/customer/verify', async ctx => {
  const { phoneNumber, pin } = ctx.request.body;
  await performPinAuth({ phoneNumber, pin });
  ctx.body = {
    token: jwt.sign(
      {
        type: 'customer',
        phoneNumber,
      },
      config.secret
    ),
  };
});

router.post('/user', async ctx => {
  const { email, password } = ctx.request.body;
  const user = await getUser({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new NotFoundError();
  }

  const sessionId = await createSession(user.id);

  ctx.body = {
    token: jwt.sign(
      {
        type: 'user',
        sessionId,
      },
      config.secret
    ),
  };
});

router.post(
  '/user/logout',
  jwtMiddleware({ secret: config.secret }),
  async ctx => {
    const { sessionId } = ctx.state.user;
    if (!sessionId) {
      throw new NotFoundError();
    }
    await destroySessionsBySessionId(sessionId);
    ctx.body = { success: true };
  }
);

export default router;
