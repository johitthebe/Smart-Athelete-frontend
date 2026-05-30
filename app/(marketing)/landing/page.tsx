"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <section className="relative overflow-hidden pt-28 pb-20 px-6 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute -left-20 top-4 h-72 w-72 rounded-full bg-[#2E6BE6]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-12 h-72 w-72 rounded-full bg-[#00C2A8]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2E6BE6]/25 bg-[#2E6BE6]/10 px-4 py-2 text-[11px] uppercase tracking-[3px] text-[#A8C7FF]">
              Built for focused athletes
            </span>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              One place for your training, recovery, and coach feedback.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Smart Athlete helps you organize every session, see what matters, and keep your training on track without extra noise.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-full bg-[#2E6BE6] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2E6BE6]/20 transition hover:bg-[#1b57d1]"
              >
                Create account
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full border border-[#2E6BE6]/25 bg-white/5 px-7 py-3 text-sm font-semibold text-slate-100 transition hover:border-[#2E6BE6]/50 hover:bg-white/10"
              >
                Login
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-[11px] uppercase tracking-[2px] text-slate-400">Weekly distance</p>
                <p className="mt-3 text-3xl font-semibold text-white">42 km</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-[11px] uppercase tracking-[2px] text-slate-400">Goal progress</p>
                <p className="mt-3 text-3xl font-semibold text-white">+12%</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-[11px] uppercase tracking-[2px] text-slate-400">Coach network</p>
                <p className="mt-3 text-3xl font-semibold text-white">500+</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
              <p className="text-[11px] uppercase tracking-[3px] text-[#94a3b8]">Weekly review</p>
              <div className="mt-5 flex items-end gap-3">
                <div>
                  <p className="font-['Bebas_Neue'] text-5xl text-white">42</p>
                  <p className="text-sm text-slate-400">km this week</p>
                </div>
                <div className="rounded-full bg-[#0b1430] px-3 py-1 text-xs uppercase tracking-[2px] text-[#00C2A8]">
                  +12%
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Run', value: '85%', color: '#2E6BE6' },
                  { label: 'Swim', value: '72%', color: '#00C2A8' },
                  { label: 'Lift', value: '65%', color: '#F59E0B' },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl bg-white/5 p-4">
                    <p className="text-[11px] uppercase tracking-[2px] text-slate-400">{item.label}</p>
                    <p className="mt-3 text-2xl font-semibold" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.75rem] bg-[#0f172a]/80 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[2px] text-slate-400">Recommended</p>
                    <p className="mt-2 text-white">Add a recovery day on Sunday to keep momentum strong.</p>
                  </div>
                  <div className="rounded-full border border-[#00C2A8]/20 bg-[#00C2A8]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[2px] text-[#00C2A8]">
                    Recovery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#061127] py-16 px-6 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-3">
          {[
            { value: '10K+', label: 'Athletes training worldwide' },
            { value: '95%', label: 'Success rate for plans' },
            { value: '500+', label: 'Coaches available now' },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-4xl font-semibold text-white">{item.value}</p>
              <p className="mt-3 text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-20 px-6 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-0.5 w-12 bg-[#2E6BE6]"></div>
            <span className="text-[11px] font-semibold uppercase tracking-[4px] text-[#2E6BE6]">Features</span>
          </div>
          <h2 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Everything you need to stay consistent and improve steadily.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'Session logging', description: 'Record workouts, notes, and key metrics in seconds.', accent: 'from-[#0d1e3d] to-[#1a3a6e]' },
              { title: 'Coach review', description: 'Share progress with your coach and get feedback fast.', accent: 'from-[#081f24] to-[#0f4a52]' },
              { title: 'Recovery tracking', description: 'See rest, sleep, and readiness in one place.', accent: 'from-[#241b0a] to-[#4a3817]' },
              { title: 'Performance charts', description: 'Compare your training trends week after week.', accent: 'from-[#1b243a] to-[#2e3d5e]' },
            ].map((item) => (
              <div key={item.title} className={`rounded-[2rem] border border-white/10 bg-gradient-to-br ${item.accent} p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]`}>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="coaches" className="py-20 px-6 sm:px-8 lg:px-10 bg-[#050B1F]">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-0.5 w-12 bg-[#2E6BE6]"></div>
            <span className="text-[11px] font-semibold uppercase tracking-[4px] text-[#2E6BE6]">Coaches</span>
          </div>
          <h2 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Trusted coaches with real sports experience.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: 'Mike Johnson', role: 'Running coach', rating: '4.9', label: 'MJ', color: '#1F4787' },
              { name: 'Sarah Chen', role: 'Swimming coach', rating: '5.0', label: 'SC', color: '#2E6BE6' },
              { name: 'Alex Rivera', role: 'Cycling coach', rating: '4.8', label: 'AR', color: '#00C2A8' },
            ].map((coach) => (
              <div key={coach.name} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center transition hover:-translate-y-1 hover:border-[#2E6BE6]/40 hover:bg-[#2E6BE6]/[0.06]">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: coach.color }}>
                  <span className="text-3xl font-bold text-white">{coach.label}</span>
                </div>
                <h3 className="text-xl font-semibold text-white">{coach.name}</h3>
                <p className="mt-2 text-sm uppercase tracking-[2px] text-[#2E6BE6]">{coach.role}</p>
                <p className="mt-4 text-sm leading-6 text-slate-300">Delivers personalized progress plans, honest feedback, and training structure you can trust.</p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-[#F59E0B]">
                  ★ {coach.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-0.5 w-12 bg-[#00C2A8]"></div>
            <span className="text-[11px] font-semibold uppercase tracking-[4px] text-[#00C2A8]">Performance</span>
          </div>
          <h2 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Practical insights that help you plan the next week.
          </h2>

          <div className="mt-12 rounded-[2rem] border border-white/10 bg-[#080D1A] shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#2E6BE6]/[0.08] px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#E63946]"></div>
                <div className="h-3 w-3 rounded-full bg-[#F59E0B]"></div>
                <div className="h-3 w-3 rounded-full bg-[#22C55E]"></div>
              </div>
              <span className="text-[11px] uppercase tracking-[2px] text-slate-400">Weekly summary</span>
            </div>
            <div className="p-6 font-['JetBrains_Mono'] text-sm leading-7 text-slate-300">
              <div className="text-[#4B6AAA]">// Training trend</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[2px] text-slate-400">Distance</p>
                  <p className="mt-3 text-2xl font-semibold text-white">42 km</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[2px] text-slate-400">Consistency</p>
                  <p className="mt-3 text-2xl font-semibold text-white">5 sessions</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[2px] text-slate-400">Focus</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Recovery</p>
                </div>
              </div>
              <div className="mt-6 rounded-[1.75rem] bg-[#0F172A]/80 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[2px] text-slate-400">Next action</p>
                    <p className="mt-2 text-white">Add a lighter session tomorrow and keep your weekend recovery window open.</p>
                  </div>
                  <div className="rounded-full bg-[#00C2A8]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[2px] text-[#00C2A8]">
                    Suggested
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6 sm:px-8 lg:px-10 bg-[#0B214C] overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(0,194,168,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Ready to make every session count?
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-300">
            Join athletes and coaches who use Smart Athlete to stay focused, recover better, and improve more consistently.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="mx-auto mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[#2E6BE6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1b57d1]"
            >
              Get updates
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
