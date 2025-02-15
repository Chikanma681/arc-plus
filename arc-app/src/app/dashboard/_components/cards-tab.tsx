"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, PlusCircle } from "lucide-react"

export function CardsTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Physical NFC Card</CardTitle>
          <CardDescription>Your registered transit card</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <CreditCard className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium">Card ending in •••• 4589</p>
              <p className="text-xs text-muted-foreground">Added on Mar 12, 2024</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">Manage Card</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Card</CardTitle>
          <CardDescription>Register a new NFC transit card</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 