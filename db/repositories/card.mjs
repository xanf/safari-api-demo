import db from '..';
import checkExistence from '../../helpers/checkExistence';
import { getCardLevelById } from './cardLevel';

const table = () => db('cards');

export async function getCard(criteria) {
  const card = await table()
    .select()
    .where(criteria)
    .first()
    .then(checkExistence);
  const cardLevel = await getCardLevelById(card.cardLevelId);
  return {
    ...card,
    cardLevel,
  };
}
