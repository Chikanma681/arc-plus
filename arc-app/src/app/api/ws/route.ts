import { NextResponse } from 'next/server'
import { db } from "@/server/db"
import { eq } from "drizzle-orm"
import { wallet, transactions, users } from "@/server/db/schema"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return new NextResponse('No userId provided', { status: 400 })
  }

  try {
    console.log('Fetching data for user:', userId)

    // Find user by id
    const user = await db.query.users.findFirst({
      where: eq(users.userId, userId),
    })

    if (!user) {
      console.log('User not found:', userId)
      return NextResponse.json(
        { type: 'error', message: 'User not found' },
        { status: 404 }
      )
    }

    console.log('Found user:', user.id)

    // Get wallet balance
    const userWallet = await db.query.wallet.findFirst({
      where: eq(wallet.userId, user.id),
    })

    console.log('User wallet:', userWallet)

    // Get recent transactions
    const recentTransactions = await db.query.transactions.findMany({
      where: eq(transactions.userId, user.id),
      orderBy: (transactions, { desc }) => [desc(transactions.createdAt)],
      limit: 5,
    })

    console.log('Recent transactions:', recentTransactions)

    return NextResponse.json({
      type: 'update',
      data: {
        balance: userWallet?.balance ?? 0,
        transactions: recentTransactions,
      }
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json(
      { 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}
