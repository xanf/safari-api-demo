import db from '..';

const table = () => db('users');

export function getUserByEmail(email) {
  return table()
    .select()
    .where({ email })
    .first();
}
