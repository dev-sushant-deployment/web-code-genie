import { getCode } from "@/actions/code";
import { createReadStream, createWriteStream, existsSync, mkdirSync, rmSync, unlinkSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import archiver from "archiver";
import { Readable } from "stream";
import { baseConfig } from "@/constants";

interface DownloadRouteParams {
  params: Promise<{ codeId: string }>;
}

export async function GET(req: NextRequest, { params }: DownloadRouteParams) {
  const { codeId } = await params;
  const accessToken = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const basePath = process.env.NODE_ENV === 'development' ? path.join(process.cwd(), 'temp') : '/tmp';
  try {
    const { data, error, status } = await getCode(accessToken, codeId);
    if (error && status) return NextResponse.json({ error }, { status });
    if (!data) throw new Error('An Unexpected error occurred');
    const { files, title } = data;
    const zipPath = path.join(basePath, `${title}-${codeId}.zip`);
    const tempDir = path.dirname(zipPath);
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true });
    }
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(output);
    files.forEach(file => {
      archive.append(file.content, { name: file.path });
    });
    for (const [fileName, fileData] of Object.entries(baseConfig)) {
      if (fileName === '.babelrc') continue;
      archive.append(fileData.file.contents, { name: fileName });
    }
    await archive.finalize();
    await new Promise<void>((resolve, reject) => {
      output.on("close", () => resolve());
      output.on("error", reject);
    });
    const fileStream = createReadStream(zipPath);
    fileStream.on("close", () => {
      try {
        unlinkSync(zipPath);
        rmSync(tempDir, { recursive: true, force: true });
      } catch (err) {
        console.error("Error deleting directory:", err);
      }
    });
    const stream = Readable.toWeb(fileStream) as ReadableStream<Uint8Array>;
    return new NextResponse(stream, {
      headers: {
        'Content-Disposition': `attachment; filename=${title}-${codeId}.zip`,
        'Content-Type': 'application/zip',
      },
    });
  } catch (error) {
    // console.log("error in download", error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}