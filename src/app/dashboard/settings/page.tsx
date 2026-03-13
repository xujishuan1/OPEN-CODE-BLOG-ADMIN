"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Input, Select } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [siteName, setSiteName] = useState('我的博客');
  const [siteDescription, setSiteDescription] = useState('一个使用 Next.js 构建的博客网站');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">系统设置</h1>
        <p className="text-muted-foreground">管理博客系统配置</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">基本设置</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="网站名称"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
            <Input
              label="网站描述"
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
            />
            <Button>保存设置</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">外观设置</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="主题模式"
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
              options={[
                { value: 'light', label: '浅色模式' },
                { value: 'dark', label: '深色模式' },
                { value: 'system', label: '跟随系统' },
              ]}
            />
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                当前主题: {theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '系统'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
