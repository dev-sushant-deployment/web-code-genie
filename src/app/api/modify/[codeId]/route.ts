import { CODE_MODIFICATION_PROMPT } from "@/helper/Gemini/prompts";
import { customError, generateResponse, writeResponse, headers } from "@/helper/next-stream";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface ModifyRouteParams {
  params: Promise<{
    codeId: string;
  }>;
}

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

export async function GET(req: NextRequest, { params } : ModifyRouteParams) {
  const { codeId } = await params;
  const prompt = req.nextUrl.searchParams.get('prompt');
  try {
    if (!prompt) return customError({ message: 'Prompt is required to generate code', status: 400 });
    if (!codeId) return customError({ message: 'Code Id are required to modify code', status: 400 });
    const code = await db.code.findFirst({
      where: {
        id: codeId,
      },
      select: {
        id: true,
        title: true,
        files: {
          select: {
            name: true,
            path: true,
            content: true,
          },
        },
      },
    });
    if (!code) return customError({ message: 'Code not found', status: 404 });
    const codeFiles = code.files;
    const codeFilesString = stringifyCodeFiles(codeFiles);
    const codeModificationPrompt = CODE_MODIFICATION_PROMPT(prompt, codeFilesString);
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await generateResponse(codeModificationPrompt, controller);
          await db.$transaction(
            response.files.map(({ name, path, content }) =>
              db.file.upsert({
                where: {
                  path_codeId: {
                    path,
                    codeId,
                  }
                },
                update: { content },
                create: {
                  name,
                  path,
                  content,
                  codeId,
                }
              })
            )
          );
          await db.code.update({
            where: {
              id: codeId,
            },
            data: {
              chat: {
                create: [
                  {
                    message: prompt,
                    type: 'PROMPT',
                  },
                  {
                    message: response.response,
                    type: 'RESPONSE',
                  },
                ]
              }
            }
          })
          writeResponse(controller, { done: true });
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