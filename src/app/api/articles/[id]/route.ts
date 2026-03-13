import { NextRequest, NextResponse } from 'next/server';
import { mockArticles, mockCategories } from '@/lib/data';
import type { Article } from '@/types';

declare global {
  // eslint-disable-next-line no-var
  var articlesStore: Article[] | undefined;
}

// 使用 globalThis 共享数据
if (!globalThis.articlesStore) {
  globalThis.articlesStore = [...mockArticles];
}
const articles = globalThis.articlesStore as Article[];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const article = articles.find(a => a.id === params.id);

  if (!article) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '文章不存在',
      },
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: article,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const articleIndex = articles.findIndex(a => a.id === params.id);

  if (articleIndex === -1) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '文章不存在',
      },
    }, { status: 404 });
  }

  try {
    const body = await request.json();
    
    let category = articles[articleIndex].category;
    if (body.categoryId) {
      const foundCategory = mockCategories.find(c => c.id === body.categoryId);
      if (foundCategory) {
        category = foundCategory;
      }
    } else if (body.categoryId === '') {
      category = undefined;
    }

    const updatedArticle = {
      ...articles[articleIndex],
      ...body,
      category,
      publishedAt: body.status === 'published' && !articles[articleIndex].publishedAt 
        ? new Date().toISOString() 
        : articles[articleIndex].publishedAt,
      updatedAt: new Date().toISOString(),
    };

    articles[articleIndex] = updatedArticle;

    return NextResponse.json({
      success: true,
      data: updatedArticle,
      message: '文章更新成功',
    });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const articleIndex = articles.findIndex(a => a.id === params.id);

  if (articleIndex === -1) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '文章不存在',
      },
    }, { status: 404 });
  }

  articles.splice(articleIndex, 1);

  return NextResponse.json({
    success: true,
    message: '文章删除成功',
  });
}
