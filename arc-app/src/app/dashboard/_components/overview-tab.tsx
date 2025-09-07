"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"
import { api } from "@/trpc/react";

type Transaction = {
  id: string
  amount: number
  status: string
  createdAt: string
}

const POLL_INTERVAL = 5000 // 5 seconds

export function OverviewTab() {
  const { user } = useUser()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { data: activeCards } =  api.wallet.getActiveCards.useQuery();


  const activeCardCount = activeCards ? activeCards.length : 0;

  const fetchData = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/ws?userId=${user.id}`)
      const data = await response.json()

      if (data.type === 'error') {
        toast.error(`Error: ${data.message}`)
        return
      }

      if (data.type === 'update') {
        setBalance(data.data.balance)
        setTransactions(data.data.transactions)
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error instanceof Error ? error.message : 'Unknown error'}`)
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchData()

    // Set up polling
    const pollInterval = setInterval(fetchData, POLL_INTERVAL)

    // Cleanup
    return () => {
      clearInterval(pollInterval)
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Loading...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Cards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCardCount}</div>
            <p className="text-xs text-muted-foreground">
              Physical & Digital cards
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {transaction.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span className={transaction.amount > 0 ? "text-green-500" : "text-red-500"}>
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}