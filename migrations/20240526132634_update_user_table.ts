exports.up = function (knex) {
  return knex.schema.alterTable("users", function (table) {
    table.string("password").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", function (table) {
    table.integer("password").alter();
  });
};
