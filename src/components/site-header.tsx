import Link from 'next/link';

const links = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="border-b border-sky-100 bg-white">
      <div className="shell flex min-h-20 items-center justify-between gap-6">
        <Link className="font-bold tracking-tight text-xl text-slate-950" href="/">
          Display <span className="text-blue-700">&amp;</span> Cell Pros
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-5 text-sm font-semibold md:flex">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <Link className="button-primary text-sm" href="/quote">Request a quote</Link>
      </div>
    </header>
  );
}
