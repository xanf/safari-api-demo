import db from '..';
import { NotFoundError } from '../../helpers/error';

const table = () => db('sessions');

export async function destroySessionsBySessionId(sessionId) {
  const session = await table()
    .select()
    .where({ id: sessionId })
    .first();

  if (!session) {
    throw new NotFoundError();
  }
  await table()
    .where({ userId: session.userId })
    .del();
}

export function createSession(userId) {
  return table()
    .insert({ userId })
    .then(([id]) => id);
}
