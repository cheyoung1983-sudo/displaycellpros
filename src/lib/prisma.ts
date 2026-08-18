import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getAuroraPool } from "./db.ts";

let prismaClient: any;

try {
  const adapter = new PrismaPg(getAuroraPool());
  prismaClient = new PrismaClient({ adapter });
} catch {
  console.warn('[AI Studio] Database not connected — using Prisma mock');
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
