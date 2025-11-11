import { PrismaClient } from "./generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Helper function to disconnect on app termination
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

// Helper function to connect (useful for health checks)
export async function connectPrisma() {
  await prisma.$connect();
}

// Export the PrismaClient constructor for advanced use cases
export { PrismaClient } from "./generated/prisma/client";

// Export types for convenience
export type {
  User,
  Session,
  Account,
  Verification,
  Conversations,
} from "./generated/prisma/client";
