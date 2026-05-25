'use client';

import { useMobile } from '@/hooks/useMobile';
import { useTranslation } from '@/hooks/useTranslation';

interface HeaderProps {
  onMenuToggle: () => void;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function Header({ onMenuToggle }: HeaderProps) {
  const isMobile = useMobile();
  const { t, locale, setLocale, locales } = useTranslation();
  const m = (cls: string) => (isMobile ? `${cls} ${cls}__mobile` : cls);

  const nextLocale = locales.find((l) => l !== locale)!;

  return (
    <header className={m('header')}>
      <div className="header-left">
        <button
          className={m('header-menu-btn')}
          onClick={onMenuToggle}
          aria-label={t('header.toggleMenu')}
        >
          <span className={m('hamburger-line')} />
          <span className={m('hamburger-line')} />
          <span className={m('hamburger-line')} />
        </button>
        <div className="header-search">
          <SearchIcon />
          <input
            type="text"
            placeholder={`${t('common.search')}...`}
          />
        </div>
      </div>
      <div className="header-right">
        <button
          className={m('header-lang-btn')}
          onClick={() => setLocale(nextLocale)}
          aria-label={`Switch language to ${nextLocale.toUpperCase()}`}
        >
          {nextLocale.toUpperCase()}
        </button>
        <div className="header-icon-btn">
          <BellIcon />
          <span className="notif-dot" />
        </div>
        <div className="header-avatar">AD</div>
      </div>
    </header>
  );
}
