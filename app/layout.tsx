'use client';

import './globals.css';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { StockProvider } from '@/context/StockContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  const publicPages = ['/login'];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn && !isPublicPage) {
        router.replace('/login');
        return;
      }
      if (isLoggedIn && (pathname === '/login' || pathname === '/')) {
        router.replace('/dashboard');
        return;
      }
    }
  }, [isLoggedIn, isLoading, pathname, router, isPublicPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
          <p className="text-green-700 font-semibold mt-4 text-lg">Memuat...</p>
        </div>
      </div>
    );
  }

  if (isPublicPage) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
          <p className="text-green-700 font-semibold mt-4 text-lg">Mengarahkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar />
        <main className="p-4 md:p-8 pt-16 md:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-white">
        <AuthProvider>
          <StockProvider>
            <LayoutContent>{children}</LayoutContent>
          </StockProvider>
        </AuthProvider>
      </body>
    </html>
  );
}