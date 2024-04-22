// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient

const debug = false

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!(global as any).prisma) {
    ;(global as any).prisma = new PrismaClient({
      log: [
        {
          emit: "event",
          level: "query",
        },
        {
          emit: "stdout",
          level: "error",
        },
        {
          emit: "stdout",
          level: "info",
        },
        {
          emit: "stdout",
          level: "warn",
        },
      ],
    })
  }
  prisma = (global as any).prisma

  if (debug) {
    ;(prisma.$on as any)("query", (e: any) => {
      console.log(new Date().toISOString(), "------------")
      console.log("Query: " + e.query)
      console.log("Params: " + e.params)
      console.log("Duration: " + e.duration + "ms")
    })
  }
}

export default prisma
