"use client";

import { useState, useEffect, useMemo } from 'react';
import { Header, Footer } from '@/components/layout';
import Link from 'next/link';
import type { Article, Category, Tag } from '@/types';

const skillTags = ['Next.js', 'React', 'TypeScript', 'Node.js', 'Python', 'Go', 'AI'];

const stats = [
  { number: '7+', label: '年开发经验' },
  { number: '50+', label: '个项目完成' },
  { number: '20+', label: '位满意客户' },
];

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        const [articlesRes, categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/articles?limit=100', { signal: controller.signal }),
          fetch('/api/categories', { signal: controller.signal }),
          fetch('/api/tags', { signal: controller.signal }),
        ]);

        const [articlesData, categoriesData, tagsData] = await Promise.all([
          articlesRes.json(),
          categoriesRes.json(),
          tagsRes.json(),
        ]);

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
  
  const recentArticles = useMemo(() => 
    [...publishedArticles]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    [publishedArticles]
  );
  
  const popularTags = useMemo(() => tags.slice(0, 8), [tags]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header siteName="我的博客" />
      
      <main className="flex-1 pt-14">
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
                全栈
              </h1>
              <h1 className="text-5xl md:text-6xl font-bold text-blue-600 tracking-tight leading-tight mb-6">
                开发者
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-xl">
                记录技术学习与生活思考，分享有用的知识和经验。专注于现代Web开发、人工智能和开源项目。
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {skillTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 bg-slate-200 text-slate-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="#articles" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all duration-200 hover:-translate-y-0.5">
                  查看文章
                </Link>
                <Link href="/about" className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-full hover:border-slate-400 hover:bg-slate-100 transition-all duration-200">
                  了解更多
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 border-y border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" id="articles">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-bold text-slate-900 mb-12">最新文章</h2>
                
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500">加载中...</p>
                  </div>
                ) : publishedArticles.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500">暂无文章，敬请期待...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <aside className="space-y-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-4">热门标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Link 
                        key={tag.id}
                        href={`/tag/${tag.slug}`}
                        className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-4">近期文章</h3>
                  <ul className="space-y-3">
                    {recentArticles.map((article) => (
                      <li key={article.id}>
                        <Link 
                          href={`/article/${article.id}`}
                          className="text-sm text-slate-600 hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-4">文章分类</h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link 
                          href={`/category/${category.slug}`}
                          className="flex items-center justify-between text-sm text-slate-600 hover:text-blue-600 transition-colors"
                        >
                          <span>{category.name}</span>
                          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{category.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-4">站点统计</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-slate-500">文章</span>
                      <span className="font-medium text-slate-900">{publishedArticles.length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-500">分类</span>
                      <span className="font-medium text-slate-900">{categories.length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-500">标签</span>
                      <span className="font-medium text-slate-900">{tags.length}</span>
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
