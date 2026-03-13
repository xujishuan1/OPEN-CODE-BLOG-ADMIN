"use client";

import { useState, useEffect } from 'react';
import { Header, Footer } from '@/components/layout';
import Link from 'next/link';
import type { Article, Category, Tag } from '@/types';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/articles?limit=100'),
          fetch('/api/categories'),
          fetch('/api/tags'),
        ]);

        const articlesData = await articlesRes.json();
        const categoriesData = await categoriesRes.json();
        const tagsData = await tagsRes.json();

        if (articlesData.success) {
          setArticles(articlesData.data.items);
        }
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
        if (tagsData.success) {
          setTags(tagsData.data);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const publishedArticles = articles.filter(a => a.status === 'published');
  const recentArticles = [...publishedArticles]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const popularTags = tags.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Header siteName="我的博客" />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
          <div className="absolute inset-0 glass opacity-60" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                欢迎来到我的博客
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                记录技术学习与生活思考，分享有用的知识和经验
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="#articles" className="btn-primary">
                  开始阅读
                </Link>
                <Link href="/about" className="btn-ghost">
                  了解更多
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Articles List */}
              <div className="lg:col-span-3" id="articles">
                <h2 className="text-2xl font-bold mb-6">最新文章</h2>
                
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">加载中...</p>
                  </div>
                ) : publishedArticles.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">暂无文章，敬请期待...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {publishedArticles.map((article) => (
                      <article 
                        key={article.id} 
                        className="card overflow-hidden hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="flex-1 p-4 md:p-5">
                            <div className="flex items-center gap-2 mb-2">
                              {article.category && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                  {article.category.name}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                              </span>
                            </div>
                            
                            <Link href={`/article/${article.id}`}>
                              <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors line-clamp-1">
                                {article.title}
                              </h3>
                            </Link>
                            
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {article.excerpt || article.content.substring(0, 100) + '...'}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary">
                                    {article.author?.name?.charAt(0) || 'A'}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {article.author?.name || '管理员'}
                                </span>
                              </div>
                              
                              <Link 
                                href={`/article/${article.id}`}
                                className="text-xs text-primary hover:underline"
                              >
                                阅读全文 →
                              </Link>
                            </div>
                          </div>
                          
                          {article.cover && (
                            <div className="w-full md:w-48 h-40 md:h-auto shrink-0 overflow-hidden">
                              <img 
                                src={article.cover} 
                                alt={article.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1 space-y-6">
                {/* Popular Tags */}
                <div className="card p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    热门标签
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Link 
                        key={tag.id}
                        href={`/tag/${tag.slug}`}
                        className="text-xs px-3 py-1 rounded-full border hover:border-primary hover:text-primary transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recent Articles */}
                <div className="card p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    近期文章
                  </h3>
                  <ul className="space-y-3">
                    {recentArticles.map((article) => (
                      <li key={article.id}>
                        <Link 
                          href={`/article/${article.id}`}
                          className="text-sm hover:text-primary transition-colors line-clamp-2"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Categories */}
                <div className="card p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    文章分类
                  </h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link 
                          href={`/category/${category.slug}`}
                          className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                        >
                          <span>{category.name}</span>
                          <span className="text-xs text-muted-foreground">{category.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Site Stats */}
                <div className="card p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    站点统计
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">文章</span>
                      <span className="font-medium">{articles.filter(a => a.status === 'published').length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">分类</span>
                      <span className="font-medium">{categories.length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">标签</span>
                      <span className="font-medium">{tags.length}</span>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
