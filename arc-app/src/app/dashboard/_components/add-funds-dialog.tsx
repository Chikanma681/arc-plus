import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loadStripe } from "@stripe/stripe-js"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { toast } from "sonner"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const appearance = {
  theme: 'flat',
  variables: {
    colorPrimary: '#000000',
  },
}

export function AddFundsDialog() {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers and decimals
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value)
    }
  }

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) return
    try {
      setLoading(true)
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
        }),
      })
      const data = await response.json()
      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        toast.success("Payment form ready")
      } else {
        throw new Error("No client secret returned")
      }
    } catch (error) {
      console.error("Error adding funds:", error)
      toast.error(`Payment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Reset state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setClientSecret(null)
      setAmount("")
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Add Funds</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-l max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {clientSecret ? "Complete Your Payment" : "Add Funds to Wallet"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          {!clientSecret ? (
            <>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <Input
                  type="text"
                  placeholder="0.00"
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-8"
                />
              </div>
              <Button onClick={handleAddFunds} disabled={loading || !amount}>
                {loading ? "Processing..." : "Continue to Payment"}
              </Button>
            </>
          ) : (
            <div className="h-[600px]">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
              >
                <EmbeddedCheckout className="h-full" />
              </EmbeddedCheckoutProvider>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}