import { GEMINI_CODE_GENERATION_MODEL } from "@/constants";
import { GeminiCodeParser } from "gemini-code-parser";
import { NextResponse } from "next/server";

export const headers = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive'
};

export const customError = (errorData : { message?: string, status: number }) => {
  return new NextResponse(`event: error\ndata: ${JSON.stringify(errorData)}\n\n`, { headers });
}

export const writeResponse = (controller: ReadableStreamDefaultController<any>, data : any) => {
  controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
}

export const generateResponse = async (prompt : string, controller: ReadableStreamDefaultController<any>) => {
  const { GEMINI_CODE_GENERATION_API_KEY } = process.env;
  if (!GEMINI_CODE_GENERATION_API_KEY) {
    throw new Error('Missing Gemini API key');
  }
  const codeParser = new GeminiCodeParser(GEMINI_CODE_GENERATION_API_KEY, GEMINI_CODE_GENERATION_MODEL);
  codeParser.on('title', (data) => writeResponse(controller, data));
  codeParser.on('file', (data) => {
    data.name = data.name.split('/').pop();
    if (data.path.split('/')[0] == 'pages') data.path = 'src/app' + data.path.split('pages')[1];
    if (data.path.split('/')[0] == 'app') data.path = 'src/' + data.path;
    if (data.path[0] != '/') data.path = '/' + data.path;
    if (data.content) {
      const match = data.content.match(/^```(?:\w+)?\n([\s\S]*?)\n```$/);
      if (match) data.content = match[1];
    }
    writeResponse(controller, data)
  });
  codeParser.on('response', (data) => writeResponse(controller, data));
  const response = await codeParser.generateParsedCodeStream(prompt);
  return {...response, files: response.files.map(file => ({ ...file, name: file.name.split('/').pop() || file.name }))};
}