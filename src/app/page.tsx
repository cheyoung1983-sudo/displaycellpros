import Link from 'next/link';
import { ServiceCard } from '@/components/service-card';
import { bookingUrl } from '@/lib/site';

const checkoutCategories = [
  { number: '01', title: 'Display repair', detail: 'Cracked glass, touch issues, black screens, and display damage.', href: '/services/display-repair' },
  { number: '02', title: 'Power and charging', detail: 'Battery, charging port, and power-related repair concerns.', href: '/services/cell-phone-repair' },
  { number: '03', title: 'Device assessment', detail: 'Not sure what is wrong? Start with a clear repair conversation.', href: '/quote' },
];

export default function HomePage() {
  return (
    <>
      <section className="overflow-hidden bg-slate-950 py-16 text-white sm:py-24">
        <div className="shell grid items-center gap-14 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-xs font-bold tracking-[0.16em] text-sky-200">SPOKANE AND SPOKANE VALLEY</p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight sm:text-7xl">Device repair with a simpler path to <span className="text-sky-300">getting back to normal.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Choose the repair you need, complete checkout, then reserve the intake time that works for you.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a className="button-primary bg-sky-300 text-slate-950 hover:bg-sky-200" href="#checkout">Choose a repair</a>
              <a className="button-secondary border-slate-600 text-white hover:bg-slate-800" href={bookingUrl}>Schedule an intake</a>
            </div>
            <p className="mt-6 text-sm text-slate-400">Soft operations: Thursdays and Fridays through October 1, 2026.</p>
          </div>

          <aside className="relative rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
            <div className="absolute -right-10 -top-10 size-36 rounded-full bg-sky-400/25 blur-3xl" />
            <p className="text-sm font-bold text-sky-300">The repair flow</p>
            <ol className="relative mt-7 space-y-6">
              <li className="flex gap-4"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-sky-300 font-black text-slate-950">1</span><div><strong>Choose your service</strong><p className="mt-1 text-sm leading-6 text-slate-300">Select the repair that matches your device concern.</p></div></li>
              <li className="flex gap-4"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-sky-300 font-black text-slate-950">2</span><div><strong>Complete checkout</strong><p className="mt-1 text-sm leading-6 text-slate-300">Your service checkout confirms the repair path.</p></div></li>
              <li className="flex gap-4"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-sky-300 font-black text-slate-950">3</span><div><strong>Book your intake</strong><p className="mt-1 text-sm leading-6 text-slate-300">Choose an available time through our scheduling calendar.</p></div></li>
            </ol>
          </aside>
        </div>
      </section>

      <section className="shell py-20" id="checkout">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Step 1: choose a repair</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Start your repair checkout.</h2>
            <p className="mt-4 leading-7 text-slate-600">Select the repair category that best matches your device. Individual checkout buttons are being added here next.</p>
          </div>
          <Link className="font-bold text-blue-800 underline" href="/services">Compare all services</Link>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {checkoutCategories.map((category) => (
            <article className="group rounded-[2rem] border border-sky-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg" key={category.title}>
              <p className="font-mono text-sm font-bold text-blue-700">{category.number}</p>
              <h3 className="mt-7 text-2xl font-black text-slate-950">{category.title}</h3>
              <p className="mt-3 min-h-14 leading-7 text-slate-600">{category.detail}</p>
              <Link className="button-primary mt-7 w-full" href={category.href}>View repair options</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-sky-50 py-20">
        <div className="shell grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <p className="eyebrow">Need help deciding?</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Start with the symptom you can see.</h2>
            <p className="mt-5 leading-8 text-slate-600">A cracked display, weak battery, or unreliable charging port each needs a different repair path. Tell us what is happening and we will help you choose.</p>
            <Link className="button-secondary mt-7" href="/quote">Describe your device issue</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <ServiceCard title="Display repair" description="Clear, responsive screen replacements for cracked, flickering, or unresponsive displays." href="/services/display-repair" />
            <ServiceCard title="Cell phone repair" description="Practical support for batteries, charging ports, cameras, speakers, and more." href="/services/cell-phone-repair" />
          </div>
        </div>
      </section>

      <section className="shell py-20">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#0d4f8b_0%,#10233d_62%,#1a365d_100%)] p-8 text-white sm:p-12">
          <p className="eyebrow text-sky-200">Ready to schedule?</p>
          <div className="mt-3 flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div><h2 className="max-w-2xl text-4xl font-black tracking-tight">Book an intake when you are ready to move forward.</h2><p className="mt-3 text-sky-100">You can also call <a className="font-bold underline" href="tel:+15099036139">(509) 903-6139</a> for direct help.</p></div>
            <a className="button-primary shrink-0 bg-sky-300 text-slate-950 hover:bg-sky-200" href={bookingUrl}>Open scheduling</a>
          </div>
        </div>
      </section>
    </>
  );
}
