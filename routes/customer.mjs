import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import { getCard } from '../db/repositories/card';
import {
  getCustomer,
  getCustomerFullInfo,
  setNotes,
} from '../db/repositories/customer';
import requireRole from '../helpers/acl';
import { NotAuthorizedError } from '../helpers/error';
import config from '../config';
import { initPinAuth, performPinAuth } from '../services/pinAuth';
import { attachCard, detachCard } from '../services/cards';

const router = new Router();
router.use(requireRole('operator'));

async function getCustomerGrantToken(criteria) {
  const customer = await getCustomer(criteria);
  return {
    grantToken: jwt.sign({ customerId: customer.id }, config.secret),
  };
}

router.get('/card/:code', async ctx => {
  const { code } = ctx.params;
  const { id: cardId } = await getCard({ code });
  ctx.body = await getCustomerGrantToken({ cardId });
});

router.post('/phone/:phoneNumber', async ctx => {
  const { phoneNumber } = ctx.params;
  await initPinAuth(phoneNumber);
  ctx.body = { success: true };
});

router.post('/phone/:phoneNumber/verify', async ctx => {
  const { phoneNumber } = ctx.params;
  const { pin } = ctx.request.body;
  await performPinAuth({ phoneNumber, pin });
  ctx.body = await getCustomerGrantToken({ phoneNumber });
});

function verifyGrantToken(token) {
  try {
    const { customerId, iat } = jwt.decode(token);
    if (Date.now() / 1000 - iat > config.customerTimeout) {
      throw new Error();
    }
    return customerId;
  } catch (e) {
    throw new NotAuthorizedError();
  }
}

router.get('/grantToken/:token', async ctx => {
  const customerId = verifyGrantToken(ctx.params.token);
  ctx.body = await getCustomerFullInfo({ id: customerId });
});

router.post('/grantToken/:token/notes', async ctx => {
  const customerId = verifyGrantToken(ctx.params.token);
  const { notes } = ctx.request.body;
  await setNotes({ customerId, notes });
  ctx.body = { success: true };
});

router.post('/grantToken/:token/attachCard/:code', async ctx => {
  const customerId = verifyGrantToken(ctx.params.token);
  const { code } = ctx.params;
  await attachCard({ customerId, code });
  ctx.body = { success: true };
});

router.post('/grantToken/:token/detachCard', async ctx => {
  const customerId = verifyGrantToken(ctx.params.token);
  await detachCard({ customerId });
  ctx.body = { success: true };
});

export default router;
