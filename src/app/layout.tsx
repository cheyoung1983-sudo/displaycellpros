import type { Metadata } from 'next';
import './globals.css';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

const siteUrl = 'https://www.displaycellpros.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Display & Cell Pros | Mobile Device Repair in Spokane',
    template: '%s | Display & Cell Pros',
  },
  description: 'Straightforward, on-site device repair for screens, batteries, charging ports, and more in Spokane and Spokane Valley.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Display & Cell Pros',
    url: siteUrl,
    title: 'Display & Cell Pros | Mobile Device Repair in Spokane',
    description: 'On-site mobile device repair for Spokane and Spokane Valley.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
