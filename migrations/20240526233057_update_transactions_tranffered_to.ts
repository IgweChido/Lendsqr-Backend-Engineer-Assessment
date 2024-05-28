exports.up = function (knex) {
  return knex.schema.alterTable("transactions", function (table) {
    table.integer("transferred_to").unsigned().nullable().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("transactions", function (table) {
    table.integer("transferred_to").unsigned().notNullable().alter();
  });
};
