"use server";

import { db } from "@/lib/db";
import { middleware } from "./user";
import { formatOutput } from "@/helper/next-stream";

export const updateFiles = async (accessToken: string, codeId: string, files: { name: string; path: string; content?: string }[]) => {
  try {
    const { email, error, status } = await middleware(accessToken);
    if (error && status) return { error, status };
    if (!email) return { error: 'Unauthorized', status: 401 };
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
      }
    });
    if (!user) return { error: 'User not found', status: 404 };
    await db.$transaction(
      files.map(({ name, path, content }) => {
        ({ name, path, content } = formatOutput(name, path, content || ''));
        return db.file.upsert({
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
        })}
      )
    );
    return { status: 204 };
  } catch (error) {
    // console.log("error in update files", error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return { error: message, status: 500 };
  }
}