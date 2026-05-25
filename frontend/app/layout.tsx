import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/contexts/I18nContext';

export const metadata: Metadata = {
  title: 'ioPet - Pet Management Platform',
  description: 'Modern platform for managing your pets and feeding schedules',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
