'use client';

import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useMobile } from '@/hooks/useMobile';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobile();

  const m = (cls: string) => isMobile ? `${cls} ${cls}__mobile` : cls;

  return (
    <div className={m('app-layout')}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={m('main-area')}>
        <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <main className={m('main-content')}>{children}</main>
      </div>
    </div>
  );
}
