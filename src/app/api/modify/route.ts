import { CODE_MODIFICATION_PROMPT } from "@/helper/Gemini/prompts";
import { customError, generateResponse, writeResponse, headers } from "@/helper/next-stream";
import { NextRequest, NextResponse } from "next/server";

const stringifyCodeFiles = (codeFiles: { name: string, path: string, content: string }[]) => {
  return codeFiles.map(({ name, path, content }) => {
    return (
      `<file>
        <name>${name}</name>
        <path>${path}</path>
        <content>
          ${content}
        </content>
      </file>`
    );
  }).join('\n\n');
}

export async function GET(req: NextRequest) {
  const codeFiles = JSON.parse(req.nextUrl.searchParams.get('codeFiles') || '{}');
  const prompt = req.nextUrl.searchParams.get('prompt');
  try {
    if (!prompt) return customError({ message: 'Prompt is required to generate code', status: 400 });
    if (!codeFiles) return customError({ message: 'Code files are required to modify code', status: 400 });
    const codeFilesString = stringifyCodeFiles(codeFiles);
    const codeModificationPrompt = CODE_MODIFICATION_PROMPT(prompt, codeFilesString);
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await generateResponse(codeModificationPrompt, controller);
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