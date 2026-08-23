import type { Metadata } from 'next';
import { ServiceCard } from '@/components/service-card';

export const metadata: Metadata = {
  title: 'Repair Services',
  description: 'Explore display and cell phone repair support from Display & Cell Pros in Spokane.',
};

export default function ServicesPage() {
  return (
    <section className="shell py-20">
      <p className="eyebrow">Services</p>
      <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950">Repair support for the devices you rely on.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">We focus on practical repair paths for common mobile-device problems, with straightforward guidance at every step.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <ServiceCard title="Display repair" description="Cracked glass, black screens, touch problems, and display issues handled with a quality-first approach." href="/services/display-repair" />
        <ServiceCard title="Cell phone repair" description="Battery, charging, camera, audio, and other phone issues assessed with clear next steps." href="/services/cell-phone-repair" />
      </div>
    </section>
  );
}
