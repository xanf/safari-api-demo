import bcrypt from 'bcrypt';
import db from '../db';

async function seed() {
  await db('cardLevels').insert([
    {
      id: 1,
      name: 'Silver',
      description: 'Silver card description',
      minPoints: 1,
    },
    {
      id: 2,
      name: 'Gold',
      description: 'Gold card description',
      minPoints: 100,
    },
    {
      id: 3,
      name: 'VIP',
      description: 'VIP card',
      minPoints: null,
    },
  ]);

  await db('cards').insert([
    { id: 1, code: 'foo', cardLevelId: 1 },
    { id: 2, code: 'bar', cardLevelId: 1 },
    { id: 3, code: 'baz', cardLevelId: 2 },
  ]);

  await db('customers').insert([
    {
      id: 1,
      phoneNumber: '+380504020799',
      firstName: 'Illya',
      lastName: 'Klymov',
      points: 1000,
      notes: 'Very awesome client',
      fitnessCardNumber: '10465321',
      cardId: 3,
    },
  ]);

  await db('users').insert([
    {
      id: 1,
      email: 'admin@demo.me',
      firstName: 'Admin',
      lastName: 'admin',
      phoneNumber: '1',
      password: bcrypt.hashSync('test', 10),
      role: 'admin',
    },
    {
      id: 2,
      email: 'operator@demo.me',
      firstName: 'Operator',
      lastName: 'Operator',
      phoneNumber: '2',
      password: bcrypt.hashSync('test', 10),
      role: 'operator',
    },
    {
      id: 3,
      email: 'manager@demo.me',
      firstName: 'Manager',
      lastName: 'Manager',
      phoneNumber: '3',
      password: bcrypt.hashSync('test', 10),
      role: 'manager',
    },
  ]);

  await db.destroy();
}

seed();
