import rc from 'rc';

const APP_NAME = 'SAFARI';

export default rc(APP_NAME, {
  port: 3000,
  secret: 'supersecret',
  customerTimeout: 3000000,
  twilio: {
    accountSid: 'AC5eb47ab59b156d2a529812b8b2cd35e2',
    authToken: '',
    phoneNumber: '+16123516315',
  },
  db: {
    client: 'sqlite3',
    connection: {
      filename: './test.sqlite',
    },
  },
  messages: {
    smsPin: 'Ваш PIN <%= pin %>',
  },
});
