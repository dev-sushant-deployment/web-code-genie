import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Sparkles } from "lucide-react"
import { Suspense } from "react"

const NotFound = () => {
  return (
    <Suspense>
      <main className="container flex flex-col items-center justify-center gap-8 px-4 py-20 text-center">
        <Sparkles className="h-24 w-24 text-primary opacity-50" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Not Found</h1>
        <p className="text-xl text-muted-foreground">
          Even Our Genie Couldn&apos;t Find This Page
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </main>
    </Suspense>
  )
}

export default NotFound