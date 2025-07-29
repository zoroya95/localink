import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    // Aucune configuration datasource nécessaire ici car gérée dans schema.prisma
    log: ['query', 'info', 'warn', 'error'] // Optionnel : pour le débogage
  })
}

declare global {
  var prismaGlobal: PrismaClient | undefined
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}