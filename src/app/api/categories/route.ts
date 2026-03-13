import { NextRequest, NextResponse } from 'next/server';
import { mockCategories } from '@/lib/data';

const categories = [...mockCategories];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: categories,
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

    const newCategory = {
      id: String(categories.length + 1),
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      count: 0,
    };

    categories.push(newCategory);

    return NextResponse.json({
      success: true,
      data: newCategory,
      message: '分类创建成功',
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
