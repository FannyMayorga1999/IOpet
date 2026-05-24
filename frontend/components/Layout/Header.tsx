'use client';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="header">
      <button className="header-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>
      <div className="header-title">
        <h1>ioPet</h1>
      </div>
      <div className="header-actions">
        <span className="header-user">Admin</span>
      </div>
    </header>
  );
}
