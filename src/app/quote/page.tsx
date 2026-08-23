import type { Metadata } from 'next';
import { QuoteForm } from './quote-form';
import { bookingUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Request a Quote',
  description: 'Describe your device repair needs to start a quote request with Display & Cell Pros.',
};

export default function QuotePage() {
  return (
    <section className="shell py-20">
      <p className="eyebrow">Request a quote</p>
      <h1 className="mt-3 max-w-3xl text-5xl font-black tracking-tight text-slate-950">A better repair conversation starts with the details.</h1>
      <p className="mt-6 max-w-2xl leading-8 text-slate-600">Schedule a repair intake online, or tell us what device you have and the issue you are seeing before booking.</p>
      <a className="button-primary mt-8" href={bookingUrl}>Schedule an intake</a>
      <QuoteForm />
    </section>
  );
}
