"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, Loader2 } from 'lucide-react'
import { api } from '@/trpc/react'
import { toast } from 'sonner'

export function QRCodeButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { data: card } = api.nfc.getUserCard.useQuery()

  const handleDownload = async () => {
    if (!card) {
      toast.error("Please add a card first")
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/passes', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to generate QR code')
      }

      const data = await response.json()
      
      // Create link element to trigger download
      const link = document.createElement('a')
      link.href = data.qrUrl
      link.download = data.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('QR code downloaded successfully!')
    } catch (err) {
      const errorMessage = 'Failed to generate QR code. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={handleDownload}
        disabled={loading || !card}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating QR Code...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </>
        )}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
