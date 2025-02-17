"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { api } from "@/trpc/react"
import { PlusCircle } from "lucide-react"

export function AddCardDialog() {
    const [open, setOpen] = useState(false)
    const [cardNumber, setCardNumber] = useState("")
    const utils = api.useUtils()

    const addCardMutation = api.nfc.addCard.useMutation({
        onSuccess: () => {
            toast.success("Card added successfully")
            setOpen(false)
            setCardNumber("")
            // Invalidate the cache to trigger a refetch
            void utils.nfc.getUserCard.invalidate()
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!cardNumber) return
        addCardMutation.mutate({ cardNumber });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Card
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Card</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="XXXX XXXX XXXX XXXX"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" >
                            Add Card
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
