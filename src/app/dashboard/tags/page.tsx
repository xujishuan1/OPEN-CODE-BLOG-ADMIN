"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Input, Badge } from '@/components/ui';
import { mockTags } from '@/lib/data';

export default function TagsPage() {
  const [tags, setTags] = useState(mockTags);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      });
      const data = await res.json();

      if (data.success) {
        setTags([...tags, data.data]);
        setName('');
        setSlug('');
        setShowForm(false);
      } else {
        setError(data.error?.message || '创建失败');
      }
    } catch {
      setError('请求失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('确定要删除这个标签吗？')) return;
    setTags(tags.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">标签管理</h1>
          <p className="text-muted-foreground">管理文章的标签</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '新建标签'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">新建标签</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  {error}
                </div>
              )}
              <Input
                label="名称"
                placeholder="标签名称"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Slug"
                placeholder="tag-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
              <div className="flex gap-3">
                <Button type="submit" loading={loading}>保存</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  取消
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-wrap gap-3 p-4">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-muted/50 transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="font-medium">{tag.name}</span>
                <Badge variant="secondary">{tag.count || 0}</Badge>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 h-6 w-6 p-0" onClick={() => handleDelete(tag.id)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
