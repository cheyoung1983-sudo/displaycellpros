import type { Metadata } from 'next';
import Link from 'next/link';
import { bookingUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Display & Cell Pros for device repair support in Spokane and Spokane Valley.',
};

export default function ContactPage() {
  return (
    <section className="shell py-20">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950">Tell us what your device is doing.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Soft operations are available Thursdays and Fridays through October 1, 2026. Contact us directly, or begin a quote request with details about your device.</p>
      <div className="mt-10 grid gap-6 rounded-3xl border border-sky-100 bg-white p-8 shadow-sm sm:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Contact directly</h2>
          <a className="mt-4 block font-semibold text-blue-800 underline" href="tel:+15099036139">(509) 903-6139</a>
          <a className="mt-2 block font-semibold text-blue-800 underline" href="mailto:ryan@displaycellpros.com">ryan@displaycellpros.com</a>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Schedule an intake</h2>
          <p className="mt-3 max-w-xl leading-7 text-slate-600">Choose a time through our online scheduling calendar, or use the quote request to share details before booking.</p>
        </div>
        <a className="button-primary mt-6 w-fit" href={bookingUrl}>Schedule an intake</a>
        <Link className="button-secondary w-fit" href="/quote">Open the quote request</Link>
      </div>
    </section>
  );
}
