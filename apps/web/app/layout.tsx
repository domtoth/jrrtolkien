import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ApolloWrapper } from './components/ApolloWrapper';
import { Navbar } from './components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ArdaGraph - Tolkien Knowledge Graph',
  description: 'Explore J.R.R. Tolkien\'s legendarium as an interactive knowledge graph',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </ApolloWrapper>
      </body>
    </html>
  );
}
