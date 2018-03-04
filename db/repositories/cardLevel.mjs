import db from '..';
import checkExistence from '../../helpers/checkExistence';

const table = () => db('cardLevels');

export function getCardLevelById(id) {
  return table()
    .select()
    .where({ id })
    .first()
    .then(checkExistence);
}
