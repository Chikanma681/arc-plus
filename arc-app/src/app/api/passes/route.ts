import { NextResponse } from "next/server";
// @ts-ignore
import QRCode from "qrcode";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { users, nfcCards } from "@/server/db/schema";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data
    const user = await db.query.users.findFirst({
      where: eq(users.userId, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get card data
    const card = await db.query.nfcCards.findFirst({
      where: eq(nfcCards.userId, user.id),
    });

    if (!card) {
      return NextResponse.json({ error: "No card found" }, { status: 404 });
    }

    // Generate QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(card.cardNumber, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
    });

    return NextResponse.json({ 
      qrUrl: qrCodeDataUrl,
      fileName: `arc-plus-card-${card.cardNumber}.png`
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
