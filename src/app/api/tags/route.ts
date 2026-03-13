import { NextRequest, NextResponse } from 'next/server';
import { mockTags } from '@/lib/data';

const tags = [...mockTags];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: tags,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.slug) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_PARAMS',
          message: '名称和Slug不能为空',
        },
      }, { status: 400 });
    }

    const newTag = {
      id: String(tags.length + 1),
      name: body.name,
      slug: body.slug,
      count: 0,
    };

    tags.push(newTag);

    return NextResponse.json({
      success: true,
      data: newTag,
      message: '标签创建成功',
    }, { status: 201 });
  } catch {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INVALID_PARAMS',
        message: '请求参数错误',
      },
    }, { status: 400 });
  }
}
