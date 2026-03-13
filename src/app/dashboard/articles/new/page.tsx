"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, Button, Input, Textarea, Select } from '@/components/ui';
import { mockCategories, mockTags } from '@/lib/data';
import '@uiw/react-md-editor/markdown-editor.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

export default function NewArticlePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
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
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCoverImage(ev.target?.result as string);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
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
          <h1 className="text-2xl font-bold">新建文章</h1>
          <p className="text-muted-foreground">创建新的博客文章</p>
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
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    内容 <span className="text-red-500">*</span>
                  </label>
                  <div data-color-mode="auto">
                    <MDEditor
                      value={content}
                      onChange={(val) => setContent(val || '')}
                      preview="edit"
                      height={450}
                      style={{ border: '1px solid var(--border)' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">发布设置</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="状态"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
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
                    ...mockCategories.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    标签
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {mockTags.map((tag) => (
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
                  id="cover-upload-new"
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
                    htmlFor="cover-upload-new"
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
                        <Button type="button" variant="secondary" size="sm">选择图片</Button>
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
