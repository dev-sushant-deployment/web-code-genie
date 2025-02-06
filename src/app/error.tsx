"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RotateCcw, Home, Sparkles } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="container flex flex-col items-center justify-center gap-8 px-4 py-20 text-center">
      <Sparkles className="h-24 w-24 text-destructive opacity-50" />
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Something Went Wrong</h1>
      <p className="text-xl text-muted-foreground">
        Our AI genie encountered an unexpected error. Don&apos;t worry, we&apos;re on it!
      </p>
      {error.digest && <p className="text-sm text-muted-foreground">Error ID: {error.digest}</p>}
      <Button onClick={() => reset()} size="lg" variant="outline" className="gap-2">
        <RotateCcw className="h-4 w-4" />
        Try Again
      </Button>
      <Button asChild size="lg" className="gap-2">
        <Link href="/">
          <Home className="h-4 w-4" />
          Return Home
        </Link>
      </Button>
    </main>
  )
}

