exports.up = function (knex) {
  return knex.schema.createTable("wallet", function (table) {
    table.increments();
    table.integer("balance").notNullable();

    table.integer("user_id").unsigned().notNullable();
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("wallet");
};
