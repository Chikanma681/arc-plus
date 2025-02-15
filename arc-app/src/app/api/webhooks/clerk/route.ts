import { Webhook } from "svix";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

import type { WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST (
  request: NextRequest,
) {

  console.log("Webhook received");
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
    throw new Error("Please add a web hook secret");
}

const svix_id = request.headers.get("svix-id") as string;
const svix_timestamp = request.headers.get("svix-timestamp") as string;
const svix_signature = request.headers.get("svix-signature") as string;

if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ Error: "Missing headers" }, { status: 400 });
}

const body = await request.text();

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ Error: "Invalid signature" }, { status: 400 });
  }

const eventType = evt.type;

switch (eventType) {
    case "user.created": 
        await db.insert(users).values({
                userId: evt.data.id, 
                email: evt.data.email_addresses[0]!.email_address,
        }).execute();
        break;
    default: {
        console.error(`The event type: ${eventType} is not configured`);
    }
}

  return NextResponse.json({ received: true });
}