import { NextRequest, NextResponse } from 'next/server';
import type { Comment } from '@/types';

// 使用 globalThis 共享数据
declare global {
  // eslint-disable-next-line no-var
  var commentsStore: Comment[] | undefined;
}

const comments = globalThis.commentsStore as Comment[] || [];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const comment = comments.find(c => c.id === params.id);

  if (!comment) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '评论不存在',
      },
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: comment,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentIndex = comments.findIndex(c => c.id === params.id);

    if (commentIndex === -1) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '评论不存在',
        },
      }, { status: 404 });
    }

    const body = await request.json();
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentIndex = comments.findIndex(c => c.id === params.id);

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