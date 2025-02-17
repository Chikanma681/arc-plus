"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AddCardDialog } from "./add-card-dialog";
import { Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function CardsTab() {
    const { data: card, isLoading } = api.nfc.getUserCard.useQuery(undefined, {
        refetchOnMount: true,
        refetchOnWindowFocus: true
    });
    const utils = api.useUtils();
    
    const deleteCardMutation = api.nfc.deleteCard.useMutation({
        onSuccess: () => {
            toast.success("Card deleted");
            void utils.nfc.getUserCard.invalidate();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Physical NFC Card</CardTitle>
                        <CardDescription>Your registered transit card</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoadingSpinner />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {card ? (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Physical NFC Card</CardTitle>
                                <CardDescription>Your registered transit card</CardDescription>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => deleteCardMutation.mutate()}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Card Number</p>
                            <p className="font-medium">{card.cardNumber}</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <AddCardDialog />
            )}
        </div>
    );
}
