'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMobile } from '@/hooks/useMobile';
import { useTranslation } from '@/hooks/useTranslation';

const navItems = [
  {
    href: '/dashboard',
    labelKey: 'sidebar.dashboard',
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    href: '/dashboard/pets',
    labelKey: 'sidebar.pets',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="7" cy="10" r="2.5" />
        <circle cx="17" cy="10" r="2.5" />
        <path d="M5 14c0 3.3 2.7 6 6 6h2c3.3 0 6-2.7 6-6" />
        <path d="M12 4C9 4 8 6 8 6s1 2 4 2 4-2 4-2-1-2-4-2z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/history',
    labelKey: 'sidebar.history',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12,7 12,12 16,14" />
      </svg>
    ),
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const isMobile = useMobile();
  const { t } = useTranslation();

  const [extrasOpen, setExtrasOpen] = useState(false);
  const m = (cls: string) => (isMobile ? `${cls} ${cls}__mobile` : cls);

  return (
    <>
      {isOpen && <div className={m('sidebar-overlay')} onClick={onClose} />}
      <aside className={`${m('sidebar')} ${isOpen ? 'sidebar--open' : ''}`}>
        <div className={m('sidebar-header')}>
          <Link href="/dashboard" className="sidebar-logo">
            <span className="sidebar-logo-icon">🐾</span>
            <span className="sidebar-logo-text">{t('common.appName')}</span>
          </Link>
        </div>
        <nav className={m('sidebar-nav')}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${m('sidebar-link')} ${isActive ? 'sidebar-link--active' : ''}`}
                onClick={onClose}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
          <div className="sidebar-divider" />
          <button
            className={`${m('sidebar-link')} sidebar-link--toggle`}
            onClick={() => setExtrasOpen(!extrasOpen)}
          >
            <span className="sidebar-link-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </span>
            <span>{t('sidebar.extras')}</span>
            <span className={`sidebar-chevron ${extrasOpen ? 'sidebar-chevron--open' : ''}`}>▸</span>
          </button>
          {extrasOpen && (
            <div className="sidebar-subnav">
              <Link
                href="/dashboard/food-catalog"
                className={`${m('sidebar-link')} sidebar-link--sub ${pathname === '/dashboard/food-catalog' ? 'sidebar-link--active' : ''}`}
                onClick={onClose}
              >
                <span className="sidebar-link-icon">🍲</span>
                <span>{t('sidebar.foodCatalog')}</span>
              </Link>
              <Link
                href="/dashboard/breed-catalog"
                className={`${m('sidebar-link')} sidebar-link--sub ${pathname === '/dashboard/breed-catalog' ? 'sidebar-link--active' : ''}`}
                onClick={onClose}
              >
                <span className="sidebar-link-icon">🐾</span>
                <span>{t('sidebar.breedCatalog')}</span>
              </Link>
            </div>
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">AD</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Admin</div>
              <div className="sidebar-user-role">{t('header.user')}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
