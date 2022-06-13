module.exports = {
  name: "default",
  type: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ["dist/entities/*.js"],
  migrations: ["dist/db/migrations/*.js"],
};
