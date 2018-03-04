import Router from 'koa-router';
import { getCard } from '../db/repositories/card';
import { getCustomerFullInfo } from '../db/repositories/customer';
import requireRole from '../helpers/acl';

const router = new Router();
router.use(requireRole('operator'));

router.get('/card/:code', async ctx => {
  const { code } = ctx.params;
  const { id } = await getCard({ code });
  ctx.body = await getCustomerFullInfo({ cardId: id });
});

export default router;
