import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DevSphere — Code faster. Debug smarter. Build better.',
  description: 'The next-generation cloud compiler built for the editorial engineer. Experience speed, precision, and the power of AI-driven development.',
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
