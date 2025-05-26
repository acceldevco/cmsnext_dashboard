import { NextResponse } from 'next/server';
import { regdbHandler } from '@/lib/regdb';

const modelName = 'blogPost';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const blogPost = await regdbHandler({ modelName, method: 'POST', data: json });
    return new NextResponse(JSON.stringify(blogPost), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const result = await regdbHandler({ modelName, method: 'GET', options: { page, pageSize } });
    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const id = request.url.split('/').pop();
    const json = await request.json();
    if (!id) {
      return new NextResponse(JSON.stringify({ error: 'BlogPost ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const blogPost = await regdbHandler({ modelName, method: 'PUT', data: { ...json, id } });
    return new NextResponse(JSON.stringify(blogPost), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const id = request.url.split('/').pop();
    if (!id) {
      return new NextResponse(JSON.stringify({ error: 'BlogPost ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await regdbHandler({ modelName, method: 'DELETE', data: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
