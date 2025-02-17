import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { nfcCards, users } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const nfcRouter = createTRPCRouter({
    addCard: protectedProcedure
        .input(z.object({
            cardNumber: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.query.users.findFirst({
                where: eq(users.userId, ctx.userId),
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            const card = await ctx.db.insert(nfcCards).values({
                userId: user.id,
                cardNumber: input.cardNumber,
            }).execute();

            return card;
        }),

    getUserCard: protectedProcedure
        .query(async ({ ctx }) => {
            console.log("User ID:", ctx.userId);
            // if (!ctx.userId) {
            //     throw new TRPCError({
            //         code: "UNAUTHORIZED",
            //         message: "Invalid user session",
            //     });
            // }


            const user = await ctx.db.query.users.findFirst({
                where: eq(users.userId, ctx.userId),
            });
            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            const card = await ctx.db.query.nfcCards.findFirst({
                where: eq(nfcCards.userId, user.id),
            });

      

            if (!card) {
                return null;
            }

            return card;
        }),

    deleteCard: protectedProcedure
        .mutation(async ({ ctx }) => {
            const user = await ctx.db.query.users.findFirst({
                where: eq(users.userId, ctx.userId),
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            const card = await ctx.db.query.nfcCards.findFirst({
                where: eq(nfcCards.userId, user.id),
            });

            if (!card) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No NFC card found to delete",
                });
            }

            await ctx.db.delete(nfcCards).where(eq(nfcCards.id, card.id)).execute();

            return { message: "Card deleted successfully" };
        }),
});
