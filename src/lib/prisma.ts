import { PrismaClient } from "@prisma/client";

let prismaClient: any;

try {
  prismaClient = new PrismaClient();
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

