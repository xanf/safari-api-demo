import Router from 'koa-router';
import template from 'lodash/template';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import jwtMiddleware from 'koa-jwt';
import {
  getCustomerByPhoneNumber,
  setSmsPin,
} from '../db/repositories/customer';
import { getUserByEmail } from '../db/repositories/user';
import {
  createSession,
  destroySessionsBySessionId,
} from '../db/repositories/session';
import sendSms from '../services/sms';
import { NotFoundError } from '../helpers/error';
import config from '../config';

const pinTemplate = template(config.messages.smsPin);

const router = new Router();
router.post('/customer', async ctx => {
  const { phoneNumber } = ctx.request.body;
  const customer = await getCustomerByPhoneNumber(phoneNumber);
  if (!customer) {
    throw new NotFoundError();
  }
  const pin = 1000 + Math.floor(Math.random() * 8999);

  await setSmsPin({
    phoneNumber,
    smsPin: pin.toString(),
  });

  await sendSms({
    phoneNumber,
    message: pinTemplate({ pin }),
  });
  ctx.body = { success: true };
});

router.post('/customer/sms', async ctx => {
  const { phoneNumber, pin } = ctx.request.body;
  const customer = await getCustomerByPhoneNumber(phoneNumber);
  if (!customer || customer.smsPin !== pin) {
    throw new NotFoundError();
  }

  await setSmsPin({
    phoneNumber,
    smsPin: '',
  });

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
  const user = await getUserByEmail(email);
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
