'use client';

import Link from 'next/link';
import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const s = createClient();
    const {error} = await s.auth.signInWithPassword({email, password});
    if (error) setMsg(error.message);
    else location.href = '/';
  };

  const google = async () => {
    const s = createClient();
    await s.auth.signInWithOAuth({provider:'google', options:{redirectTo:location.origin + '/auth/callback'}});
  };

  return (
    <div className="container max-w-md py-16">
      <h1 className="mb-6 text-3xl font-black">Sign in</h1>
      <form onSubmit={submit} className="grid gap-4">
        <input required type="email" placeholder="Email" className="rounded-xl border px-4 py-3" value={email} onChange={e=>setEmail(e.target.value)} />
        <input required type="password" placeholder="Password" className="rounded-xl border px-4 py-3" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="rounded-xl bg-slate-900 py-3 text-white">Sign in</button>
      </form>
      <button onClick={google} className="mt-3 w-full rounded-xl border py-3">Continue with Google</button>
      <p className="mt-5 text-center text-sm text-slate-600">Don't have an account? <Link className="font-bold text-slate-900 underline" href="/register">Create account</Link></p>
      {msg && <p className="mt-3 text-red-600">{msg}</p>}
    </div>
  );
}