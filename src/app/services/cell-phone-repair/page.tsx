import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cell Phone Repair',
  description: 'Cell phone repair support for battery, charging, camera, and audio issues in Spokane.',
};

export default function CellPhoneRepairPage() {
  return (
    <section className="shell py-20">
      <p className="eyebrow">Cell phone repair</p>
      <h1 className="mt-3 max-w-3xl text-5xl font-black tracking-tight text-slate-950">Get practical help for the phone problems that slow you down.</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="space-y-5 leading-8 text-slate-700">
          <p>From batteries that drain too quickly to a port that no longer charges, we focus on explaining the issue in plain language and identifying a realistic repair option.</p>
          <p>Share your device model and symptoms to begin the conversation.</p>
        </div>
        <aside className="rounded-3xl bg-[var(--warm)] p-7">
          <h2 className="text-xl font-bold">Common phone concerns</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>Battery life and unexpected shutdowns</li>
            <li>Charging port problems</li>
            <li>Camera, speaker, and microphone issues</li>
            <li>Damage from drops or moisture</li>
          </ul>
        </aside>
      </div>
      <Link className="button-primary mt-10" href="/quote">Request a phone repair quote</Link>
    </section>
  );
}
