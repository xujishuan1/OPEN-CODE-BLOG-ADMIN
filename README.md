# 博客管理系统 (Blog Admin)

一个功能完善的博客网站管理系统，基于 Next.js 14 构建。

## 功能特性

- **文章管理**: 创建、编辑、删除、发布文章
- **分类标签**: 灵活的文章分类和标签系统
- **用户评论**: 读者评论与互动功能
- **主题切换**: 支持浅色/深色主题
- **响应式设计**: 完美适配桌面端和移动端

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Context (状态管理)

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
OPEN-CODE-BLOG-ADMIN/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # 认证相关页面
│   │   ├── (dashboard)/   # 管理后台
│   │   └── api/            # API路由
│   ├── components/         # React组件
│   │   ├── ui/             # 基础UI组件
│   │   ├── layout/         # 布局组件
│   │   └── features/      # 功能组件
│   ├── hooks/              # 自定义Hooks
│   ├── lib/                # 工具函数
│   ├── services/           # API服务
│   └── types/              # TypeScript类型
├── Skills/                 # UI/UX Pro Max 设计规范
├── AGENTS.md              # AI代理规范
└── README.md              # 项目说明
```

## 设计规范

本项目使用 **UI/UX Pro Max** 进行设计决策。在进行UI/UX相关开发时，请参考：

- 技能路径: `Skills/ui-ux-pro-max`
- 详细文档: `Skills/SKILL.md`

### 生成设计系统

```bash
python3 Skills/ui-ux-pro-max/scripts/search.py "博客 内容创作 现代简约" --design-system -p "博客管理系统" --persist
```

### 设计原则优先级

1. **无障碍访问 (CRITICAL)**: 颜色对比度4.5:1、键盘导航、ARIA标签
2. **触摸与交互 (CRITICAL)**: 最小触摸区域44x44px、加载反馈
3. **性能优化 (HIGH)**: WebP图片、懒加载、CLS控制
4. **样式选择 (HIGH)**: 风格一致性、SVG图标
5. **布局与响应式 (HIGH)**: 移动优先、断点系统

## API 交互规范

详见 [API.md](./API.md)

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -m 'feat: 添加新功能'`)
4. 推送分支 (`git push origin feature/xxx`)
5. 提交 Pull Request

## 许可证

MIT License
