import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Match Next.js's own precedence: .env first, then .env.local overrides it.
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

// `migrate`/`db push`/introspection use DIRECT_URL (Neon's non-pooled
// connection) — the pooled connection can't hold the advisory locks these
// commands need. Runtime app queries go through the Neon serverless driver
// adapter instead (see lib/prisma.ts), which uses DATABASE_URL (pooled).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_URL,
  },
});
