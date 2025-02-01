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

export const formatOutput = (name: string, path: string, content: string) => {
  name = name.split('/').pop() || name;
  if (path.split('/')[0] == 'pages') path = 'src/app' + path.split('pages')[1];
  if (path.split('/')[0] == 'app') path = 'src/' + path;
  if (path[0] != '/') path = '/' + path;
  if (content) {
    const match = content.match(/^```(?:\w+)?\n([\s\S]*?)\n```$/);
    if (match) content = match[1];
  }
  return { name, path, content };
}

export const generateResponse = async (prompt : string, controller: ReadableStreamDefaultController<any>) => {
  const { GEMINI_CODE_GENERATION_API_KEY } = process.env;
  if (!GEMINI_CODE_GENERATION_API_KEY) {
    throw new Error('Missing Gemini API key');
  }
  const codeParser = new GeminiCodeParser(GEMINI_CODE_GENERATION_API_KEY, GEMINI_CODE_GENERATION_MODEL);
  codeParser.on('title', (data) => writeResponse(controller, data));
  codeParser.on('file', (data) => {
    const { name, path, content } = formatOutput(data.name, data.path, data.content);
    data.name = name;
    data.path = path;
    data.content = content;
    writeResponse(controller, data)
  });
  codeParser.on('response', (data) => writeResponse(controller, data));
  const response = await codeParser.generateParsedCodeStream(prompt);
  return {...response, files: response.files.map(file => ({ ...file, name: file.name.split('/').pop() || file.name }))};
}