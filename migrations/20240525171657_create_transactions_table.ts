exports.up = function (knex) {
  return knex.schema.createTable("transactions", function (table) {
    table.increments();
    table.string("description");
    table.string("type");
    table.string("status");
    table.integer("amount");

    table.integer("transferred_to").unsigned().notNullable();
    table
      .foreign("transferred_to")
      .references("id")
      .inTable("wallet")
      .onDelete("CASCADE");

    table.integer("wallet_id").unsigned().notNullable();
    table
      .foreign("wallet_id")
      .references("id")
      .inTable("wallet")
      .onDelete("CASCADE");
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("transactions");
};
