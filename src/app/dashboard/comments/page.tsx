"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, Button, Badge, Select, Textarea } from '@/components/ui';
import type { Comment } from '@/types';

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/comments');
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error('获取评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: Comment['status']) => {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      
      if (data.success) {
        setComments(prev => 
          prev.map(c => c.id === id ? { ...c, status } : c)
        );
      } else {
        alert(data.error?.message || '更新失败');
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      alert('更新失败，请重试');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条评论吗？')) return;
    
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        setComments(prev => prev.filter(c => c.id !== id));
      } else {
        alert(data.error?.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editingComment) return;

    try {
      const res = await fetch(`/api/comments/${editingComment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });
      const data = await res.json();
      
      if (data.success) {
        setComments(prev => 
          prev.map(c => c.id === editingComment.id ? { ...c, content: editContent } : c)
        );
        setEditingComment(null);
        setEditContent('');
      } else {
        alert(data.error?.message || '更新失败');
      }
    } catch (error) {
      console.error('更新失败:', error);
      alert('更新失败，请重试');
    }
  };

  const filteredComments = comments.filter((comment) => {
    if (statusFilter !== 'all' && comment.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: Comment['status']) => {
    const variants: Record<Comment['status'], 'warning' | 'success' | 'danger' | 'default'> = {
      pending: 'warning',
      approved: 'success',
      spam: 'danger',
      trash: 'default',
    };
    const labels: Record<Comment['status'], string> = {
      pending: '待审核',
      approved: '已发布',
      spam: '垃圾评论',
      trash: '已删除',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getPendingCount = () => comments.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">评论管理</h1>
          <p className="text-muted-foreground">管理文章评论</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={fetchComments}>
            刷新
          </Button>
          {getPendingCount() > 0 && (
            <Badge variant="warning">
              {getPendingCount()} 条待审核
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: '全部状态' },
                { value: 'pending', label: '待审核' },
                { value: 'approved', label: '已发布' },
                { value: 'spam', label: '垃圾评论' },
                { value: 'trash', label: '已删除' },
              ]}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">加载中...</p>
            </div>
          ) : filteredComments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              暂无评论
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">文章</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">评论者</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">评论内容</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">状态</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">时间</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComments.map((comment) => (
                    <tr 
                      key={comment.id} 
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-4">
                        <Link 
                          href={`/article/${comment.article.id}`}
                          className="flex items-center gap-2 text-primary hover:underline font-medium"
                        >
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="line-clamp-1 max-w-[200px]">{comment.article.title}</span>
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-medium text-primary">
                              {comment.author.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">{comment.author.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {editingComment?.id === comment.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-h-[60px] text-sm"
                            />
                            <div className="flex gap-1">
                              <Button size="sm" onClick={handleSaveEdit}>保存</Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingComment(null)}>取消</Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm line-clamp-2 max-w-[300px]">{comment.content}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(comment.status)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString('zh-CN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          {comment.status !== 'spam' && comment.status !== 'trash' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleEdit(comment)}
                                disabled={editingComment !== null}
                              >
                                编辑
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-500 hover:text-red-600"
                                onClick={() => handleUpdateStatus(comment.id, 'spam')}
                              >
                                屏蔽
                              </Button>
                            </>
                          )}
                          {(comment.status === 'spam' || comment.status === 'trash') && (
                            <>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleUpdateStatus(comment.id, 'approved')}
                              >
                                恢复
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-500 hover:text-red-600"
                                onClick={() => handleDelete(comment.id)}
                              >
                                删除
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}