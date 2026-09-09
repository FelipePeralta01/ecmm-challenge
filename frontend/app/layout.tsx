'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <html lang="es">
      <head>
        <title>Catálogo de Productos | ECMM Challenge</title>
        <meta name="description" content="Administración de catálogo de productos - Django & Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
        <QueryClientProvider client={queryClient}>
          <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-sm">
                  CP
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    Catálogo de Productos
                  </h1>
                  <p className="text-xs text-slate-500">Prueba Técnica Fullstack</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs font-medium text-slate-600 bg-slate-100 py-1.5 px-3 rounded-full border border-slate-200">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Django API (8000)</span>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
              Desafío Fullstack — Django REST Framework & Next.js & Tailwind CSS
            </div>
          </footer>
        </QueryClientProvider>
      </body>
    </html>
  );
}