import "dotenv/config";
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
        url: process.env.NEONDB_URL!,
    },
});
