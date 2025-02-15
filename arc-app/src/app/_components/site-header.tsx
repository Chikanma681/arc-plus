"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Bus } from "lucide-react"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export function SiteHeader() {
  const pathname = usePathname()
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up"
  const dashboard = pathname === "/dashboard"
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60"
    >
      <div className="container mx-auto px-4 flex h-20 items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-white pl-4"
          >
            <Bus className="inline-block mr-2 h-8 w-8 text-white" />
            ArcPlus
          </motion.span>
        </Link>
        
        <div className="flex items-center space-x-4 pr-4">
          <SignedOut>
            {!isAuthPage && (
              <>
                <Button variant="outline" size="sm" asChild className="text-white border-white bg-black hover:text-gray-200">
                  <Link href="/sign-in">Log in</Link>
                </Button>
                <Button size="sm" className="bg-white hover:bg-gray-200 text-black" asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </SignedOut>
          <SignedIn>
          {!dashboard && (<Button size="sm" className="bg-white hover:bg-gray-200 text-black" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>)
          } 
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </motion.header>
  )
}