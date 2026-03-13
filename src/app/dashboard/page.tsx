import { Card, CardContent, CardHeader } from '@/components/ui';

const stats = [
  {
    title: '文章总数',
    value: '24',
    change: '+3',
    trend: 'up',
  },
  {
    title: '分类数量',
    value: '8',
    change: '0',
    trend: 'neutral',
  },
  {
    title: '标签数量',
    value: '32',
    change: '+5',
    trend: 'up',
  },
  {
    title: '待审核评论',
    value: '12',
    change: '-2',
    trend: 'down',
  },
];

const recentArticles = [
  {
    id: '1',
    title: 'Next.js 14 新特性介绍',
    status: 'published',
    views: 1234,
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'React Hooks 最佳实践',
    status: 'draft',
    views: 0,
    date: '2024-01-14',
  },
  {
    id: '3',
    title: 'TypeScript 入门指南',
    status: 'published',
    views: 2567,
    date: '2024-01-12',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">仪表盘</h1>
        <p className="text-muted-foreground">欢迎回到博客管理系统</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-2">
                <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className={`text-xs ${
                  stat.trend === 'up' ? 'text-green-500' :
                  stat.trend === 'down' ? 'text-red-500' :
                  'text-muted-foreground'
                }`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">最近文章</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{article.title}</p>
                  <p className="text-xs text-muted-foreground">{article.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    article.status === 'published'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                  }`}>
                    {article.status === 'published' ? '已发布' : '草稿'}
                  </span>
                  <span className="text-xs text-muted-foreground">{article.views} 次浏览</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
