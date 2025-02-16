// import { headers } from "next/headers"
// import { NextResponse } from "next/server"
// import Stripe from "stripe"
// import { db } from "@/server/db"
// import { transactions, wallet } from "@/server/db/schema"
// import { eq } from "drizzle-orm"
// import { auth } from "@clerk/nextjs"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// export async function POST(req: Request) {
//   const body = await req.text()
//   const signature = headers().get("stripe-signature")!

//   let event: Stripe.Event

//   try {
//     event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
//   } catch (err) {
//     return NextResponse.json(
//       { error: `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}` },
//       { status: 400 }
//     )
//   }

//   const session = event.data.object as Stripe.Checkout.Session

//   if (event.type === "checkout.session.completed") {
//     try {
//       const { userId } = auth()
//       if (!userId) throw new Error("User not authenticated")

//       // Start a transaction
//       await db.transaction(async (tx) => {
//         // Update wallet balance
//         const [updatedWallet] = await tx
//           .insert(wallet)
//           .values({
//             userId,
//             balance: session.amount_total! / 100, // Convert cents to dollars
//           })
//           .onConflictDoUpdate({
//             target: wallet.userId,
//             set: {
//               balance: sql`${wallet.balance} + ${session.amount_total! / 100}`,
//               updatedAt: new Date(),
//             },
//           })
//           .returning()

//         // Record the transaction
//         await tx.insert(transactions).values({
//           userId,
//           amount: session.amount_total! / 100,
//           status: "completed",
//           stripePaymentId: session.payment_intent as string,
//         })
//       })

//       return NextResponse.json({ success: true })
//     } catch (err) {
//       console.error("Error processing webhook:", err)
//       return NextResponse.json(
//         { error: "Error processing webhook" },
//         { status: 500 }
//       )
//     }
//   }

//   return NextResponse.json({ received: true })
// }

// export const runtime = "nodejs"
