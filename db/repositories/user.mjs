import db from '..';
import checkExistence from '../../helpers/checkExistence';

const table = () => db('users');

export function getUser(criteria) {
  return table()
    .select()
    .where(criteria)
    .first()
    .then(checkExistence);
}

export async function getUserBySessionId(sessionId) {
  const { userId } = await db('sessions')
    .select()
    .where({ id: sessionId })
    .first()
    .then(checkExistence);

  return getUser({ id: userId });
}
