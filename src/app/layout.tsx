import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevSphere | Smart Code Compiler',
  description: 'AI-powered collaborative code compiler',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
