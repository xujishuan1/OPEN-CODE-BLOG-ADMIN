import { NextRequest, NextResponse } from 'next/server';
import type { Comment } from '@/types';

const mockComments: Comment[] = [
  {
    id: '1',
    content: '这篇文章写得真好，受益匪浅！',
    author: { name: '张三', email: 'zhangsan@example.com' },
    article: {
      id: '1',
      title: 'Next.js 14 新特性介绍',
      slug: 'nextjs-14-features',
      content: '',
      status: 'published',
      tags: [],
      author: { id: '1', name: '管理员', email: 'admin@example.com', role: 'admin' },
      viewCount: 100,
      likeCount: 10,
      commentCount: 5,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    status: 'approved',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    content: '期待更多关于React的文章',
    author: { name: '李四', email: 'lisi@example.com' },
    article: {
      id: '2',
      title: 'React Hooks 最佳实践',
      slug: 'react-hooks-best-practices',
      content: '',
      status: 'published',
      tags: [],
      author: { id: '1', name: '管理员', email: 'admin@example.com', role: 'admin' },
      viewCount: 100,
      likeCount: 10,
      commentCount: 5,
      createdAt: '2024-01-14T15:00:00Z',
      updatedAt: '2024-01-14T15:00:00Z',
    },
    status: 'approved',
    createdAt: '2024-01-14T15:00:00Z',
  },
  {
    id: '3',
    content: '这个内容看起来像是垃圾评论',
    author: { name: 'Spam Bot', email: 'spam@example.com' },
    article: {
      id: '3',
      title: 'TypeScript 入门指南',
      slug: 'typescript-guide',
      content: '',
      status: 'published',
      tags: [],
      author: { id: '1', name: '管理员', email: 'admin@example.com', role: 'admin' },
      viewCount: 100,
      likeCount: 10,
      commentCount: 5,
      createdAt: '2024-01-13T09:00:00Z',
      updatedAt: '2024-01-13T09:00:00Z',
    },
    status: 'spam',
    createdAt: '2024-01-13T09:00:00Z',
  },
];

// 使用 globalThis 共享数据
declare global {
  // eslint-disable-next-line no-var
  var commentsStore: Comment[] | undefined;
}

if (!globalThis.commentsStore) {
  globalThis.commentsStore = [...mockComments];
}
const comments = globalThis.commentsStore as Comment[];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const articleId = searchParams.get('articleId');

  let filtered = [...comments];

  if (status && status !== 'all') {
    filtered = filtered.filter(c => c.status === status);
  }

  if (articleId) {
    filtered = filtered.filter(c => c.article.id === articleId);
  }

  // 文章页面返回所有非垃圾评论（包括待审核的），管理后台返回全部
  const publicComments = filtered.filter(c => c.status !== 'spam' && c.status !== 'trash');

  return NextResponse.json({
    success: true,
    data: articleId ? publicComments : filtered,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.content || !body.author?.name) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_PARAMS',
          message: '评论内容和作者名称不能为空',
        },
      }, { status: 400 });
    }

    const newComment: Comment = {
      id: String(Date.now()),
      content: body.content,
      author: body.author,
      article: body.article || { title: '未知文章', id: '', slug: '', content: '', status: 'published', tags: [], author: { id: '', name: '', email: '', role: 'admin' }, viewCount: 0, likeCount: 0, commentCount: 0, createdAt: '', updatedAt: '' },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);

    return NextResponse.json({
      success: true,
      data: newComment,
      message: '评论提交成功，等待审核',
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

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_PARAMS',
          message: '评论ID不能为空',
        },
      }, { status: 400 });
    }

    const body = await request.json();
    const commentIndex = comments.findIndex(c => c.id === id);

    if (commentIndex === -1) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '评论不存在',
        },
      }, { status: 404 });
    }

    const updatedComment = {
      ...comments[commentIndex],
      ...body,
    };

    comments[commentIndex] = updatedComment;

    return NextResponse.json({
      success: true,
      data: updatedComment,
      message: '评论更新成功',
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_PARAMS',
          message: '评论ID不能为空',
        },
      }, { status: 400 });
    }

    const commentIndex = comments.findIndex(c => c.id === id);

    if (commentIndex === -1) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '评论不存在',
        },
      }, { status: 404 });
    }

    comments.splice(commentIndex, 1);

    return NextResponse.json({
      success: true,
      message: '评论删除成功',
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