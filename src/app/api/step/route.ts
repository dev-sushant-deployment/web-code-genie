import { stepsGenerationModel } from "@/helper/Gemini/gemini-ai";
import { STEP_GENERATION_PROMPT } from "@/helper/Gemini/prompts";
import { writeFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get('prompt');
  try {
    if (!prompt) return NextResponse.json({ error: 'Prompt is required to generate code' } , { status: 400 });
    const setGenerationPrompt = STEP_GENERATION_PROMPT(prompt);
    const stepResponse = await stepsGenerationModel.generateContent(setGenerationPrompt);
    const steps = stepResponse.response.text();
    const basePath = process.env.NODE_ENV === 'development' ? process.cwd() : '/tmp';
    const id = uuidv4();
    const filePath = path.join(basePath, `${id}.txt`);
    writeFileSync(filePath, steps);
    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.log(error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}