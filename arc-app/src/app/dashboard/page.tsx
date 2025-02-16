"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@clerk/nextjs"
import { OverviewTab } from "./_components/overview-tab"
import { CardsTab } from "./_components/cards-tab"
import { WalletTab } from "./_components/wallet-tab"

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <div className="flex-1 justify-center items-center space-y-4 p-4 pt-24 md:p-8 md:pt-24">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Hi, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
        </h2>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4 flex-1 justify-center items-center">
        <TabsList>
          <TabsTrigger value="overview" className="">Overview</TabsTrigger>
          <TabsTrigger value="cards">NFC Cards</TabsTrigger>
          <TabsTrigger value="wallet">Digital Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="cards">
          <CardsTab />
        </TabsContent>

        <TabsContent value="wallet">
          <WalletTab />
        </TabsContent>


      </Tabs>
    </div>
  )
}