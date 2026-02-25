"use client";

import dynamic from "next/dynamic";

import UsgsSnapshot from "@/components/UsgsSnapshot";

const WaterMap = dynamic(() => import("@/components/WaterMap"), {
  ssr: false,
  loading: () => <div className="h-[460px] w-full animate-pulse rounded-md bg-slate-200" />,
});

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold text-slate-900">CNO Water Data Hub</h1>
      <p className="text-sm text-slate-700">
        Initial Phase 1 foundation: CNO boundary mapping, USGS proxy API, and
        ingestion job skeleton for Railway/Supabase Postgres.
      </p>

      <UsgsSnapshot />

      <section className="rounded-md border border-slate-200 bg-white p-2 shadow-sm">
        <WaterMap />
      </section>
    </main>
  );
}
