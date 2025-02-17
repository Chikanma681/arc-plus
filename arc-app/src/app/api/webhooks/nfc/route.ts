import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { nfcCards, transactions, wallet, users } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";

const FARE_AMOUNT = 3.75;

export async function POST(request: NextRequest) {
  try {
    const { card_no } = await request.json();

    if (!card_no) {
      return NextResponse.json(
        { success: false, message: "Card number is required" },
        { status: 400 }
      );
    }

    // Get the card details using Drizzle query builder
    const card = await db.query.nfcCards.findFirst({
      where: eq(nfcCards.cardNumber, card_no),
    });

    if (!card) {
      return NextResponse.json(
        { success: false, message: "Card not found" },
        { status: 404 }
      );
    }

    // Get the user details
    const user = await db.query.users.findFirst({
      where: eq(users.id, card.userId!),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    try {
      // Execute transaction for atomic operations
      await db.transaction(async (tx) => {
        // Get current wallet balance
        const userWallet = await db.query.wallet.findFirst({
          where: eq(wallet.userId, user.id),
        });

        if (!userWallet) {
          throw new Error("Wallet not found");
        }

        const currentBalance = parseFloat(userWallet.balance);
        if (currentBalance < FARE_AMOUNT) {
          throw new Error("Insufficient balance");
        }

        // Update wallet balance
        await tx
          .update(wallet)
          .set({
            balance: sql`${wallet.balance} - ${FARE_AMOUNT}`,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(wallet.userId, user.id));

        // Record transaction
        //@ts-ignore
        await tx.insert(transactions).values({
          userId: user.id!,
          cardId: card.id!,
          amount: -FARE_AMOUNT!,
          status: "debited",
        });
      });

      return NextResponse.json({
        success: true,
        message: "Fare deducted successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Insufficient balance") {
          return NextResponse.json(
            { success: false, message: "Insufficient balance" },
            { status: 400 }
          );
        }
        if (error.message === "Wallet not found") {
          return NextResponse.json(
            { success: false, message: "Wallet not found" },
            { status: 404 }
          );
        }
      }
      throw error;
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}