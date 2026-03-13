# API 交互规范标准

## 概述

本文档定义了博客管理系统的API接口规范，包括请求格式、响应结构、错误处理等。

## 基础信息

- **Base URL**: `/api`
- **数据格式**: JSON
- **认证方式**: JWT Token

## 通用约定

### 请求头

```
Content-Type: application/json
Authorization: Bearer <token>
```

### 响应格式

**成功响应:**
```json
{
  "success": true,
  "data": {
    // 业务数据
  },
  "message": "操作成功"
}
```

**错误响应:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 文章接口

### 获取文章列表

**GET** `/api/articles`

**查询参数:**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认10 |
| category | string | 否 | 分类ID |
| tag | string | 否 | 标签ID |
| status | string | 否 | 状态: draft/published |

**响应示例:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "1",
        "title": "文章标题",
        "slug": "article-slug",
        "excerpt": "文章摘要",
        "cover": "/images/cover.jpg",
        "status": "published",
        "category": { "id": "1", "name": "技术" },
        "tags": [{ "id": "1", "name": "React" }],
        "author": { "id": "1", "name": "作者" },
        "publishedAt": "2024-01-01T00:00:00Z",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

### 获取文章详情

**GET** `/api/articles/:id`

**响应示例:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "文章标题",
    "slug": "article-slug",
    "content": "文章内容(Markdown)",
    "excerpt": "文章摘要",
    "cover": "/images/cover.jpg",
    "status": "published",
    "category": { "id": "1", "name": "技术" },
    "tags": [{ "id": "1", "name": "React" }],
    "author": { "id": "1", "name": "作者" },
    "viewCount": 100,
    "likeCount": 10,
    "commentCount": 5,
    "publishedAt": "2024-01-01T00:00:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 创建文章

**POST** `/api/articles`

**请求体:**
```json
{
  "title": "文章标题",
  "slug": "article-slug",
  "content": "文章内容",
  "excerpt": "文章摘要",
  "cover": "/images/cover.jpg",
  "categoryId": "1",
  "tagIds": ["1", "2"],
  "status": "draft"
}
```

### 更新文章

**PUT** `/api/articles/:id`

**请求体:** 同创建文章

### 删除文章

**DELETE** `/api/articles/:id`

---

## 分类接口

### 获取分类列表

**GET** `/api/categories`

**响应示例:**
```json
{
  "success": true,
  "data": [
    { "id": "1", "name": "技术", "slug": "tech", "count": 10 },
    { "id": "2", "name": "生活", "slug": "life", "count": 5 }
  ]
}
```

### 创建分类

**POST** `/api/categories`

**请求体:**
```json
{
  "name": "分类名称",
  "slug": "category-slug",
  "description": "分类描述"
}
```

### 更新分类

**PUT** `/api/categories/:id`

### 删除分类

**DELETE** `/api/categories/:id`

---

## 标签接口

### 获取标签列表

**GET** `/api/tags`

**响应示例:**
```json
{
  "success": true,
  "data": [
    { "id": "1", "name": "React", "slug": "react", "count": 15 },
    { "id": "2", "name": "TypeScript", "slug": "typescript", "count": 8 }
  ]
}
```

### 创建标签

**POST** `/api/tags`

**请求体:**
```json
{
  "name": "标签名称",
  "slug": "tag-slug"
}
```

### 删除标签

**DELETE** `/api/tags/:id`

---

## 评论接口

### 获取评论列表

**GET** `/api/comments`

**查询参数:**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| articleId | string | 否 | 文章ID |
| status | string | 否 | 状态: pending/approved/spam |

### 创建评论

**POST** `/api/comments`

**请求体:**
```json
{
  "articleId": "1",
  "content": "评论内容",
  "author": {
    "name": "评论者名称",
    "email": "评论者邮箱",
    "url": "评论者网站"
  }
}
```

### 审核评论

**PUT** `/api/comments/:id`

**请求体:**
```json
{
  "status": "approved"
}
```

### 删除评论

**DELETE** `/api/comments/:id`

---

## 用户接口

### 用户登录

**POST** `/api/auth/login`

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "1",
      "name": "管理员",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

### 获取当前用户

**GET** `/api/auth/me`

### 用户登出

**POST** `/api/auth/logout`

---

## 公共接口

### 获取网站信息

**GET** `/api/site`

**响应示例:**
```json
{
  "success": true,
  "data": {
    "name": "博客名称",
    "description": "博客描述",
    "logo": "/images/logo.png",
    "theme": "light"
  }
}
```

### 主题切换

**PUT** `/api/site/theme`

**请求体:**
```json
{
  "theme": "dark"
}
```

---

## 错误代码

| 错误码 | 说明 |
|--------|------|
| INVALID_PARAMS | 请求参数错误 |
| UNAUTHORIZED | 未登录或Token无效 |
| FORBIDDEN | 无权限访问 |
| NOT_FOUND | 资源不存在 |
| SERVER_ERROR | 服务器内部错误 |

---

## 分页规范

列表接口采用分页返回，响应中包含：

```json
{
  "items": [],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

---

## 安全考虑

1. 所有敏感接口需要认证
2. 密码使用哈希存储
3. API请求需要Token验证
4. 防止SQL注入和XSS攻击
5. 敏感操作需要日志记录
