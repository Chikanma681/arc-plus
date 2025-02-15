"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const transactions = [
  {
    description: "Bus Ride - Route 4",
    date: "Mar 15, 2024 at 9:30 AM",
    amount: "-$3.50"
  },
  {
    description: "Added Funds",
    date: "Mar 14, 2024 at 2:15 PM",
    amount: "+$50.00"
  },
  {
    description: "Bus Ride - Route 7",
    date: "Mar 14, 2024 at 8:45 AM",
    amount: "-$3.50"
  },
] as const

export function TransactionsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your recent transit activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
              <p className={`text-sm font-medium ${
                transaction.amount.startsWith('-') ? 'text-red-500' : 'text-green-500'
              }`}>
                {transaction.amount}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 