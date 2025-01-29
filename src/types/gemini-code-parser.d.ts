declare module "gemini-code-parser" {

  export interface ParsedCodeResponse {
    title: string;
    files: Array<{ name: string; path: string, content: string }>;
    response: string;
  }

  export class GeminiCodeParser extends EventEmitter {
    constructor(apiKey: string, model: string);
    on(event: string, callback: (data: any) => void): void;
    generateContentStream(prompt: string): void;
    generateParsedCodeStream(prompt: string): Promise<ParsedCodeResponse>;
  }
}
