import jwtMiddleware from 'koa-jwt';
import { NotAuthorizedError } from '../helpers/error';
import { getUserBySessionId } from '../db/repositories/user';
import config from '../config';

const jwtMiddlewareInstance = jwtMiddleware({ secret: config.secret });
const roles = ['operator', 'manager', 'admin'];

const requireRole = role => {
  if (!roles.includes(role)) {
    throw new Error('Missing role');
  }

  return async (ctx, next) =>
    jwtMiddlewareInstance(ctx, async () => {
      const { user: tokenData } = ctx.state;
      if (!tokenData || tokenData.type !== 'user') {
        throw new NotAuthorizedError();
      }
      const user = await getUserBySessionId(tokenData.sessionId);
      const requestedRoleIdx = roles.indexOf(role);
      const userRoleIdx = roles.indexOf(user.role);

      if (userRoleIdx < requestedRoleIdx) {
        throw new NotAuthorizedError();
      }

      return next();
    });
};

export default requireRole;
