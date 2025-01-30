"use server";

import { db } from "@/lib/db";
import { middleware } from "./user";

export const createCode = async (
  accessToken: string,
  response: {
    title?: string;
    files: { name: string; path: string; content: string }[];
    response: string;
  },
  prompt: string,
) => {
  try {
    const { email, error, status } = await middleware(accessToken);
    if (error && status) return { error, status };
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
      }
    });
    if (!user) return { error: 'User not found', status: 404 };
    const code = await db.code.create({
      data: {
        title: response.title || 'Untitled',
        chat: {
          create: [
            {
              message: prompt,
              type: 'PROMPT'
            },
            {
              message: response.response,
              type: 'RESPONSE'
            }
          ]
        },
        files: {
          create: response.files.map(({ name, path, content }) => ({
            name,
            path,
            content,
          }))
        },
        user: {
          connect: {
            id: user.id,
          }
        }
      },
      select: {
        id: true,
      }
    });
    return { data: { id: code.id }, status: 201 };
  } catch (error) {
    // console.log("error in create code", error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return { error: message, status: 500 };
  }
}

export const getCode = async (accessToken: string, id: string) => {
  try {
    const { email, error, status } = await middleware(accessToken);
    if (error && status) return { error, status };
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
      }
    });
    if (!user) return { error: 'User not found', status: 404 };
    const code = await db.code.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        chat: {
          select: {
            message: true,
            type: true,
          },
          orderBy: {
            createdAt: 'asc',
          }
        },
        files: {
          select: {
            name: true,
            path: true,
            content: true,
          }
        },
        userId: true,
      }
    });
    if (!code) return { error: 'Code not found', status: 404 };
    if (code.userId !== user.id) return { error: 'Unauthorized', status: 401 };
    code.files = code.files.map(({ name, path, content }) => ({
      name,
      path: path[path.length - 1] === '/' ? path.slice(0, -1) : path,
      content
    }));
    return { data: code, status: 200 };
  } catch (error) {
    // console.log("error in getting code", error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return { error: message, status: 500 };
  }
}

export const getCodesMeta = async (accessToken: string) => {
  try {
    const { email, error, status } = await middleware(accessToken);
    if (error && status) return { error, status };
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
      }
    });
    if (!user) return { error: 'User not found', status: 404 };
    const codes = await db.code.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      }
    });
    return { codes, status: 200 };
  } catch (error) {
    // console.log("error in getting codes", error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return { error: message, status: 500 };
  }
}