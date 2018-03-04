import db from '..';

const table = () => db('customers');

export function getCustomerByPhoneNumber(phoneNumber) {
  return table()
    .select()
    .where({ phoneNumber })
    .first();
}

export function setSmsPin({ phoneNumber, smsPin }) {
  return table()
    .where({ phoneNumber })
    .update({ smsPin });
}
