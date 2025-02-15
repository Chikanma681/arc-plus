"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function WalletTab() {
  const [loading, setLoading] = useState(false)

  const handleAddFunds = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 5000 }), 
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      const { error } = await stripe!.redirectToCheckout({
        sessionId,
      })

      if (error) {
        console.error('Stripe error:', error)
      }
    } catch (err) {
      console.error('Payment error:', err)
    } finally {
      setLoading(false)
    }
  }

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
          <Button onClick={handleAddFunds} disabled={loading}>
            {loading ? "Processing..." : "Add Funds"}
          </Button>
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