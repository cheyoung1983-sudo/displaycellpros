import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn how Display & Cell Pros approaches mobile device repair in Spokane and Spokane Valley.',
};

export default function AboutPage() {
  return (
    <section className="shell py-20">
      <p className="eyebrow">About Display &amp; Cell Pros</p>
      <h1 className="mt-3 max-w-3xl text-5xl font-black tracking-tight text-slate-950">Clear communication is part of a good repair.</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-5 leading-8 text-slate-700">
          <p>Display &amp; Cell Pros serves Spokane and Spokane Valley with practical, people-first support for everyday mobile device issues.</p>
          <p>Our goal is simple: help you understand what is wrong, what can be done, and what your next step looks like before you make a repair decision.</p>
        </div>
        <div className="rounded-3xl bg-[var(--mint)] p-8">
          <h2 className="text-xl font-bold">What to expect</h2>
          <ul className="mt-5 space-y-3 text-slate-700">
            <li><strong>Clear answers.</strong> Plain-language guidance, without unnecessary jargon.</li>
            <li><strong>Respect for your time.</strong> A practical path toward getting your device working again.</li>
            <li><strong>Local service.</strong> Support centered on Spokane and Spokane Valley.</li>
          </ul>
        </div>
      </div>
      <Link className="button-primary mt-10" href="/contact">Start a conversation</Link>
    </section>
  );
}
