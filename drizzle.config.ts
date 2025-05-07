import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env.local",
});

export default defineConfig({
    out: "./drizzle",
    schema: "./db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_NEONDB_URL!,
    },
});
