import db from '..';
import checkExistence from '../../helpers/checkExistence';
import { getCardById } from './card';

const table = () => db('customers');

export function getCustomerByPhoneNumber(phoneNumber) {
  return table()
    .select()
    .where({ phoneNumber })
    .first()
    .then(checkExistence);
}

export async function getCustomerFullInfoByPhoneNumber(phoneNumber) {
  const customer = await getCustomerByPhoneNumber(phoneNumber);
  const { cardId } = customer;
  const card = await getCardById(cardId);
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
