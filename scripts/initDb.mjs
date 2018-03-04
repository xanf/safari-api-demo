import db from '../db';

async function seed() {
  await db.schema.createTable('cardLevels', t => {
    t.increments().primary();
    t.string('name').unique();
    t.boolean('disabled');
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
    t.date('birthDate');
    t.integer('points');
    t.text('notes');
    t.string('fitnessCardNumber');
    t.string('smsPin');
  });

  await db.schema.createTable('users', t => {
    t.increments().primary();
    t.string('recoveryToken');
    t.string('firstName').notNullable();
    t.string('lastName').notNullable();
    t.string('patronimic');
    t.string('phoneNumber').notNullable();
    t.string('password');
    t.string('role');
    t.boolean('disabled');
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

  await db.schema.createTable('logs', t => {
    t.increments().primary();
    t.string('entityType').notNullable();
    t.integer('entityId').notNullable();
    t.string('operation').notNullable();
    t.text('data');
    t.integer('userId').notNullable();
    t.foreign('userId').references('users.id');
  });

  await db.schema.createTable('sessions', t => {
    t.increments().primary();
    t.integer('userId').notNullable();
    t.foreign('userId').references('users.id');
  });

  await db.schema.createTable('pushTokens', t => {
    t.increments().primary();

    t.integer('userId').notNullable();
    t.foreign('userId').references('users.id');

    t.string('platform').notNullable();
    t.string('token').notNullable();
  });

  await db.destroy();
}

seed();
