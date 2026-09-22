import { PrismaClient } from "@prisma/client";

/**
 * Cliente Prisma Singleton com cache global para Next.js (evita esgotamento de conexões no hot reload).
 * Documentação: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Verifica se a conexão com o PostgreSQL está ativa.
 * Retorna true se conectado com sucesso, ou false caso o container/banco ainda não esteja no ar.
 */
export async function checkDatabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { connected: false, error: errorMsg };
  }
}
