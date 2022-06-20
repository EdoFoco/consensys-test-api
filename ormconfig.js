module.exports = {
  name: "default",
  type: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  migrationsRun: true,
  dropSchema: false,
  entities: ["src/entities/*.ts", "dist/entities/*.js"],
  migrations: ["src/db/migrations/*.ts", "dist/migrations/*.js"],
  seeds: ["src/db/seeding/seeder.ts"],
};
