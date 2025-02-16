"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Wallet, ContactIcon } from "lucide-react"


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

  
export function OverviewTab() {
  return (
    <div className="flex flex-col gap-8 w-3/4 ">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$245.00</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
          <ContactIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
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
    </div>

  )
} 