'use client';
import { useState } from 'react';

export default function FormSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
    setStatus(res.ok ? 'ok' : 'error');
  }
  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <input
        className="celo-border border rounded-xl px-3 sm:px-4 py-2 sm:py-3 w-full text-sm sm:text-base"
        placeholder="tu@email.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button className="rounded-xl bg-black text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap">
        Enviar
      </button>
      {status === 'ok' && <span className="text-green-700 text-xs sm:text-sm">¡Gracias!</span>}
      {status === 'error' && <span className="text-red-700 text-xs sm:text-sm">Error</span>}
    </form>
  );
}



