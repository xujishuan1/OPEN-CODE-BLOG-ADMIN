"use client";

import { useState, useEffect } from 'react';
import { Button, Textarea } from '@/components/ui';
import type { Comment } from '@/types';

interface CommentsSectionProps {
  articleId: string;
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?articleId=${articleId}`);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('请填写评论内容');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          author: {
            name: '匿名用户',
          },
          article: {
            id: articleId,
            title: '',
            slug: '',
            content: '',
            status: 'published',
            tags: [],
            author: { id: '', name: '', email: '', role: 'admin' },
            viewCount: 0,
            likeCount: 0,
            commentCount: 0,
            createdAt: '',
            updatedAt: '',
          },
          status: 'approved',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setContent('');
        setShowForm(false);
        fetchComments();
      } else {
        alert(data.error?.message || '提交失败');
      }
    } catch (error) {
      console.error('提交评论失败:', error);
      alert('提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">评论区</h2>

      {/* 发表评论按钮 */}
      {!showForm && (
        <Button 
          onClick={() => setShowForm(true)}
          className="mb-6"
        >
          发表评论
        </Button>
      )}

      {/* 评论表单 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-4">发表评论</h3>
          <div className="space-y-4">
            <Textarea
              label="评论内容 *"
              placeholder="写下您的评论..."
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              className="min-h-[120px]"
              required
            />
            <div className="flex gap-2">
              <Button type="submit" loading={submitting}>
                提交评论
              </Button>
              <Button 
                type="button" 
                variant="ghost"
                onClick={() => setShowForm(false)}
              >
                取消
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* 评论列表 - 按时间倒序，最新评论显示在最前面 */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-muted-foreground text-center py-8">加载评论中...</p>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>暂无评论，快来发表第一条评论吧！</p>
          </div>
        ) : (
          [...comments].reverse().map((comment) => (
            <div 
              key={comment.id} 
              className="p-4 rounded-lg border border-border bg-card"
            >
              <div className="flex items-start gap-4">
                {/* 头像 */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-medium text-primary">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  
                  <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}