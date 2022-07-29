exports.up = function (knex) {
  return knex.schema
    .createTable('users', users => {
      users.increments();
      users.string('username', 255).notNullable().unique();
      users.string('password', 255).notNullable();
    })
    .createTable('jokes', tbl => {
      tbl.increments();
      tbl.varchar('joke', 255).unique().notNullable();
    })
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('jokes')
};
