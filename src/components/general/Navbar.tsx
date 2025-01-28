import Link from "next/link"
import { Button } from "../ui/button"
import { Sparkles } from "lucide-react"
import { Auth } from "../client/Auth"

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 w-full p-4 flex justify-between items-center px-10 text-lg">
      <Link
        href="/"
        className="flex items-center gap-1"
      >
        <Sparkles/>
        <h1>WebCode Genie</h1>
      </Link>
      <ul className="flex items-center justify-center gap-5">
        <li>
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
        </li>
        <Auth/>
      </ul>
    </nav>
  )
}