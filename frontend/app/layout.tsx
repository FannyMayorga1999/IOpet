import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
