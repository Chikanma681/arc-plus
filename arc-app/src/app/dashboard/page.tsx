"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@clerk/nextjs"
import { OverviewTab } from "./_components/overview-tab"
import { CardsTab } from "./_components/cards-tab"
import { WalletTab } from "./_components/wallet-tab"

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-center">
        <div className="w-3/4">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Hi, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
            </h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <div className="flex space-y-12 py-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="cards">NFC Cards</TabsTrigger>
                <TabsTrigger value="wallet">Digital Wallet</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview" className="space-y-4">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="cards" className="space-y-4">
              <CardsTab />
            </TabsContent>
            <TabsContent value="wallet" className="space-y-4">
              <WalletTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}