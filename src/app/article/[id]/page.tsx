import { Header, Footer } from '@/components/layout';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CommentsSection } from '@/components/features/CommentsSection';
import { mockArticles } from '@/lib/data';
import type { Article, Tag } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return mockArticles.map((article) => ({
    id: article.id,
  }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  
  const article = mockArticles.find(a => a.id === id);

  if (!article) {
    notFound();
  }

  const relatedArticles = mockArticles
    .filter(a => a.id !== article.id && a.category?.id === article.category?.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header siteName="我的博客" />
      
      <main className="flex-1">
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-800" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                {article.category && (
                  <Link 
                    href={`/category/${article.category.slug}`}
                    className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {article.category.name}
                  </Link>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {article.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {article.author?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <span>{article.author?.name || '管理员'}</span>
                </div>
                <span>·</span>
                <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
                <span>·</span>
                <span>{article.viewCount} 次阅读</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                {article.cover && (
                  <div className="aspect-video w-full overflow-hidden rounded-xl mb-8">
                    <img 
                      src={article.cover} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <article className="prose prose-lg dark:prose-invert max-w-none">
                  <div 
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ 
                      __html: article.content
                        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/^(.+)$/gm, '<p>$1</p>')
                    }}
                  />
                </article>

                {article.tags && article.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-muted-foreground">标签：</span>
                      {article.tags.map((tag: Tag) => (
                        <Link 
                          key={tag.id}
                          href={`/tag/${tag.slug}`}
                          className="text-sm px-3 py-1 rounded-full border hover:border-primary hover:text-primary transition-colors"
                        >
                          {tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">分享：</span>
                  <button className="text-sm px-3 py-1 rounded border hover:border-primary hover:text-primary transition-colors">
                    微信
                  </button>
                  <button className="text-sm px-3 py-1 rounded border hover:border-primary hover:text-primary transition-colors">
                    微博
                  </button>
                  <button className="text-sm px-3 py-1 rounded border hover:border-primary hover:text-primary transition-colors">
                    复制链接
                  </button>
                </div>

                <CommentsSection articleId={article.id} />
              </div>

              <aside className="lg:col-span-1 space-y-6">
                <div className="card p-4 sticky top-24">
                  <h3 className="font-semibold mb-4">目录</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-primary">简介</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary">主要内容</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary">总结</a></li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {relatedArticles.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">相关文章</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related: Article) => (
                  <Link 
                    key={related.id}
                    href={`/article/${related.id}`}
                    className="card overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {related.cover && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={related.cover} 
                          alt={related.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(related.createdAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
