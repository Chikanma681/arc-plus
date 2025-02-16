"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddFundsDialog } from "./add-funds-dialog"

export function WalletTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Digital Wallet</CardTitle>
        <CardDescription>Manage your Apple Wallet and payment methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Current Balance</p>
            <p className="text-2xl font-bold">$245.00</p>
          </div>
          <AddFundsDialog />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Apple Wallet</p>
            <Button variant="outline">
              Add to Apple Wallet
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Auto-reload</p>
            <Button variant="outline">Set up</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 