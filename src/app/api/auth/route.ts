import { NextRequest, NextResponse } from 'next/server';

const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: '管理员',
    role: 'admin',
  },
  {
    id: '2',
    email: 'editor@example.com',
    password: 'editor123',
    name: '编辑',
    role: 'editor',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_PARAMS',
          message: '邮箱和密码不能为空',
        },
      }, { status: 400 });
    }

    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '邮箱或密码错误',
        },
      }, { status: 401 });
    }

    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      message: '登录成功',
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
