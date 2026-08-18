import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getDatabasePool, isDbConfigured } from "./serverDb";

let prismaClient: any;

try {
  if (!isDbConfigured()) throw new Error("Database not configured");
  const adapter = new PrismaPg(getDatabasePool());
  prismaClient = new PrismaClient({ adapter });
} catch {
  console.warn('[Prisma] Database not connected — using Prisma mock');
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({})
  };
  prismaClient = new Proxy({}, { get: () => noOp });
}

export const prisma = prismaClient;
export default prisma;
