import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

export type TransactionClientLike = {
  user: {
    upsert(args: unknown): Promise<{ id: string }>;
  };
  order: {
    create(args: unknown): Promise<unknown>;
  };
};

export type PrismaClientLike = {
  serviceCategory: {
    count(): Promise<number>;
    createMany(args: unknown): Promise<unknown>;
    findMany(args: unknown): Promise<unknown[]>;
  };
  order: {
    findMany(args: unknown): Promise<unknown[]>;
    update(args: unknown): Promise<unknown>;
  };
  $transaction<T>(fn: (tx: TransactionClientLike) => Promise<T>): Promise<T>;
};

const globalForPrisma = globalThis as {
  prisma?: PrismaClientLike;
};

export async function getPrismaClient(): Promise<PrismaClientLike> {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  const prismaModule = (await import("@prisma/client")) as {
    PrismaClient?: new (options: unknown) => PrismaClientLike;
    default?: {
      PrismaClient?: new (options: unknown) => PrismaClientLike;
    };
  };
  const PrismaClient =
    prismaModule.PrismaClient ?? prismaModule.default?.PrismaClient;

  if (!PrismaClient) {
    throw new Error(
      "Prisma Client has not been generated. Run `npm run db:generate` after configuring DATABASE_URL.",
    );
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  const adapter = new PrismaPg(pool, {
    disposeExternalPool: true,
  });
  const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  }) as PrismaClientLike;

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
}
