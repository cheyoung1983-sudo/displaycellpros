import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="shell py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-5xl font-black tracking-tight">That page is not here.</h1>
      <p className="mx-auto mt-5 max-w-lg leading-7 text-slate-600">The page may have moved, or the address may be incomplete.</p>
      <Link className="button-primary mt-8" href="/">Return home</Link>
    </section>
  );
}
