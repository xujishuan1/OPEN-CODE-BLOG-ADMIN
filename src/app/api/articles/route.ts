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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status');
  const category = searchParams.get('category');

  let filtered = [...articles];

  if (status && status !== 'all') {
    filtered = filtered.filter(a => a.status === status);
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(a => a.category?.id === category);
  }

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  const response = NextResponse.json({
    success: true,
    data: {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });

  response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    let category = undefined;
    if (body.categoryId) {
      const foundCategory = mockCategories.find(c => c.id === body.categoryId);
      if (foundCategory) {
        category = foundCategory;
      }
    }
    
    const newArticle = {
      id: String(Date.now()),
      title: body.title || '无标题',
      slug: body.slug || (body.title || 'untitled').toLowerCase().replace(/\s+/g, '-'),
      content: body.content || '',
      excerpt: body.excerpt || '',
      cover: body.cover || '',
      status: body.status || 'draft',
      category,
      tags: [],
      author: { id: '1', name: '管理员', email: 'admin@example.com', role: 'admin' as const },
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      publishedAt: body.status === 'published' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    articles.push(newArticle);

    return NextResponse.json({
      success: true,
      data: newArticle,
      message: '文章创建成功',
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
