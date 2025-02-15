"use client"

import { SiteHeader } from "./_components/site-header"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Bus, CreditCard, Smartphone, Clock } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col space-y-12 bg-black text-white">
      <SiteHeader />
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center justify-center space-y-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container flex flex-col items-center justify-center gap-6 text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]"
            >
              Seamless Bus Transit
              <br />
              for Edmontonians
            </motion.h1>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-[750px] text-center text-lg text-gray-400 sm:text-xl"
            >
              Experience hassle-free public transportation with instant payments
              and smart features designed for modern commuters.
            </motion.span>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4"
            >
              <Button size="lg" className="h-12 px-8 bg-white text-black hover:bg-gray-200">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 bg-black text-white hover:bg-white/10">
                Learn More
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative w-full max-w-3xl mt-8"
          >
            <Image
              src="/placeholder.svg?height=600&width=800"
              width={800}
              height={600}
              alt="ArcPlus App Interface"
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="w-full space-y-12 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
          >
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Why Choose ArcPlus?
            </h2>
            <p className="max-w-[85%] leading-normal text-gray-400 sm:text-lg sm:leading-7">
              Modern solutions for a better transit experience
            </p>
          </motion.div>
          <div className="container mx-auto grid gap-8 sm:max-w-3xl sm:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-lg border border-gray-800 bg-black p-2"
              >
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <feature.icon className="h-12 w-12 text-white" />
                  <div className="space-y-2">
                    <h3 className="font-bold text-white">{feature.name}</h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
          >
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Ready to Transform Your Commute?
            </h2>
            <p className="max-w-[85%] leading-normal text-gray-400 sm:text-lg sm:leading-7">
              Join thousands of Edmonton residents enjoying stress-free public transit.
            </p>
            <Button size="lg" className="h-12 px-8 mt-8 bg-white text-black hover:bg-gray-200">
              Get Started Now
            </Button>
          </motion.div>
        </section>
      </main>
    </div>
  )
}

const features = [
  {
    name: "Instant Payments",
    description: "Pay for your rides quickly and securely using your smartphone.",
    icon: CreditCard,
  },
  {
    name: "Real-Time Updates",
    description: "Know exactly when your bus will arrive with live tracking.",
    icon: Smartphone,
  },
  {
    name: "24/7 Service",
    description: "Access transit information and support whenever you need it.",
    icon: Clock,
  },
  {
    name: "City Coverage",
    description: "Travel seamlessly across Edmonton with comprehensive coverage.",
    icon: Bus,
  },
] as const

