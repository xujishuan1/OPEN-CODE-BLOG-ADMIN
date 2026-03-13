"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Input, Badge } from '@/components/ui';
import { mockCategories } from '@/lib/data';

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description }),
      });
      const data = await res.json();

      if (data.success) {
        setCategories([...categories, data.data]);
        setName('');
        setSlug('');
        setDescription('');
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

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个分类吗？')) return;
    
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">分类管理</h1>
          <p className="text-muted-foreground">管理文章的分类</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '新建分类'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">新建分类</h2>
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
                placeholder="分类名称"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Slug"
                placeholder="category-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
              <Input
                label="描述"
                placeholder="分类描述"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary">{category.count} 篇文章</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">编辑</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(category.id)}>
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
