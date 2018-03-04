import db from '../db';

async function initDb() {
  await db.schema.createTable('cardLevels', t => {
    t.increments().primary();
    t.string('name').unique();
    t.text('description');
    t.integer('minPoints');
  });

  await db.schema.createTable('cards', t => {
    t.increments().primary();
    t.string('code').unique();
    t.integer('cardLevelId').notNullable();
    t.foreign('cardLevelId').references('cardLevels.id');
  });

  await db.schema.createTable('customers', t => {
    t.increments().primary();
    t
      .string('phoneNumber')
      .notNullable()
      .unique();
    t.string('firstName').notNullable();
    t.string('lastName').notNullable();
    t.string('patronimic');

    t.integer('cardId');
    t.foreign('cardId').references('cards.id');

    t.date('birthDate');
    t.integer('points');
    t.text('notes');
    t.string('fitnessCardNumber');
    t.string('smsPin');
  });

  await db.schema.createTable('users', t => {
    t.increments().primary();
    t
      .string('email')
      .notNullable()
      .unique();
    t.string('recoveryToken');
    t.string('firstName').notNullable();
    t.string('lastName').notNullable();
    t.string('patronimic');
    t.string('phoneNumber').notNullable();
    t.string('password');
    t.string('role');
  });

  await db.schema.createTable('transactions', t => {
    t.increments().primary();

    t.integer('customerId');
    t.foreign('customerId').references('customers.id');

    t.date('created_at').notNullable();
    t.string('comment').notNullable();

    t.integer('userId').notNullable();
    t.foreign('userId').references('users.id');
  });

  await db.destroy();
}

initDb();
