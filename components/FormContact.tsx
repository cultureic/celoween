'use client';
import { useState } from 'react';
import FormField from './FormField';

export default function FormContact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify({ name, email, message }) });
    setStatus(res.ok ? 'ok' : 'error');
  }
  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:gap-4">
      <FormField label="Nombre">
        <input 
          className="celo-border border rounded-xl px-3 sm:px-4 py-2 sm:py-3 w-full text-sm sm:text-base" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </FormField>
      <FormField label="Email">
        <input 
          className="celo-border border rounded-xl px-3 sm:px-4 py-2 sm:py-3 w-full text-sm sm:text-base" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </FormField>
      <FormField label="Mensaje">
        <textarea 
          className="celo-border border rounded-xl px-3 sm:px-4 py-2 sm:py-3 w-full text-sm sm:text-base resize-none" 
          rows={4} 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
        />
      </FormField>
      <button className="rounded-xl bg-black text-white px-4 sm:px-6 py-2 sm:py-3 w-fit text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors duration-200">
        Enviar
      </button>
      {status === 'ok' && <span className="text-green-700 text-xs sm:text-sm">Recibido</span>}
      {status === 'error' && <span className="text-red-700 text-xs sm:text-sm">Error</span>}
    </form>
  );
}



