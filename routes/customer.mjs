import Router from 'koa-router';
import { getCard } from '../db/repositories/card';
import { getCustomerFullInfo } from '../db/repositories/customer';
import requireRole from '../helpers/acl';
import { initPinAuth, performPinAuth } from '../services/pinAuth';

const router = new Router();
router.use(requireRole('operator'));

router.get('/card/:code', async ctx => {
  const { code } = ctx.params;
  const { id } = await getCard({ code });
  ctx.body = await getCustomerFullInfo({ cardId: id });
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
  ctx.body = await getCustomerFullInfo({ phoneNumber });
});

export default router;
