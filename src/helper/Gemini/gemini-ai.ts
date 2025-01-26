import { GEMINI_STEPS_GENERATION_MODEL } from "@/constants"
import { GoogleGenerativeAI } from "@google/generative-ai"

const { GEMINI_STEPS_GENERATION_API_KEY } = process.env

if (!GEMINI_STEPS_GENERATION_API_KEY) {
  throw new Error('Missing Gemini API key')
}

const stepsGenerationGenAi = new GoogleGenerativeAI(GEMINI_STEPS_GENERATION_API_KEY)
export const stepsGenerationModel = stepsGenerationGenAi.getGenerativeModel({ model: GEMINI_STEPS_GENERATION_MODEL })