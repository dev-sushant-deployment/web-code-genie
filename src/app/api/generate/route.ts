import { stepsGenerationModel } from "@/helper/Gemini/gemini-ai";
import { CODE_GENERATION_PROMPT, STEP_GENERATION_PROMPT } from "@/helper/Gemini/prompts";
import { NextRequest, NextResponse } from "next/server";
import { GeminiCodeParser } from "gemini-code-parser";

const headers = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive'
};

const customError = (errorData : { message?: string, status: number }) => {
  return new NextResponse(`event: error\ndata: ${JSON.stringify(errorData)}\n\n`, { headers });
}

const writeResponse = (controller: ReadableStreamDefaultController<any>, data : any) => {
  controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
}

const generateResponse = async (prompt : string, controller: ReadableStreamDefaultController<any>) => {
  const { GEMINI_CODE_GENERATION_API_KEY } = process.env;
  if (!GEMINI_CODE_GENERATION_API_KEY) {
    throw new Error('Missing Gemini API key');
  }
  const codeParser = new GeminiCodeParser(GEMINI_CODE_GENERATION_API_KEY, "gemini-1.5-flash");
  codeParser.on('title', (data) => writeResponse(controller, data));
  codeParser.on('file', (data) => {
    data.name = data.name.split('/').pop();
    writeResponse(controller, data)
  });
  codeParser.on('response', (data) => writeResponse(controller, data));
  codeParser.on('response-end', () => controller.close());
  const response = await codeParser.generateParsedCodeStream(prompt);
  return {...response, files: response.files.map(file => ({ ...file, name: file.name.split('/').pop() }))};
}

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
          writeResponse(controller, response);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
          controller.enqueue(`event: error\ndata: ${JSON.stringify({ message, status: 500 })}\n\n`);
          controller.close();
        }
      }
    });
    return new NextResponse(stream, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return customError({ message, status: 500 });
  }
}