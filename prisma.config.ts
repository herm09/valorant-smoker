import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Prisma CLI skips .env when a config file exists — load it manually.
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
