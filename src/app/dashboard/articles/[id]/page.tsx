"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, Button, Input, Textarea, Select, Badge } from '@/components/ui';
import { mockCategories, mockTags } from '@/lib/data';
import type { Article } from '@/types';
import '@uiw/react-md-editor/markdown-editor.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);



interface ArticlePageProps {
  params: { id: string };
}

export default function ArticleEditPage({ params }: ArticlePageProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (params.id === 'new') return;
    
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${params.id}`);
        const data = await res.json();
        
        if (data.success) {
          const article = data.data;
          setArticle(article);
          setTitle(article.title);
          setSlug(article.slug);
          setContent(article.content);
          setExcerpt(article.excerpt || '');
          setCoverImage(article.cover || '');
          setStatus(article.status);
          setCategoryId(article.category?.id || '');
          setSelectedTags(article.tags.map((t: { id: string }) => t.id));
        } else {
          alert('文章不存在');
          router.push('/dashboard/articles');
        }
      } catch (error) {
        console.error('获取文章失败:', error);
        alert('获取文章失败');
      }
    };
    
    fetchArticle();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (params.id === 'new') {
      try {
        const res = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
            content,
            excerpt,
            cover: coverImage,
            status,
            categoryId,
            tagIds: selectedTags,
          }),
        });
        const data = await res.json();
        
        if (data.success) {
          router.push('/dashboard/articles');
        } else {
          alert(data.error?.message || '保存失败');
        }
      } catch (error) {
        console.error('保存失败:', error);
        alert('保存失败，请重试');
      }
    } else {
      try {
        const res = await fetch(`/api/articles/${params.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            slug,
            content,
            excerpt,
            cover: coverImage,
            status,
            categoryId,
            tagIds: selectedTags,
          }),
        });
        const data = await res.json();
        
        if (data.success) {
          router.push('/dashboard/articles');
        } else {
          alert(data.error?.message || '保存失败');
        }
      } catch (error) {
        console.error('保存失败:', error);
        alert('保存失败，请重试');
      }
    }
    setLoading(false);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.url);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCoverImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  // 存储光标位置
  const cursorPositionRef = useRef<number>(0);

  // 图片压缩函数
  const compressImage = (file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.7): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        
        let { width, height } = img;
        
        // 计算压缩后的尺寸，保持宽高比
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建 canvas 上下文'));
          return;
        }
        
        // 填充白色背景（处理透明 PNG）
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('图片压缩失败'));
            }
          },
          file.type === 'image/png' ? 'image/jpeg' : file.type,
          quality
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('图片加载失败'));
      };
    });
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 限制图片大小为 5MB
    const maxSize = 5 * 1024 * 1024;
    let fileToUpload = file;
    let wasCompressed = false;

    if (file.size > maxSize) {
      setUploading(true);
      try {
        // 压缩图片
        const compressedBlob = await compressImage(file);
        fileToUpload = new File([compressedBlob], file.name, { type: 'image/jpeg' });
        wasCompressed = true;
        
        // 如果压缩后仍然超过 5MB，提示用户
        if (fileToUpload.size > maxSize) {
          alert(`图片压缩后仍超过 5MB（当前 ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB），请选择更小的图片`);
          if (contentImageInputRef.current) {
            contentImageInputRef.current.value = '';
          }
          setUploading(false);
          return;
        }
      } catch (error) {
        console.error('压缩失败:', error);
        alert('图片压缩失败，请重试');
        if (contentImageInputRef.current) {
          contentImageInputRef.current.value = '';
        }
        setUploading(false);
        return;
      }
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      let imageUrl = '';
      if (res.ok) {
        const data = await res.json();
        imageUrl = data.url;
      } else {
        // 如果上传失败，使用 blob URL
        imageUrl = URL.createObjectURL(fileToUpload);
      }

      // 在光标位置插入图片 markdown
      const imageMarkdown = `\n![${file.name}](${imageUrl})\n`;
      
      setContent((prev) => {
        const position = cursorPositionRef.current || prev.length;
        const before = prev.slice(0, position);
        const after = prev.slice(position);
        return before + imageMarkdown + after;
      });

      // 更新光标位置到插入内容之后
      cursorPositionRef.current += imageMarkdown.length;
      
      // 如果进行了压缩，显示提示
      if (wasCompressed) {
        const originalSize = (file.size / 1024 / 1024).toFixed(2);
        const compressedSize = (fileToUpload.size / 1024 / 1024).toFixed(2);
        console.log(`图片已压缩: ${originalSize}MB → ${compressedSize}MB`);
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('图片上传失败');
    } finally {
      setUploading(false);
      if (contentImageInputRef.current) {
        contentImageInputRef.current.value = '';
      }
    }
  };

  const removeCoverImage = () => {
    setCoverImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {params.id === 'new' ? '新建文章' : '编辑文章'}
          </h1>
          <p className="text-muted-foreground">
            {params.id === 'new' ? '创建新的博客文章' : '修改文章内容'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">基本信息</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="标题"
                  placeholder="输入文章标题"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <Input
                  label="Slug"
                  placeholder="article-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  helperText="URL友好型标识符"
                />
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-foreground">
                      内容 <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => contentImageInputRef.current?.click()}
                      className="text-xs px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors flex items-center gap-1"
                      disabled={uploading}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {uploading ? '上传中...' : '插入图片'}
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={contentImageInputRef}
                    onChange={handleContentImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div data-color-mode="auto">
                    <MDEditor
                      value={content}
                      onChange={(val) => setContent(val || '')}
                      preview="edit"
                      height={450}
                      style={{ border: '1px solid var(--border)' }}
                      textareaProps={{
                        onSelect: (e) => {
                          const target = e.target as HTMLTextAreaElement;
                          cursorPositionRef.current = target.selectionStart;
                        },
                        onClick: (e) => {
                          const target = e.target as HTMLTextAreaElement;
                          cursorPositionRef.current = target.selectionStart;
                        },
                        onKeyUp: (e) => {
                          const target = e.target as HTMLTextAreaElement;
                          cursorPositionRef.current = target.selectionStart;
                        },
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold">发布设置</h2>
                <Badge variant={status === 'published' ? 'success' : 'warning'}>
                  {status === 'published' ? '已发布' : '草稿'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="状态"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                  options={[
                    { value: 'draft', label: '草稿' },
                    { value: 'published', label: '已发布' },
                  ]}
                />
                <Select
                  label="分类"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  options={[
                    { value: '', label: '选择分类' },
                    ...mockCategories.map(c => ({ value: c.id, label: c.name })),
                  ]}
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    标签
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {mockTags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-2.5 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
                          selectedTags.includes(tag.id)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-background border-border hover:border-primary'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">摘要</h2>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="输入文章摘要"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="min-h-[100px]"
                  helperText="可选，用于文章列表展示"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">封面图片</h2>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="cover-upload"
                />
                
                {coverImage ? (
                  <div className="relative">
                    <img 
                      src={coverImage} 
                      alt="封面图片" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label 
                    htmlFor="cover-upload"
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer block hover:border-primary transition-colors"
                  >
                    {uploading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-8 w-8 text-primary mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-muted-foreground">上传中...</span>
                      </div>
                    ) : (
                      <>
                        <svg className="w-10 h-10 mx-auto text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-muted-foreground mb-2">点击上传图片</p>
                        <span className="inline-block px-4 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                          选择图片
                        </span>
                      </>
                    )}
                  </label>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" loading={loading}>
                保存文章
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
              >
                取消
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
