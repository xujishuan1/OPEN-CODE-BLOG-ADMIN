import React from 'react';

interface FooterProps {
  copyright?: string;
}

export function Footer({ copyright = '博客管理团队' }: FooterProps) {
  return (
    <footer className="border-t border-border py-4">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {copyright}. All rights reserved.</p>
      </div>
    </footer>
  );
}
