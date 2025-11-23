"use client";
import { useState } from 'react';

type FormState = {
  name: string;
  email: string;
  idea: string;
  category: string;
  budget: string;
  urgency: string;
  details: string;
  agree: boolean;
};

const initialState: FormState = {
  name: '',
  email: '',
  idea: '',
  category: '',
  budget: '',
  urgency: '',
  details: '',
  agree: false,
};

export default function SurveyForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.idea.trim()) {
      setError('Please describe what you want.');
      return;
    }
    if (!form.agree) {
      setError('Please accept the terms.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as any)?.error || 'Failed to submit.');
      }
      setSuccess('Thanks! We received your submission.');
      setForm(initialState);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 bg-white rounded-xl shadow-sm border p-5">
      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 text-green-800 p-3">{success}</div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-800 p-3">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            value={form.name}
            onChange={e => update('name', e.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">What do you want to build?</label>
        <textarea
          value={form.idea}
          onChange={e => update('idea', e.target.value)}
          className="w-full rounded-md border px-3 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          placeholder="Describe your idea..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={form.category}
            onChange={e => update('category', e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Select...</option>
            <option>Website</option>
            <option>Mobile App</option>
            <option>AI Tool</option>
            <option>Design</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Urgency</label>
          <select
            value={form.urgency}
            onChange={e => update('urgency', e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Select...</option>
            <option>ASAP</option>
            <option>This month</option>
            <option>Next 2-3 months</option>
            <option>Just exploring</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Budget</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['< $5k', '$5k - $10k', '$10k - $25k', '$25k+'].map(b => (
            <label
              key={b}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${
                form.budget === b ? 'ring-2 ring-gray-900/10' : ''
              }`}
            >
              <input
                type="radio"
                name="budget"
                className="accent-gray-900"
                checked={form.budget === b}
                onChange={() => update('budget', b)}
              />
              <span className="text-sm">{b}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Additional details</label>
        <textarea
          value={form.details}
          onChange={e => update('details', e.target.value)}
          className="w-full rounded-md border px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          placeholder="Links, references, requirements..."
        />
      </div>

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          className="mt-1 accent-gray-900"
          checked={form.agree}
          onChange={e => update('agree', e.target.checked)}
        />
        <span className="text-sm text-gray-700">I agree to be contacted about this submission.</span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black/90 disabled:opacity-50"
      >
        {submitting ? 'Submitting?' : 'Submit'}
      </button>
    </form>
  );
}
