import React from 'react';

interface FooterProps {
  copyright?: string;
}

export function Footer({ copyright = '我的博客' }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-lg font-semibold text-slate-900">
            {copyright}
          </div>
          
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">首页</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">关于</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">文章</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">联系</a>
          </nav>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} 保留所有权利
          </p>
        </div>
      </div>
    </footer>
  );
}
