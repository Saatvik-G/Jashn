import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

/**
 * On Vercel Serverless, the lambda filesystem is read-only except /tmp.
 * To ensure SQLite works out-of-the-box on Vercel without requiring paid databases:
 */
function getDatabaseUrl(): string {
  if (
    process.env.VERCEL &&
    (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:"))
  ) {
    const tmpDbPath = "/tmp/dev.db";
    const starterDbPath = path.join(process.cwd(), "prisma", "starter.db");

    // Copy starter database with demo events to /tmp if not already present
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(starterDbPath)) {
      try {
        fs.copyFileSync(starterDbPath, tmpDbPath);
        console.log("Initialized writable SQLite database in /tmp from starter.db");
      } catch (err) {
        console.error("Failed to copy starter.db to /tmp:", err);
      }
    }

    return `file:${tmpDbPath}`;
  }

  return process.env.DATABASE_URL || "file:./dev.db";
}

const dbUrl = getDatabaseUrl();
if (process.env.VERCEL) {
  process.env.DATABASE_URL = dbUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
