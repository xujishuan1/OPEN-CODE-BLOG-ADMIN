"use client";

import { useState, useEffect, useMemo } from 'react';
import { Header, Footer } from '@/components/layout';
import Link from 'next/link';
import type { Article } from '@/types';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        const articlesRes = await fetch('/api/articles?limit=100', { signal: controller.signal });
        const articlesData = await articlesRes.json();

        if (articlesData.success) {
          setArticles(articlesData.data.items);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('获取数据失败:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  const publishedArticles = useMemo(() => 
    articles.filter(a => a.status === 'published'),
    [articles]
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header siteName="我的博客" />
      
      <main className="flex-1 pt-14">
        <section className="py-12 bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">文章列表</h1>
            <p className="text-slate-600">共 {publishedArticles.length} 篇文章</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">加载中...</p>
              </div>
            ) : publishedArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">暂无文章，敬请期待...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.id}`}
                    className="block"
                  >
                    <article
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group h-full"
                    >
                      {article.cover && (
                        <div className="w-full h-40 overflow-hidden">
                          <img 
                            src={article.cover} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          {article.category && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                              {article.category.name}
                            </span>
                          )}
                          <span className="text-xs text-slate-400">
                            {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                        {article.excerpt || article.content.substring(0, 100) + '...'}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-700">
                              {article.author?.name?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {article.author?.name || '管理员'}
                          </span>
                        </div>

                        <span className="text-sm text-blue-600 font-medium">
                          阅读全文 →
                        </span>
                      </div>

                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
