"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, Button, Badge, Input, Select } from '@/components/ui';
import { mockCategories } from '@/lib/data';
import type { Article } from '@/types';

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles?limit=100');
      const data = await res.json();
      if (data.success) {
        setArticles(data.data.items);
      }
    } catch (error) {
      console.error('获取文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;
    
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setArticles(articles.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      });
      const data = await res.json();
      if (data.success) {
        setArticles(articles.map(a => a.id === id ? { ...a, status: 'published' } : a));
      }
    } catch (error) {
      console.error('发布失败:', error);
    }
  };

  const filteredArticles = articles.filter((article) => {
    if (statusFilter !== 'all' && article.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && article.category?.id !== categoryFilter) return false;
    if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">文章管理</h1>
          <p className="text-muted-foreground">管理您的博客文章</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={fetchArticles}>
            刷新
          </Button>
          <Link href="/dashboard/articles/new">
            <Button>新建文章</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:w-64"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: '全部状态' },
                { value: 'published', label: '已发布' },
                { value: 'draft', label: '草稿' },
              ]}
            />
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: 'all', label: '全部分类' },
                ...mockCategories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">加载中...</div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              点击&quot;新建文章&quot;创建第一篇文章
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/dashboard/articles/${article.id}`}
                  className="block"
                >
                  <div
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium truncate">
                          {article.title || '无标题'}
                        </span>
                        <Badge variant={article.status === 'published' ? 'success' : 'warning'}>
                          {article.status === 'published' ? '已发布' : '草稿'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {article.category && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {article.category.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {article.viewCount}
                        </span>
                        <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                      {article.status === 'draft' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-500 hover:text-green-600"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePublish(article.id);
                          }}
                        >
                          发布
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/dashboard/articles/${article.id}`);
                        }}
                      >
                        编辑
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(article.id);
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
