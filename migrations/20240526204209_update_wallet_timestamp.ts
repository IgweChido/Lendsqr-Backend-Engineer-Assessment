exports.up = function (knex) {
  return knex.schema
    .alterTable("wallet", function (table) {
      table.dropColumn("created_at");
      table.dropColumn("updated_at");
    })
    .then(() => {
      return knex.schema.alterTable("wallet", function (table) {
        table.timestamps(true, true);
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable("wallet", function (table) {
      table.dropColumn("created_at");
      table.dropColumn("updated_at");
    })
    .then(() => {
      return knex.schema.alterTable("wallet", function (table) {
        table.timestamp("created_at");
        table.timestamp("updated_at");
      });
    });
};
