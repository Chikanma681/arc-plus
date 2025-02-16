import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()

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
      // success_url: `http://localhost:3000/dashboard?success=true`,
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