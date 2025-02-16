"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Wallet, ContactIcon } from "lucide-react"
import { api } from "@/trpc/react"
import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"

export function OverviewTab() {
  const { data: walletData } = api.wallet.getWalletBalance.useQuery()
  const { data: cardsData } = api.wallet.getActiveCards.useQuery()
  const { data: recentTransactions } = api.wallet.getRecentTransactions.useQuery()

  return (
    <div className="flex flex-col gap-8 w-3/4 ">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(walletData?.balance ?? 0)}</div>
          {/* Removed percentage change since we don't track historical balances yet */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
          <ContactIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cardsData?.length ?? 0}</div>
          <p className="text-xs text-muted-foreground">
            Physical & Digital cards
          </p>
        </CardContent>
      </Card>
    </div>
    <Card className="space-y-8">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your recent transit activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions?.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">{transaction.status}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(transaction.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <p className={`text-sm font-medium ${
                transaction.amount < 0 ? 'text-red-500' : 'text-green-500'
              }`}>
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    </div>
  )
}