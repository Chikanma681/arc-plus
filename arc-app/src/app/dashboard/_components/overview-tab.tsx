"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/trpc/react"
import { ContactIcon, Wallet } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useEffect, useState } from "react"

export function OverviewTab() {
  const { data: walletData, isLoading: isWalletLoading } = api.wallet.getWalletBalance.useQuery()
  const { data: cardsData, isLoading: isCardsLoading } = api.wallet.getActiveCards.useQuery()
  const { data: recentTransactions, isLoading: isTransactionsLoading } = api.wallet.getRecentTransactions.useQuery()

  return (
    <div className="flex flex-col gap-8 w-3/4 ">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isWalletLoading ? (
              <LoadingSpinner text="" />
            ) : (
              formatCurrency(walletData?.balance ?? 0)
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
          <ContactIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isCardsLoading ? (
              <LoadingSpinner text="" />
            ) : (
              cardsData?.length ?? 0
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Physical & Digital cards
          </p>
        </CardContent>
      </Card>
    </div>
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>You made {recentTransactions?.length ?? 0} transactions this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isTransactionsLoading ? (
            <LoadingSpinner />
          ) : (
            recentTransactions?.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{transaction.status}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <p className={`text-sm font-medium ${
                  Number(transaction.amount) < 0 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {formatCurrency(Number(transaction.amount))}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
    </div>
  )
}