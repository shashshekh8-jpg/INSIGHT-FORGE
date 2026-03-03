import './globals.css';
import { InsightOmnibar } from '@/components/shared/InsightOmnibar';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white h-screen overflow-hidden flex flex-col">
        <header className="absolute top-0 w-full p-4 z-50">
          <Breadcrumbs />
        </header>
        <main className="flex-grow relative">
          {children}
        </main>
        <footer className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl z-50">
          <InsightOmnibar />
        </footer>
      </body>
    </html>
  );
}
