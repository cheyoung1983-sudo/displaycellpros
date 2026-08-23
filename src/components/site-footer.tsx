import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-slate-950 py-10 text-slate-300">
      <div className="shell grid gap-8 sm:grid-cols-2">
        <div>
          <p className="text-lg font-bold text-white">Display &amp; Cell Pros</p>
          <p className="mt-2 max-w-sm text-sm leading-6">Professional, practical mobile device repair for Spokane and Spokane Valley.</p>
          <a className="mt-4 block text-sm text-sky-300 underline" href="tel:+15099036139">(509) 903-6139</a>
          <a className="mt-1 block text-sm text-sky-300 underline" href="mailto:ryan@displaycellpros.com">ryan@displaycellpros.com</a>
        </div>
        <div className="sm:text-right">
          <p className="font-semibold text-white">Soft operations: Thursdays and Fridays through October 1, 2026</p>
          <div className="mt-3 flex gap-4 text-sm sm:justify-end">
            <Link href="/contact">Contact</Link>
            <Link href="/quote">Request a quote</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
