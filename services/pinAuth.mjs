import template from 'lodash/template';
import { getCustomer, setSmsPin } from '../db/repositories/customer';
import { NotFoundError } from '../helpers/error';
import sendSms from './sms';
import config from '../config';

const pinTemplate = template(config.messages.smsPin);

export async function initPinAuth(phoneNumber) {
  await getCustomer({ phoneNumber });
  const pin = 1000 + Math.floor(Math.random() * 8999);
  await setSmsPin({
    phoneNumber,
    smsPin: pin.toString(),
  });

  await sendSms({
    phoneNumber,
    message: pinTemplate({ pin }),
  });
}

export async function performPinAuth({ phoneNumber, pin }) {
  const customer = await getCustomer({ phoneNumber });
  if (!customer || customer.smsPin !== pin) {
    throw new NotFoundError();
  }

  await setSmsPin({
    phoneNumber,
    smsPin: '',
  });
}
