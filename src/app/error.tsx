'use client';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="shell py-28 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-3 text-5xl font-black tracking-tight">Please try again.</h1>
      <p className="mx-auto mt-5 max-w-lg leading-7 text-slate-600">We could not complete that request. Try again, or return to the homepage.</p>
      <button className="button-primary mt-8" onClick={reset} type="button">Try again</button>
    </section>
  );
}
