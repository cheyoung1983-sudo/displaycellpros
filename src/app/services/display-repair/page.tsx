import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Display Repair',
  description: 'Display repair support for cracked, unresponsive, and damaged device screens in Spokane.',
};

export default function DisplayRepairPage() {
  return (
    <section className="shell py-20">
      <p className="eyebrow">Display repair</p>
      <h1 className="mt-3 max-w-3xl text-5xl font-black tracking-tight text-slate-950">A damaged screen should not stop your day.</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="space-y-5 leading-8 text-slate-700">
          <p>Cracks, dark spots, lines, flickering, and touch issues can each point to a different repair need. Start with a quick description of the device and what you are seeing.</p>
          <p>We will help you understand the likely repair path before you move forward.</p>
        </div>
        <aside className="rounded-3xl bg-sky-100 p-7">
          <h2 className="text-xl font-bold">Common display concerns</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>Cracked or shattered glass</li>
            <li>Black, flashing, or discolored screens</li>
            <li>Unresponsive touch input</li>
            <li>Display damage after a drop</li>
          </ul>
        </aside>
      </div>
      <Link className="button-primary mt-10" href="/quote">Request a display repair quote</Link>
    </section>
  );
}
