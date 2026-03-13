import { Article, Category, Tag } from '@/types';

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Next.js 14 新特性介绍',
    slug: 'nextjs-14-features',
    content: '# Next.js 14 新特性\n\nNext.js 14 引入了许多新特性...',
    excerpt: 'Next.js 14 是目前最新的稳定版本，带来了许多令人兴奋的新功能。',
    cover: '/images/nextjs.jpg',
    status: 'published',
    category: { id: '1', name: '技术', slug: 'tech', count: 10 },
    tags: [
      { id: '1', name: 'Next.js', slug: 'nextjs' },
      { id: '2', name: 'React', slug: 'react' },
    ],
    author: { id: '1', name: '管理员', email: 'admin@example.com', role: 'admin' },
    viewCount: 1234,
    likeCount: 56,
    commentCount: 12,
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'React Hooks 最佳实践',
    slug: 'react-hooks-best-practices',
    content: '# React Hooks 最佳实践\n\n本文介绍 React Hooks 的最佳实践...',
    status: 'draft',
    category: { id: '1', name: '技术', slug: 'tech', count: 10 },
    tags: [
      { id: '2', name: 'React', slug: 'react' },
    ],
    author: { id: '1', name: '管理员', email: 'admin@example.com', role: 'admin' },
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    createdAt: '2024-01-14T12:00:00Z',
    updatedAt: '2024-01-14T12:00:00Z',
  },
  {
    id: '3',
    title: 'TypeScript 入门指南',
    slug: 'typescript-getting-started',
    content: '# TypeScript 入门指南\n\nTypeScript 是 JavaScript 的超集...',
    excerpt: 'TypeScript 为 JavaScript 带来了类型系统，让代码更可靠。',
    status: 'published',
    category: { id: '1', name: '技术', slug: 'tech', count: 10 },
    tags: [
      { id: '3', name: 'TypeScript', slug: 'typescript' },
    ],
    author: { id: '1', name: '管理员', email: 'admin@example.com', role: 'admin' },
    viewCount: 2567,
    likeCount: 128,
    commentCount: 45,
    publishedAt: '2024-01-12T14:00:00Z',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T14:00:00Z',
  },
];

export const mockCategories: Category[] = [
  { id: '1', name: '技术', slug: 'tech', description: '技术相关文章', count: 10 },
  { id: '2', name: '生活', slug: 'life', description: '生活随笔', count: 5 },
  { id: '3', name: '设计', slug: 'design', description: '设计相关', count: 3 },
];

export const mockTags: Tag[] = [
  { id: '1', name: 'Next.js', slug: 'nextjs', count: 5 },
  { id: '2', name: 'React', slug: 'react', count: 8 },
  { id: '3', name: 'TypeScript', slug: 'typescript', count: 6 },
  { id: '4', name: 'Tailwind CSS', slug: 'tailwind', count: 4 },
];
