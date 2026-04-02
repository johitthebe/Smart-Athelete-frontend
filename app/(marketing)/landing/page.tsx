"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter signup:", email);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F1E]/92 backdrop-blur-md border-b border-[#2E6BE6]/15">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Image src="/logo.svg" alt="Smart Athlete Logo" width={60} height={60} className="w-15 h-15" />
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white/65 hover:text-white transition-colors relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E6BE6] group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#coaches" className="text-white/65 hover:text-white transition-colors relative group">
                Coaches
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E6BE6] group-hover:w-full transition-all duration-300"></span>
              </a>
              <Link href="/auth/login" className="text-white/65 hover:text-white transition-colors relative group">
                Sign In
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E6BE6] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            {/* CTA Button */}
            <Link 
              href="/auth/signup"
              className="bg-[#2E6BE6] text-white px-6 py-2.5 rounded-[3px] font-bold text-sm uppercase tracking-wider hover:bg-[#1a58d4] transition-colors"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 bg-[#2E6BE6]/10 border border-[#2E6BE6]/30 px-4 py-2 rounded-sm mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C2A8] animate-pulse"></span>
              <span className="text-[#2E6BE6] text-[11px] font-bold uppercase tracking-[3px]">
                AI-Powered Training
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-['Bebas_Neue'] text-6xl md:text-7xl lg:text-8xl text-white mb-6 tracking-wider">
              Train Smarter,
              <br />
              <span className="text-[#2E6BE6]">Achieve More</span>
            </h1>

            <p className="text-[#8898B4] text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Track your performance, get AI-powered insights, and connect with expert coaches
              to reach your athletic goals faster.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="bg-[#2E6BE6] text-white px-8 py-4 rounded-[3px] font-bold text-sm uppercase tracking-wider hover:bg-[#1a58d4] transition-all"
              >
                Start Free Trial
              </Link>
              <Link
                href="/auth/login"
                className="border-2 border-[#2E6BE6] text-[#2E6BE6] px-8 py-4 rounded-[3px] font-bold text-sm uppercase tracking-wider hover:bg-[#2E6BE6]/10 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Hero Dashboard Card */}
          <div className="relative max-w-4xl mx-auto">
            {/* Floating Notification Pills */}
            <div className="absolute -left-4 top-20 bg-[#0A0F1E]/95 backdrop-blur-md border border-[#00C2A8]/30 rounded-lg p-4 animate-float z-10 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#22C55E]/15 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#22C55E] font-bold text-xs">New Personal Best!</p>
                  <p className="text-[#8898B4] text-[10px]">5K — 24:38 min</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-20 bg-[#0A0F1E]/95 backdrop-blur-md border border-[#00C2A8]/30 rounded-lg p-4 animate-float-delayed z-10 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#2E6BE6]/15 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#2E6BE6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-xs">Coach Mike replied</p>
                  <p className="text-[#8898B4] text-[10px]">2 minutes ago</p>
                </div>
              </div>
            </div>

            {/* Main Dashboard Card */}
            <div className="bg-white/[0.04] border border-[#2E6BE6]/20 rounded-xl backdrop-blur-md p-8">
              <p className="text-[#8898B4] text-[11px] font-bold uppercase tracking-[3px] mb-2">
                This Week
              </p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-['Bebas_Neue'] text-6xl text-white">42</span>
                <span className="font-['Bebas_Neue'] text-3xl text-[#2E6BE6]">km</span>
              </div>
              <p className="text-[#8898B4] text-xs mb-6">+12% from last week</p>
              
              {/* Bar Chart */}
              <div className="flex items-end justify-between gap-2 h-32 mb-6">
                {[
                  { day: 'Mon', height: 85, active: true },
                  { day: 'Tue', height: 65, active: true },
                  { day: 'Wed', height: 95, active: true },
                  { day: 'Thu', height: 75, active: true },
                  { day: 'Fri', height: 88, active: true },
                  { day: 'Sat', height: 40, active: false },
                  { day: 'Sun', height: 30, active: false },
                ].map((item, i) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className={`w-full rounded-t-sm transition-all ${
                        item.active 
                          ? i === 2 ? 'bg-[#00C2A8]' : 'bg-[#2E6BE6]'
                          : 'bg-[#2E6BE6]/25 border border-[#2E6BE6]/25'
                      }`} 
                      style={{ height: `${item.height}%` }}
                    ></div>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#8898B4]">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* AI Recommendation Strip */}
              <div className="bg-[#00C2A8]/[0.07] border border-[#00C2A8]/20 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00C2A8]/15 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#00C2A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-white text-sm">Add a recovery day this weekend</p>
                </div>
                <button className="bg-[#2E6BE6] text-white px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider hover:bg-[#1a58d4] transition-colors">
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#111827] border-y border-[#2E6BE6]/15">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2E6BE6]/15">
            <div className="text-center px-8 py-6 md:py-0">
              <p className="font-['Bebas_Neue'] text-5xl text-white">
                10K<span className="text-[#2E6BE6]">+</span>
              </p>
              <p className="text-[#8898B4] text-sm mt-2 leading-relaxed">
                Active Athletes<br />Worldwide
              </p>
            </div>
            <div className="text-center px-8 py-6 md:py-0">
              <p className="font-['Bebas_Neue'] text-5xl text-white">
                95<span className="text-[#2E6BE6]">%</span>
              </p>
              <p className="text-[#8898B4] text-sm mt-2 leading-relaxed">
                Goal Achievement<br />Rate
              </p>
            </div>
            <div className="text-center px-8 py-6 md:py-0">
              <p className="font-['Bebas_Neue'] text-5xl text-white">
                500<span className="text-[#2E6BE6]">+</span>
              </p>
              <p className="text-[#8898B4] text-sm mt-2 leading-relaxed">
                Expert Coaches<br />Available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Row */}
      <section className="bg-[#0A0F1E] border-b border-[#2E6BE6]/15">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#2E6BE6]/15">
            {[
              { icon: '🏃', label: 'Marathon Ready', subtext: 'Completed', color: '#2E6BE6' },
              { icon: '⚡', label: 'Speed Demon', subtext: 'Unlocked', color: '#00C2A8' },
              { icon: '🎯', label: 'Goal Crusher', subtext: 'Achieved', color: '#2E6BE6' },
              { icon: '🔥', label: 'Streak Master', subtext: '30 days', color: '#F59E0B' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center justify-center gap-3 px-6 py-4">
                <div className="w-9 h-9 rounded-full border border-[#2E6BE6]/15 flex items-center justify-center flex-shrink-0">
                  <span style={{ color: badge.color }} className="text-lg">{badge.icon}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{badge.label}</p>
                  <p className="text-[#8898B4] text-xs">{badge.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Categories */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-7 h-0.5 bg-[#2E6BE6]"></div>
            <span className="text-[#2E6BE6] text-[11px] font-bold uppercase tracking-[4px]">
              Sports
            </span>
          </div>
          
          <h2 className="font-['Bebas_Neue'] text-5xl text-white mb-12 tracking-wide">
            Track Every Activity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Running', tag: 'Endurance', gradient: 'from-[#0d1e3d] to-[#1a3a6e]', tagColor: '#2E6BE6', tagBg: 'bg-[#2E6BE6]/20' },
              { name: 'Swimming', tag: 'Full Body', gradient: 'from-[#0a2a2e] to-[#0f4a52]', tagColor: '#00C2A8', tagBg: 'bg-[#00C2A8]/15' },
              { name: 'Cycling', tag: 'Cardio', gradient: 'from-[#1a1a0d] to-[#3a3a1a]', tagColor: '#E63946', tagBg: 'bg-[#E63946]/15' },
              { name: 'Gym', tag: 'Strength', gradient: 'from-[#1a0d2e] to-[#2e1a4a]', tagColor: '#F59E0B', tagBg: 'bg-[#F59E0B]/15' },
            ].map((sport) => (
              <div key={sport.name} className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer transition-transform hover:scale-105">
                <div className={`absolute inset-0 bg-gradient-to-br ${sport.gradient}`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/95 via-transparent to-transparent"></div>
                
                <div className="absolute top-4 left-4">
                  <span 
                    className={`${sport.tagBg} px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider`}
                    style={{ color: sport.tagColor }}
                  >
                    {sport.tag}
                  </span>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-['Bebas_Neue'] text-2xl text-white tracking-wide mb-2">
                    {sport.name}
                  </h3>
                  <p className="text-white/55 text-xs leading-relaxed">
                    Track your progress and improve your performance
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section id="coaches" className="py-20 px-6 bg-[#0A0F1E]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-7 h-0.5 bg-[#2E6BE6]"></div>
            <span className="text-[#2E6BE6] text-[11px] font-bold uppercase tracking-[4px]">
              Coaches
            </span>
          </div>
          
          <h2 className="font-['Bebas_Neue'] text-5xl text-white mb-12 tracking-wide">
            Train With Experts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Mike Johnson', sport: 'Running', rating: '4.9', avatar: 'MJ', bg: '#1F4787', textColor: 'white' },
              { name: 'Sarah Chen', sport: 'Swimming', rating: '5.0', avatar: 'SC', bg: '#2E6BE6', textColor: 'white' },
              { name: 'Alex Rivera', sport: 'Cycling', rating: '4.8', avatar: 'AR', bg: '#00C2A8', textColor: '#003830' },
            ].map((coach) => (
              <div key={coach.name} className="bg-white/[0.03] border border-[#2E6BE6]/15 rounded-xl p-8 text-center hover:border-[#2E6BE6]/50 hover:bg-[#2E6BE6]/[0.06] transition-all hover:-translate-y-1">
                <div className="relative inline-block mb-6">
                  <div 
                    className="w-20 h-20 rounded-full border-2 border-[#2E6BE6]/15 flex items-center justify-center font-['Bebas_Neue'] text-3xl"
                    style={{ backgroundColor: coach.bg, color: coach.textColor }}
                  >
                    {coach.avatar}
                  </div>
                  <div className="absolute inset-0 rounded-full border border-[#2E6BE6]/30" style={{ inset: '-4px' }}></div>
                </div>
                
                <h3 className="text-white text-lg font-bold mb-1">{coach.name}</h3>
                <p className="text-[#2E6BE6] text-[11px] font-bold uppercase tracking-wider mb-4">
                  {coach.sport}
                </p>
                <p className="text-[#8898B4] text-xs mb-4 leading-relaxed">
                  Certified coach with 10+ years of experience helping athletes reach their goals
                </p>
                <div className="text-[#F59E0B] text-sm tracking-wider">
                  ★ {coach.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Terminal */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-7 h-0.5 bg-[#00C2A8]"></div>
            <span className="text-[#00C2A8] text-[11px] font-bold uppercase tracking-[4px]">
              AI Powered
            </span>
          </div>
          
          <h2 className="font-['Bebas_Neue'] text-5xl text-white mb-12 tracking-wide">
            Smart Recommendations
          </h2>

          <div className="bg-[#080d1a] border border-[#2E6BE6]/25 rounded-xl overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-[#2E6BE6]/[0.08] border-b border-[#2E6BE6]/25 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E63946]"></div>
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
              </div>
              <span className="text-[#8898B4] text-[11px] uppercase tracking-wider">
                AI Analysis
              </span>
            </div>
            
            {/* Terminal Body */}
            <div className="p-6 font-['JetBrains_Mono'] text-xs leading-loose">
              <div className="text-[#4b6aaa]">// Analyzing your performance data...</div>
              <div className="mt-2">
                <span className="text-[#00C2A8]">weeklyDistance</span>
                <span className="text-[#2E6BE6]">:</span>
                <span className="text-[#a8e6cf]"> 42</span>
                <span className="text-[#8898B4]">,</span>
              </div>
              <div>
                <span className="text-[#00C2A8]">improvement</span>
                <span className="text-[#2E6BE6]">:</span>
                <span className="text-[#e0a87c]"> "+12%"</span>
                <span className="text-[#8898B4]">,</span>
              </div>
              <div>
                <span className="text-[#00C2A8]">recommendation</span>
                <span className="text-[#2E6BE6]">:</span>
                <span className="text-[#e0a87c]"> "Add recovery day"</span>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-[#8898B4]">{'>'}</span>
                <span className="w-2 h-3.5 bg-[#00C2A8] ml-1 animate-blink"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative py-20 px-6 bg-[#1F4787] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(0,194,168,0.2)_0%,transparent_60%)]"></div>
        
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="font-['Bebas_Neue'] text-5xl md:text-6xl text-white mb-4 tracking-wider">
            Start Your <span className="text-[#00C2A8]">Journey</span> Today
          </h2>
          <p className="text-white/60 text-base mb-8 max-w-xl mx-auto">
            Join thousands of athletes improving their performance with AI-powered insights
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-white/[0.08] border border-white/15 border-r-0 rounded-l-sm px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-white/40"
              required
            />
            <button
              type="submit"
              className="bg-[#2E6BE6] text-white px-6 py-3 rounded-r-sm font-bold text-sm uppercase tracking-wider hover:bg-[#1a58d4] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050a14] border-t border-[#2E6BE6]/15">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Image src="/logo.svg" alt="Smart Athlete Logo" width={48} height={48} className="w-12 h-12" />
              </div>
              <p className="text-[#8898B4] text-sm max-w-[220px] leading-relaxed mb-6">
                AI-powered athletic training platform helping you achieve your goals faster
              </p>
              <div className="flex items-center gap-3">
                {['twitter', 'instagram', 'facebook'].map((social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="w-9 h-9 border border-[#2E6BE6]/15 rounded flex items-center justify-center text-white/50 hover:border-[#2E6BE6] hover:bg-[#2E6BE6]/10 hover:text-white transition-all"
                  >
                    <span className="text-sm">
                      {social === 'twitter' ? '𝕏' : social === 'instagram' ? '📷' : '👍'}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="text-white/30 text-[11px] uppercase tracking-[3px] mb-4">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Coaches', 'Mobile App'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/50 text-sm hover:text-white/60 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white/30 text-[11px] uppercase tracking-[3px] mb-4">Company</h4>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/50 text-sm hover:text-white/60 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white/30 text-[11px] uppercase tracking-[3px] mb-4">Legal</h4>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Security', 'Cookies'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/50 text-sm hover:text-white/60 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#2E6BE6]/15 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs">
              © 2024 Smart Athlete. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/20 text-xs hover:text-white/60 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/20 text-xs hover:text-white/60 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
