import { PrismaClient } from '@prisma/client';
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient;
}
if (!global.__prisma) {
  global.__prisma = new PrismaClient();
}
global.__prisma.$connect();
export const prisma = global.__prisma;

// import { PrismaClient } from "@prisma/client";

// declare global {
//   var prisma: PrismaClient;
// }

// const prisma: PrismaClient = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
// }

// export default prisma;
