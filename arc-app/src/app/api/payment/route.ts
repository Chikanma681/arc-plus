import { NextResponse } from "next/server"
import Stripe from "stripe"
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    const { amount } = await req.json();


    const email_address = await db.query.users.findFirst({
        where: eq(users.userId!, userId!)
    });

    console.log(email_address)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "ArcPlus Transit Funds",
            },
            unit_amount: amount*100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      ui_mode: "embedded",
      customer_email: email_address?.email!,
      // customer_email: email_address!,
      return_url: `http://localhost:3000/dashboard?success=true`,
    })

    console.log("Created Stripe session:", session.id)

    return NextResponse.json({clientSecret: session.client_secret,})
  } catch (err) {
    console.error("Stripe error:", err)
    return NextResponse.json(
      { error: "Error creating payment session" },
      { status: 500 }
    )
  }
} 