import { PromptInput } from "@/components/client/PromptInput";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <h2 className="text-7xl font-bold">Build Your Website with AI</h2>
      <h3 className="text-lg text-gray-500">Just describe what you want, and watch your website come to life. No coding required.</h3>
      <PromptInput/>
    </div>
  )
}

export default HomePage;