'use client';

import { FormEvent, useState } from 'react';

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8" role="status">
        <h2 className="text-2xl font-bold text-slate-950">Thanks for the details.</h2>
        <p className="mt-3 leading-7 text-slate-700">Your request has been prepared for this preview. Secure quote delivery will be added in a later phase, so no information has been sent or stored yet.</p>
        <button className="button-secondary mt-6" onClick={() => setSubmitted(false)} type="button">Start another request</button>
      </div>
    );
  }

  return (
    <form className="mt-10 grid gap-6 rounded-3xl border border-sky-100 bg-white p-7 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="grid gap-2 font-semibold">Your name<input className="rounded-xl border border-slate-300 px-4 py-3 font-normal" name="name" required /></label>
        <label className="grid gap-2 font-semibold">Preferred contact<input className="rounded-xl border border-slate-300 px-4 py-3 font-normal" name="contact" required /></label>
      </div>
      <label className="grid gap-2 font-semibold">Device type<input className="rounded-xl border border-slate-300 px-4 py-3 font-normal" name="device" placeholder="For example, iPhone 15 or Samsung Galaxy" required /></label>
      <label className="grid gap-2 font-semibold">What is happening?<textarea className="min-h-32 rounded-xl border border-slate-300 px-4 py-3 font-normal" name="issue" required /></label>
      <p className="text-sm leading-6 text-slate-500">This preview does not send or retain your information.</p>
      <button className="button-primary w-fit" type="submit">Prepare my request</button>
    </form>
  );
}
