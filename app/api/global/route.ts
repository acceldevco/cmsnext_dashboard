import { regdbHandler } from '@/lib/regdb';
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(req: NextRequest) {
  try {
    const modelName = req.nextUrl.searchParams.get('modelName');
    const id = req.nextUrl.searchParams.get('id');
    const data = id ? { id } : {};
    const result = await regdbHandler({ modelName: modelName as any, method: 'GET', data });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function uploadImage(file: formidable.File): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '');
  const filename = `${timestamp}-${file.originalFilename}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.rename(file.filepath, path.join(uploadDir, filename));
  return `/uploads/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const modelName = data.get('modelName');
    const action = data.get('action');
    const image = data.get('image') as unknown as File;

    if (action === 'uploadImage') {
      const buffer = await image.arrayBuffer();
     console.log(buffer);
     
      const bytes = new Uint8Array(buffer);
      const timestamp = new Date().toISOString().replace(/[-:T.]/g, '');
      const filename = `${timestamp}-${image.name}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, bytes);
      const imageUrl = `/uploads/${filename}`;
      data.set('image', imageUrl);
    
    }

    const result = await regdbHandler({ modelName: modelName as any, method: 'POST', data: Object.fromEntries(data) });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const modelName = req.nextUrl.searchParams.get('modelName');
    const data = await req.json();
    const result = await regdbHandler({ modelName: modelName as any, method: 'PUT', data });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const modelName = req.nextUrl.searchParams.get('modelName');
    const id = req.nextUrl.searchParams.get('id');
    const data = { id };
    const result = await regdbHandler({ modelName: modelName as any, method: 'DELETE', data });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
