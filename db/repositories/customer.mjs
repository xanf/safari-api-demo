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
  const card = cardId ? await getCard({ id: cardId }) : null;
  return {
    ...customer,
    card,
  };
}

function update({ criteria, data }) {
  return table()
    .where(criteria)
    .update(data);
}

export const setSmsPin = ({ phoneNumber, smsPin }) =>
  update({ criteria: { phoneNumber }, data: { smsPin } });

export const setNotes = ({ customerId, notes }) =>
  update({ criteria: { id: customerId }, data: { notes } });

export const setCardId = ({ customerId, cardId }) =>
  update({ criteria: { id: customerId }, data: { cardId } });
