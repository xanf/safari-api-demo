import { LogicError, NotFoundError } from '../helpers/error';
import { getCustomer, setCardId } from '../db/repositories/customer';
import { getCard } from '../db/repositories/card';

export async function detachCard({ customerId }) {
  const customer = await getCustomer({ id: customerId });
  if (!customer) {
    throw new NotFoundError();
  }

  if (!customer.cardId) {
    throw new LogicError('No card to detach');
  }

  return setCardId({ customerId, cardId: null });
}

export async function attachCard({ customerId, code }) {
  const customer = await getCustomer({ id: customerId });
  const card = await getCard({ code });

  if (!customer || !card) {
    throw new NotFoundError();
  }

  if (customer.cardId) {
    throw new LogicError('Customer already has card');
  }

  return setCardId({ customerId, cardId: card.id });
}
