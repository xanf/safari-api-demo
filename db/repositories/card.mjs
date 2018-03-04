import db from '..';
import checkExistence from '../../helpers/checkExistence';
import { getCardLevelById } from './cardLevel';

const table = () => db('cards');

export async function getCardById(id) {
  const card = await table()
    .select()
    .where({ id })
    .first()
    .then(checkExistence);
  const cardLevel = await getCardLevelById(card.cardLevelId);
  return {
    ...card,
    cardLevel,
  };
}
