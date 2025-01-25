import Link from "next/link"
import { Button } from "../ui/button"
import { Sparkles } from "lucide-react"

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 bg-black text-white w-full p-4 flex justify-between items-center px-10 text-lg">
      <div className="flex items-center gap-1">
        <Sparkles/>
        <h1>WebCode Genie</h1>
      </div>
      <ul className="flex items-center justify-center gap-5">
        <li>
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
        </li>
        <li>
          <Link href="/auth?login=true&signup=false">
            <Button variant="ghost">Login</Button>
          </Link>
        </li>
        <li>
          <Link href="/auth?login=false&signup=true">
            <Button variant="ghost">Signup</Button>
          </Link>
        </li>
      </ul>
    </nav>
  )
}