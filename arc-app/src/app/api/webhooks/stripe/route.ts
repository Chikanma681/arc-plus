import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { eq, sql, and } from "drizzle-orm";
import { db } from "@/server/db";
import { users, transactions, wallet } from "@/server/db/schema";

export async function POST(request: NextRequest) {
    try {
        const payload = await request.text();
        const sig = request.headers.get("Stripe-signature");
        let event;
        
        event = stripe.webhooks.constructEvent(
            payload,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET! 
        );

        switch (event.type) {
            case "checkout.session.completed": 
            console.log("event", event.type);
                const session = event.data.object;
                const amount = session.amount_total as number;
                const email = session.customer_details?.email as string;

                console.log("session", session);
                console.log("Payment completed for", email, "Amount:", amount);

                const user = await db.query.users.findFirst({
                    where: eq(users.email!, email)
                });

                if (!user) {
                    console.error("User not found");
                    return NextResponse.json({ error: "User not found" }, { status: 404 });
                }

                console.log()
                const walletRecord = await db.query.wallet.findFirst({
                    where: eq(wallet.userId!, user.id)
                });

                if (!walletRecord) {
                    console.error("Wallet not found");
                    return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
                }

                await db.transaction(async (tx) => {
                    await tx.update(wallet)
                      .set({ 
                        balance: sql`${wallet.balance} + ${amount/100}`,
                        updatedAt: new Date() 
                      })
                      .where(eq(wallet.userId, user.id));
                  
                    await tx.insert(transactions)
                      .values({
                        userId: user.id,
                        amount: (amount/100).toString(),
                        status: "completed",
                        stripePaymentId: session.payment_intent as string
                      });
                  });
                return NextResponse.json({ status: "success", event: event.type });
            default: {
                console.error(`Unhandled event type: ${event.type}`);
                return NextResponse.json({ status: "success", event: event.type });
            }
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}