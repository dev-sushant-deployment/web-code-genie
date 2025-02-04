import { stepsGenerationModel } from "@/helper/Gemini/gemini-ai";
import { CODE_GENERATION_PROMPT, STEP_GENERATION_PROMPT } from "@/helper/Gemini/prompts";
import { NextRequest, NextResponse } from "next/server";
import { customError, generateResponse, writeResponse, headers } from "@/helper/next-stream";

export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get('prompt');
  try {
    if (!prompt) return customError({ message: 'Prompt is required to generate code', status: 400 });
    const setGenerationPrompt = STEP_GENERATION_PROMPT(prompt);
    const stepResponse = await stepsGenerationModel.generateContent(setGenerationPrompt);
    const steps = stepResponse.response.text();
    const codeGenerationPrompt = CODE_GENERATION_PROMPT(prompt, steps);
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await generateResponse(codeGenerationPrompt, controller);
          writeResponse(controller, { response, done : true });
          controller.close();
        } catch (error) {
          console.log('Error in code generation', error);
          const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
          controller.enqueue(`event: error\ndata: ${JSON.stringify({ message, status: 500 })}\n\n`);
          controller.close();
        }
      }
    });
    return new NextResponse(stream, { headers });
  } catch (error) {
    console.log(error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return customError({ message, status: 500 });
  }
}