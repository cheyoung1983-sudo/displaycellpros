import Link from 'next/link';

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
};

export function ServiceCard({ title, description, href }: ServiceCardProps) {
  return (
    <article className="rounded-3xl border border-sky-100 bg-white p-7 shadow-sm">
      <div className="mb-5 grid size-11 place-items-center rounded-2xl bg-sky-100 font-bold text-blue-800">+</div>
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <p className="mt-3 leading-7 text-slate-600">{description}</p>
      <Link className="mt-6 inline-block font-semibold text-blue-800 underline" href={href}>Explore this service</Link>
    </article>
  );
}
