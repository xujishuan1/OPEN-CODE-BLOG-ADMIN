# 博客管理系统 - AI代理规范

## 项目概述

本项目是一个功能完善的博客网站管理系统，提供文章管理、分类标签、用户评论、主题切换等核心功能。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI组件库**: Tailwind CSS + 自定义组件
- **状态管理**: React Context + Hooks
- **API通信**: RESTful API
- **设计规范**: 参考 Skills/ui-ux-pro-max

## AI代理职责

### 1. 前端开发代理
- 负责页面组件开发
- 遵循UI/UX Pro Max设计规范
- 实现响应式布局和交互效果

### 2. 后端开发代理
- API接口开发
- 数据库设计
- 业务逻辑实现

### 3. 代码审查代理
- 检查代码质量
- 确保遵循项目规范
- 提出优化建议

## 设计决策流程

当需要进行UI/UX设计决策时，必须使用 `Skills/ui-ux-pro-max` 工具：

### 步骤1: 生成设计系统
```bash
python3 Skills/ui-ux-pro-max/scripts/search.py "博客 内容创作 现代简约" --design-system -p "博客管理系统" --persist
```

### 步骤2: 获取详细规范
根据需要查询特定领域：
- 样式风格: `--domain style`
- 颜色方案: `--domain color`
- 字体排版: `--domain typography`
- 用户体验: `--domain ux`

### 步骤3: 应用设计规范
在实现代码时，必须遵循以下优先规则：
1. 无障碍访问 (CRITICAL)
2. 触摸与交互 (CRITICAL)
3. 性能优化 (HIGH)
4. 样式选择 (HIGH)
5. 布局与响应式 (HIGH)

## 代码规范

### 命名规范
- 组件使用 PascalCase
- 函数使用 camelCase
- 常量使用 UPPER_SNAKE_CASE
- 文件使用 kebab-case

### 目录结构
```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/         # 认证相关页面
│   ├── (dashboard)/   # 管理后台
│   └── api/            # API路由
├── components/         # React组件
│   ├── ui/             # 基础UI组件
│   ├── layout/         # 布局组件
│   └── features/      # 功能组件
├── hooks/              # 自定义Hooks
├── lib/                # 工具函数
├── services/           # API服务
└── types/              # TypeScript类型
```

### 提交规范
```
feat: 新功能
fix: 错误修复
docs: 文档更新
style: 样式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具
```

## 质量检查清单

在提交代码前，必须确认：

### UI/UX检查
- [ ] 颜色对比度满足4.5:1
- [ ] 触摸目标最小44x44px
- [ ] 支持暗色模式
- [ ] 响应式布局正常
- [ ] 动画时长在150-300ms

### 代码质量
- [ ] TypeScript类型完整
- [ ] 无console错误
- [ ] 组件正确解耦
- [ ] 遵循单一职责

### 性能优化
- [ ] 图片使用WebP格式
- [ ] 懒加载非关键资源
- [ ] 代码分割合理

## 技能引用

本项目使用 UI/UX Pro Max 进行设计决策：
- 技能路径: `Skills/ui-ux-pro-max`
- 文档: `Skills/SKILL.md`
- 数据: `Skills/data/`

## 联系方式

项目维护者: 博客管理团队
