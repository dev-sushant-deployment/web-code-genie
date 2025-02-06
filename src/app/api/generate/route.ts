import { CODE_GENERATION_PROMPT } from "@/helper/Gemini/prompts";
import { NextRequest, NextResponse } from "next/server";
import { customError, generateResponse, writeResponse, headers } from "@/helper/next-stream";
import { readFileSync, rmSync } from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get('prompt');
  const id = req.nextUrl.searchParams.get('steps');
  try {
    if (!prompt) return customError({ message: 'Prompt is required to generate code', status: 400 });
    if (!id) return customError({ message: 'Steps are required to generate code', status: 400 });
    const basePath = process.env.NODE_ENV === 'development' ? process.cwd() : '/tmp';
    const filePath = path.join(basePath, `${id}.txt`);
    const steps = readFileSync(filePath, 'utf-8');
    const title = steps.split('\n')[0].replace('Title: ', '');
    rmSync(filePath);
    const codeGenerationPrompt = CODE_GENERATION_PROMPT(prompt, steps);
    const stream = new ReadableStream({
      async start(controller) {
        try {
          writeResponse(controller, { title });
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