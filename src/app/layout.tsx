import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import UserProviderWrapper from '@/components/UserProviderWrapper';

export const metadata: Metadata = {
  title: 'Display & Cell Pros LLC | Spokane On-Site Mobile Repair',
  description: 'Professional on-site mobile electronics and smartphone repair services in Spokane, Washington and Spokane Valley.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        <Script
          src="https://www.google.com/recaptcha/enterprise.js?render=6LcB60UtAAAAAEk-ADlBMnuUjbWXddXTyXLcmoSj"
          strategy="afterInteractive"
        />
        <UserProviderWrapper>
          <header className="border-b border-slate-200 bg-white shadow-xs sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-xl tracking-tight text-blue-600">Display & Cell Pros LLC</span>
                <span className="text-xs bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full hidden sm:inline-block">Spokane, WA On-Site Repair</span>
              </div>
              <nav className="flex items-center space-x-6 text-sm font-medium text-slate-600">
                <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
                <a href="#quote" className="hover:text-blue-600 transition-colors">Instant Quote</a>
                <a href="#verify" className="hover:text-blue-600 transition-colors">Secure Verification</a>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm">© {new Date().getFullYear()} Display & Cell Pros LLC. Serving Spokane, Washington & Spokane Valley.</p>
              <p className="text-xs">Protected by reCAPTCHA Enterprise.</p>
            </div>
          </footer>
        </UserProviderWrapper>
      </body>
    </html>
  );
}
