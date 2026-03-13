"use client";

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  siteName?: string;
}

export function Header({ siteName = '博客管理' }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold">{siteName}</span>
        </Link>

        <nav className="flex items-center gap-4">
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="切换主题"
          >
            {resolvedTheme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {!isLoading && user && (
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2.5 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                返回首页
              </Link>
              <Link
                href="/dashboard"
                className="p-2.5 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                后台管理
              </Link>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="p-2.5 rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
              >
                退出
              </button>
            </div>
          )}

          {!isLoading && !user && (
            <Link
              href="/login"
              className="p-2.5 rounded-lg hover:bg-muted transition-colors text-sm"
            >
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
