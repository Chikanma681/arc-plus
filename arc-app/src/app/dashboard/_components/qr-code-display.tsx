"use client"

import { useState, useEffect } from 'react'
import { Share2, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import Image from 'next/image'

export function QRCodeDisplay() {
  const [qrImage, setQrImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { data: card } = api.nfc.getUserCard.useQuery()

  useEffect(() => {
    if (card) {
      fetchQRData()
    } else {
      setLoading(false)
    }
  }, [card])

  const fetchQRData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/passes', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to get card data')
      }

      const data = await response.json()
      setQrImage(data.qrUrl)
    } catch (err) {
      const errorMessage = 'Failed to load card data. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      if (!qrImage) return

      // Convert base64 to blob
      const response = await fetch(qrImage)
      const blob = await response.blob()
      const file = new File([blob], 'arc-plus-card.png', { type: 'image/png' })

      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: 'Arc Plus Transit Card',
          text: 'My Arc Plus Transit Card QR Code',
          files: [file]
        })
        toast.success('QR code shared successfully!')
      } else {
        // Fallback for browsers that don't support sharing files
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'arc-plus-card.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.success('QR code downloaded successfully!')
      }
    } catch (err) {
      console.error('Error sharing:', err)
      toast.error('Failed to share QR code. Please try again.')
    }
  }

  if (!card) {
    return (
      <Alert>
        <AlertDescription>Please add a card first to view its QR code.</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {qrImage ? (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={qrImage} 
              alt="Card QR Code"
              className="w-full h-auto"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleShare}
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share QR Code
            </Button>
            
            <Button 
              onClick={handleShare}
              variant="outline"
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      ) : null}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
