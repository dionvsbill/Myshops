'use client';

import {useEffect} from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Myshop runtime error:', error);
  }, [error]);

  return (
    <main className="container flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="text-3xl font-black">Something went wrong</h1>
      <p className="mt-3 max-w-lg text-slate-600">
        The store encountered an unexpected error. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white"
      >
        Try again
      </button>
    </main>
  );
}