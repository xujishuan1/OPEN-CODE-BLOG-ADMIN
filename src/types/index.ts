export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover?: string;
  status: 'draft' | 'published';
  category?: Category;
  tags: Tag[];
  author: User;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface Comment {
  id: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  author: CommentAuthor;
  article: Article;
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
}

export interface CommentAuthor {
  name: string;
  email?: string;
  url?: string;
  avatar?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
  avatar?: string;
}

export interface SiteInfo {
  name: string;
  description: string;
  logo?: string;
  theme: 'light' | 'dark' | 'system';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
