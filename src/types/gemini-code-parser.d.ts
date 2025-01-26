declare module "gemini-code-parser" {

  export interface ParsedCodeResponse {
    files: Array<{ name: string; path: string, content: string }>;
    [key: string]: any;
  }

  export class GeminiCodeParser extends EventEmitter {
    constructor(apiKey: string, model: string);
    on(event: string, callback: (data: any) => void): void;
    generateContentStream(prompt: string): void;
    generateParsedCodeStream(prompt: string): Promise<ParsedCodeResponse>;
  }
}
