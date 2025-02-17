import { Loader2 } from "lucide-react"

export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{text}</span>
    </div>
  )
}
