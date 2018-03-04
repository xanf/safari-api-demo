import Twilio from 'twilio';
import config from '../config';

const { accountSid, authToken, phoneNumber: fromPhone } = config.twilio;

const client = new Twilio(accountSid, authToken);

export default function sendSms({ phoneNumber, message }) {
  return client.messages.create({
    body: message,
    to: phoneNumber,
    from: fromPhone,
  });
}
