exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();

    table.string("username", 50).notNullable().unique();
    table.string("email", 100).notNullable().unique();

    table.string("password_hash", 255).notNullable();

    table.boolean("is_active").notNullable();

    table.dateTime("created_at").notNullable();
  }).charset("utf8mb4").collate("utf8mb4_unicode_ci");
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
