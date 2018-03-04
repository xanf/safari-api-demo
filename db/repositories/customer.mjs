import db from '..';
import checkExistence from '../../helpers/checkExistence';
import { getCard } from './card';

const table = () => db('customers');

export function getCustomer(criteria) {
  return table()
    .select()
    .where(criteria)
    .first()
    .then(checkExistence);
}

export async function getCustomerFullInfo(criteria) {
  const customer = await getCustomer(criteria);
  const { cardId } = customer;
  const card = await getCard({ id: cardId });
  return {
    ...customer,
    card,
  };
}

export function setSmsPin({ phoneNumber, smsPin }) {
  return table()
    .where({ phoneNumber })
    .update({ smsPin });
}
