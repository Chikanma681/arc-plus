import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { transactions, wallet, nfcCards, users } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const walletRouter = createTRPCRouter({
  getWalletBalance: protectedProcedure.query(async ({ ctx }) => {
    // First get the internal user ID
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.userId, ctx.userId),
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const userWallet = await ctx.db.query.wallet.findFirst({
      where: eq(wallet.userId, user.id),
    });

    return userWallet ?? { balance: 0 };
  }),

  getActiveCards: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.userId, ctx.userId),
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const cards = await ctx.db.query.nfcCards.findMany({
      where: eq(nfcCards.userId, user.id),
    });

    return cards;
  }),

  getRecentTransactions: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.userId, ctx.userId),
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const recentTransactions = await ctx.db.query.transactions.findMany({
      where: eq(transactions.userId, user.id),
      orderBy: [desc(transactions.createdAt)],
      limit: 5,
    });

    return recentTransactions;
  }),
});
