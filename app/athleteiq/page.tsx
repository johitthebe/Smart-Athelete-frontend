"use client";

import { useState } from "react";

export default function AthleteIQPage() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;700&display=swap');
        
        .athleteiq-page {
          font-family: 'DM Sans', sans-serif;
          background: #F4F7FF;
          color: #0A0F1E;
        }
        
        .bebas { font-family: 'Bebas Neue', cursive; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .ticker-content {
          animation: ticker 20s linear infinite;
        }
        
        .float-1 {
          animation: float1 3s ease-in-out infinite;
        }
        
        .float-2 {
          animation: float2 3s ease-in-out infinite 0.5s;
        }
        
        .pulse-dot {
          animation: pulse-dot 1.8s ease-in-out infinite;
        }
        
        .blink-cursor {
          animation: blink 0.9s step-end infinite;
        }
      `}</style>

      <div className="athleteiq-page min-h-screen">

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/92 backdrop-blur-md border-b border-[#D0DCF7]">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image src="/logo.svg" alt="AthleteIQ Logo" width={60} height={60} className="w-15 h-15" />
              </div>

              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-[#5A6A85] hover:text-[#2E6BE6] transition-colors font-medium">
                  Features
                </a>
                <a href="#approach" className="text-[#5A6A85] hover:text-[#2E6BE6] transition-colors font-medium">
                  Approach
                </a>
                <a href="#coaches" className="text-[#5A6A85] hover:text-[#2E6BE6] transition-colors font-medium">
                  Coaches
                </a>
                <a href="#blog" className="text-[#5A6A85] hover:text-[#2E6BE6] transition-colors font-medium">
                  Blog
                </a>
              </div>

              <button className="bg-[#2E6BE6] text-white px-6 py-2.5 rounded-[3px] font-semibold text-sm uppercase tracking-wider hover:bg-[#1a58d4] transition-colors">
                Start Free
              </button>
            </div>
          </div>
        </nav>

        {/* Ticker Strip */}
        <div className="fixed top-[73px] left-0 right-0 z-40 bg-[#2E6BE6] overflow-hidden py-2">
          <div className="flex whitespace-nowrap">
            <div className="ticker-content flex items-center gap-8 text-white uppercase font-bold text-sm tracking-[2px]">
              <span>Running</span>
              <span className="text-[#00C2A8]">✦</span>
              <span>Swimming</span>
              <span className="text-[#00C2A8]">✦</span>
              <span>Cycling</span>
              <span className="text-[#00C2A8]">✦</span>
              <span>Strength</span>
              <span className="text-[#00C2A8]">✦</span>
              <span>Football</span>
              <span className="text-[#00C2A8]">✦</span>
              <span>Champions</span>
              <span className="text-[#00C2A8]">✦</span>
              {/* Duplicate for seamless loop */}
              <span>Running</span>
              <span className="text-[#00C2A8]">✦</span>
              <span>Swimming</span>
              <span className="text-[#00C2A8]">✦</span>
              <span>Cycling</span>
              <span className="text-[#00C2A8]">✦</span>
              <span>Strength</span>
              <span className="text-[#00C2A8]">✦</span>
              <span>Football</span>
              <span className="text-[#00C2A8]">✦</span>
              <span>Champions</span>
              <span className="text-[#00C2A8]">✦</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-40 pb-20 px-6 overflow-hidden" style={{
          background: 'linear-gradient(135deg, #f0f5ff, #e8f0fe, #f0faff)'
        }}>
          {/* SVG Football Field Background */}
          <svg className="absolute right-0 top-20 w-[600px] h-[600px] opacity-[0.12]" viewBox="0 0 600 400">
            <rect x="50" y="50" width="500" height="300" fill="none" stroke="#2E6BE6" strokeWidth="3"/>
            <line x1="300" y1="50" x2="300" y2="350" stroke="#2E6BE6" strokeWidth="3"/>
            <circle cx="300" cy="200" r="60" fill="none" stroke="#2E6BE6" strokeWidth="3"/>
            <rect x="50" y="120" width="80" height="160" fill="none" stroke="#2E6BE6" strokeWidth="3"/>
            <rect x="470" y="120" width="80" height="160" fill="none" stroke="#2E6BE6" strokeWidth="3"/>
            <circle cx="100" cy="200" r="8" fill="#2E6BE6"/>
            <circle cx="500" cy="200" r="8" fill="#2E6BE6"/>
          </svg>

          <div className="max-w-7xl mx-auto relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                {/* Eyebrow Badge */}
                <div className="inline-flex items-center gap-2 bg-[#2E6BE6]/8 border border-[#2E6BE6]/20 px-4 py-2 rounded-sm">
                  <span className="w-2 h-2 rounded-full bg-[#00C2A8] pulse-dot"></span>
                  <span className="text-[#2E6BE6] text-xs font-bold uppercase tracking-wider">
                    AI-Powered Training Platform
                  </span>
                </div>

                {/* Headline */}
                <h1 className="bebas text-7xl leading-tight tracking-wide">
                  TRAIN LIKE A<br />
                  <span className="text-[#2E6BE6]">CHAMPION</span><br />
                  PERFORM LIKE ONE
                </h1>

                <p className="text-[#5A6A85] text-lg max-w-lg">
                  Elevate your athletic performance with AI-powered insights, personalized coaching, 
                  and real-time analytics that help you reach your peak potential.
                </p>

                {/* CTA Buttons */}
                <div className="flex gap-4">
                  <button className="bg-[#2E6BE6] text-white px-8 py-4 rounded-[3px] font-semibold uppercase text-sm tracking-wider hover:bg-[#1a58d4] transition-all">
                    Start Free Trial
                  </button>
                  <button className="border-2 border-[#2E6BE6] text-[#2E6BE6] px-8 py-4 rounded-[3px] font-semibold uppercase text-sm tracking-wider hover:bg-[#2E6BE6]/5 transition-all">
                    Watch Demo
                  </button>
                </div>
              </div>

              {/* Right - Athlete Illustration & Dashboard */}
              <div className="relative h-[600px]">
                {/* Floating Pills */}
                <div className="absolute top-10 left-0 float-1 bg-white border border-[#00C2A8] rounded-lg p-4 shadow-lg z-10">
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

                <div className="absolute bottom-32 right-0 float-2 bg-white border border-[#2E6BE6] rounded-lg p-4 shadow-lg z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#2E6BE6]/15 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#2E6BE6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#0A0F1E] font-bold text-xs">Coach Mike replied</p>
                      <p className="text-[#8898B4] text-[10px]">2 minutes ago</p>
                    </div>
                  </div>
                </div>

                {/* Dashboard Card */}
                <div className="absolute left-0 top-32 bg-white border border-[#2E6BE6]/30 rounded-xl p-6 shadow-xl w-80">
                  <p className="text-[#8898B4] text-xs font-bold uppercase tracking-wider mb-2">Weekly Distance</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="bebas text-6xl text-[#0A0F1E]">42</span>
                    <span className="bebas text-3xl text-[#2E6BE6]">km</span>
                  </div>
                  
                  {/* Bar Chart */}
                  <div className="flex items-end justify-between gap-1 h-24 mb-4">
                    {[
                      { day: 'M', height: 75, active: true },
                      { day: 'T', height: 60, active: true },
                      { day: 'W', height: 85, active: true, teal: true },
                      { day: 'T', height: 70, active: true },
                      { day: 'F', height: 80, active: true },
                      { day: 'S', height: 30, active: false },
                      { day: 'S', height: 25, active: false },
                    ].map((item, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div 
                          className={`w-full rounded-t-sm ${
                            item.teal ? 'bg-[#00C2A8]' :
                            item.active ? 'bg-[#2E6BE6]' : 'bg-[#2E6BE6]/18 border border-[#2E6BE6]/18'
                          }`}
                          style={{ height: `${item.height}%` }}
                        ></div>
                        <span className="mono text-[9px] text-[#8898B4]">{item.day}</span>
                      </div>
                    ))}
                  </div>

                  {/* AI Strip */}
                  <div className="bg-[#00C2A8]/7 border border-[#00C2A8]/20 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#00C2A8]/15 flex items-center justify-center">
                        <span className="text-[#00C2A8] text-xs">✨</span>
                      </div>
                      <p className="text-[#0A0F1E] text-xs font-medium">Add recovery day</p>
                    </div>
                    <button className="bg-[#2E6BE6] text-white px-3 py-1 rounded text-[10px] font-bold uppercase">
                      Accept
                    </button>
                  </div>
                </div>

                {/* Athlete SVG Illustration */}
                <svg className="absolute right-0 bottom-0 w-80 h-96" viewBox="0 0 200 300">
                  {/* Speed lines */}
                  <line x1="20" y1="100" x2="60" y2="100" stroke="#2E6BE6" strokeWidth="3" opacity="0.3"/>
                  <line x1="15" y1="120" x2="50" y2="120" stroke="#2E6BE6" strokeWidth="3" opacity="0.3"/>
                  <line x1="25" y1="140" x2="55" y2="140" stroke="#2E6BE6" strokeWidth="3" opacity="0.3"/>
                  
                  {/* Body */}
                  <rect x="80" y="80" width="50" height="70" fill="#0d1e3d" rx="5"/>
                  {/* Head */}
                  <circle cx="105" cy="50" r="25" fill="#1F4787"/>
                  {/* Helmet stripe */}
                  <rect x="95" y="45" width="20" height="5" fill="#2E6BE6"/>
                  {/* Jersey number */}
                  <text x="105" y="120" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">10</text>
                  {/* Arms */}
                  <path d="M 80 90 Q 60 100 70 130" fill="none" stroke="#1F4787" strokeWidth="12" strokeLinecap="round"/>
                  <path d="M 130 90 Q 150 110 140 140" fill="none" stroke="#1F4787" strokeWidth="12" strokeLinecap="round"/>
                  {/* Legs */}
                  <path d="M 90 150 Q 85 200 95 250" fill="none" stroke="#0d1e3d" strokeWidth="14" strokeLinecap="round"/>
                  <path d="M 110 150 Q 125 190 115 240" fill="none" stroke="#0d1e3d" strokeWidth="14" strokeLinecap="round"/>
                  {/* Football */}
                  <ellipse cx="140" cy="240" rx="12" ry="16" fill="#2E6BE6"/>
                  <line x1="140" y1="228" x2="140" y2="252" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-white border-y border-[#D0DCF7]">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <p className="bebas text-5xl text-[#0A0F1E]">
                  50K<span className="text-[#2E6BE6]">+</span>
                </p>
                <p className="text-[#5A6A85] text-sm mt-2">
                  Active Athletes<br />Worldwide
                </p>
              </div>
              <div className="text-center">
                <p className="bebas text-5xl text-[#0A0F1E]">
                  98<span className="text-[#2E6BE6]">%</span>
                </p>
                <p className="text-[#5A6A85] text-sm mt-2">
                  Satisfaction<br />Rate
                </p>
              </div>
              <div className="text-center">
                <p className="bebas text-5xl text-[#0A0F1E]">
                  3<span className="text-[#2E6BE6]">x</span>
                </p>
                <p className="text-[#5A6A85] text-sm mt-2">
                  Performance<br />Improvement
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Badges Row */}
        <section className="bg-[#F4F7FF]">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: '🏅', label: 'Elite Program', subtext: 'Premium training' },
                { icon: '🤖', label: 'AI Coaching', subtext: 'Smart insights' },
                { icon: '📊', label: 'Live Analytics', subtext: 'Real-time data' },
                { icon: '🏆', label: 'Proven Results', subtext: '98% success rate' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-[#D0DCF7] flex items-center justify-center flex-shrink-0 bg-white">
                    <span className="text-lg">{badge.icon}</span>
                  </div>
                  <div>
                    <p className="text-[#0A0F1E] text-sm font-semibold">{badge.label}</p>
                    <p className="text-[#8898B4] text-xs">{badge.subtext}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sports Cards */}
        <section id="features" className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-7 h-0.5 bg-[#2E6BE6]"></div>
              <span className="text-[#2E6BE6] text-xs font-bold uppercase tracking-[2px]">
                Sports
              </span>
            </div>
            
            <h2 className="bebas text-5xl text-[#0A0F1E] mb-12">
              Track Every Activity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Running', tag: 'Endurance', emoji: '🏃', gradient: 'linear-gradient(135deg, #0d1e3d, #1a3a6e)', tagColor: '#2E6BE6', tagBg: 'rgba(46, 107, 230, 0.2)' },
                { name: 'Swimming', tag: 'Full Body', emoji: '🏊', gradient: 'linear-gradient(135deg, #0a2a2e, #0f4a52)', tagColor: '#00C2A8', tagBg: 'rgba(0, 194, 168, 0.15)' },
                { name: 'Cycling', tag: 'Cardio', emoji: '🚴', gradient: 'linear-gradient(135deg, #1a1a0d, #3a3a1a)', tagColor: '#E63946', tagBg: 'rgba(230, 57, 70, 0.15)' },
                { name: 'Gym', tag: 'Strength', emoji: '💪', gradient: 'linear-gradient(135deg, #1a0d2e, #2e1a4a)', tagColor: '#F59E0B', tagBg: 'rgba(245, 158, 11, 0.15)' },
              ].map((sport, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1.5">
                  <div className="absolute inset-0" style={{ background: sport.gradient }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/95 via-transparent to-transparent"></div>
                  
                  {/* Large emoji illustration */}
                  <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-30">
                    {sport.emoji}
                  </div>
                  
                  <div className="absolute top-4 left-4">
                    <span 
                      className="px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: sport.tagBg, color: sport.tagColor }}
                    >
                      {sport.tag}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="bebas text-2xl text-white tracking-wide mb-2">
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
        <section id="coaches" className="py-20 px-6 bg-[#F4F7FF]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-7 h-0.5 bg-[#2E6BE6]"></div>
              <span className="text-[#2E6BE6] text-xs font-bold uppercase tracking-[2px]">
                Coaches
              </span>
            </div>
            
            <h2 className="bebas text-5xl text-[#0A0F1E] mb-12">
              Train With Experts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Laura Foster', sport: 'Running', rating: '4.9', avatar: 'LF', bg: '#1F4787', textColor: 'white' },
                { name: 'Mike Stevens', sport: 'Swimming', rating: '5.0', avatar: 'MS', bg: '#2E6BE6', textColor: 'white' },
                { name: 'Emma Johnson', sport: 'Cycling', rating: '4.8', avatar: 'EJ', bg: '#00C2A8', textColor: '#003830' },
                { name: 'Alex Kim', sport: 'Strength', rating: '4.9', avatar: 'AK', bg: '#2e1a4a', textColor: 'white' },
              ].map((coach, i) => (
                <div key={i} className="bg-[#2E6BE6]/[0.03] border border-[#D0DCF7] rounded-xl p-8 text-center hover:border-[#2E6BE6]/50 hover:bg-[#2E6BE6]/[0.06] transition-all hover:-translate-y-1">
                  <div className="relative inline-block mb-6">
                    <div 
                      className="w-20 h-20 rounded-full border-2 border-[#D0DCF7] flex items-center justify-center bebas text-3xl relative"
                      style={{ backgroundColor: coach.bg, color: coach.textColor }}
                    >
                      {coach.avatar}
                      <div className="absolute inset-0 rounded-full border border-[#2E6BE6]/30" style={{ inset: '-4px' }}></div>
                    </div>
                  </div>
                  
                  <h3 className="text-[#0A0F1E] text-lg font-bold mb-1">{coach.name}</h3>
                  <p className="text-[#2E6BE6] text-xs font-bold uppercase tracking-wider mb-4">
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
        <section className="py-20 px-6 bg-[#F4F7FF]">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-7 h-0.5 bg-[#00C2A8]"></div>
                  <span className="text-[#00C2A8] text-xs font-bold uppercase tracking-[2px]">
                    AI Powered
                  </span>
                </div>
                
                <h2 className="bebas text-5xl text-[#0A0F1E] mb-6">
                  Smart Recommendations
                </h2>

                <p className="text-[#5A6A85] mb-6">
                  Our AI analyzes your performance data in real-time to provide personalized 
                  recommendations that help you train smarter and achieve your goals faster.
                </p>

                <ul className="space-y-3">
                  {['Real-time performance analysis', 'Personalized training plans', 'Injury risk prediction'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#00C2A8]"></span>
                      <span className="text-[#0A0F1E] font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#080d1a] border border-[#2E6BE6]/25 rounded-xl overflow-hidden">
                <div className="bg-[#2E6BE6]/[0.08] border-b border-[#2E6BE6]/25 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#E63946]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
                  </div>
                  <span className="text-[#8898B4] text-xs uppercase tracking-wider">
                    AI Analysis
                  </span>
                </div>
                
                <div className="p-6 mono text-xs leading-loose">
                  <div className="text-[#4b6aaa]">// Analyzing athlete performance...</div>
                  <div className="mt-2">
                    <span className="text-[#00C2A8]">athlete</span>
                    <span className="text-[#2E6BE6]">:</span>
                    <span className="text-[#e0a87c]"> "Sarah Chen"</span>
                    <span className="text-[#8898B4]">,</span>
                  </div>
                  <div>
                    <span className="text-[#00C2A8]">sport</span>
                    <span className="text-[#2E6BE6]">:</span>
                    <span className="text-[#e0a87c]"> "Running"</span>
                    <span className="text-[#8898B4]">,</span>
                  </div>
                  <div>
                    <span className="text-[#00C2A8]">recovery_score</span>
                    <span className="text-[#2E6BE6]">:</span>
                    <span className="text-[#a8e6cf]"> 87</span>
                    <span className="text-[#8898B4]">,</span>
                  </div>
                  <div>
                    <span className="text-[#00C2A8]">next_session</span>
                    <span className="text-[#2E6BE6]">:</span>
                    <span className="text-[#e0a87c]"> "Interval Training"</span>
                    <span className="text-[#8898B4]">,</span>
                  </div>
                  <div>
                    <span className="text-[#00C2A8]">target_pace</span>
                    <span className="text-[#2E6BE6]">:</span>
                    <span className="text-[#e0a87c]"> "5:30/km"</span>
                    <span className="text-[#8898B4]">,</span>
                  </div>
                  <div>
                    <span className="text-[#00C2A8]">duration</span>
                    <span className="text-[#2E6BE6]">:</span>
                    <span className="text-[#a8e6cf]"> 45</span>
                    <span className="text-[#8898B4]">,</span>
                  </div>
                  <div>
                    <span className="text-[#00C2A8]">injury_risk</span>
                    <span className="text-[#2E6BE6]">:</span>
                    <span className="text-[#e0a87c]"> "low"</span>
                    <span className="text-[#8898B4]">,</span>
                  </div>
                  <div>
                    <span className="text-[#00C2A8]">recommendation</span>
                    <span className="text-[#2E6BE6]">:</span>
                    <span className="text-[#e0a87c]"> "Perfect conditions"</span>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-[#8898B4]">{'>'}</span>
                    <span className="w-2 h-3.5 bg-[#00C2A8] ml-1 blink-cursor"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section id="blog" className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-7 h-0.5 bg-[#2E6BE6]"></div>
              <span className="text-[#2E6BE6] text-xs font-bold uppercase tracking-[2px]">
                Blog
              </span>
            </div>
            
            <h2 className="bebas text-5xl text-[#0A0F1E] mb-12">
              Latest Insights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: '10 Tips for Marathon Training', sport: 'Running', author: 'LF', gradient: 'linear-gradient(135deg, #0d1e3d, #1a3a6e)', tagColor: '#2E6BE6', tagBg: '#2E6BE6' },
                { title: 'Swimming Technique Masterclass', sport: 'Swimming', author: 'MS', gradient: 'linear-gradient(135deg, #0a2a2e, #0f4a52)', tagColor: '#003830', tagBg: '#00C2A8' },
                { title: 'Strength Training for Athletes', sport: 'Fitness', author: 'AK', gradient: 'linear-gradient(135deg, #1a0d2e, #2e1a4a)', tagColor: '#8B5A00', tagBg: 'rgba(245, 158, 11, 0.9)' },
              ].map((article, i) => (
                <div key={i} className="bg-white border border-[#D0DCF7] rounded-xl overflow-hidden hover:-translate-y-1 hover:border-[#2E6BE6]/35 transition-all">
                  <div className="relative h-48" style={{ background: article.gradient }}>
                    <div className="absolute top-4 left-4">
                      <span 
                        className="px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: article.tagBg }}
                      >
                        {article.sport}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-[#2E6BE6] flex items-center justify-center text-white text-xs font-bold">
                        {article.author}
                      </div>
                      <span className="text-[#8898B4] text-xs">{article.author === 'LF' ? 'Laura Foster' : article.author === 'MS' ? 'Mike Stevens' : 'Alex Kim'}</span>
                      <span className="text-[#8898B4]/30 text-xs ml-auto">2 days ago</span>
                    </div>
                    
                    <h3 className="text-[#0A0F1E] text-base font-bold mb-2 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-[#8898B4] text-xs leading-relaxed">
                      Discover proven strategies and expert tips to elevate your athletic performance to the next level.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="relative py-20 px-6 bg-[#1F4787] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(0,194,168,0.2)_0%,transparent_60%)]"></div>
          
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="bebas text-6xl text-white mb-4 tracking-wider">
              Stay Updated — Right In <span className="text-[#00C2A8]">Your Inbox</span>
            </h2>
            <p className="text-white/60 text-base mb-8 max-w-xl mx-auto">
              Get the latest training tips, performance insights, and exclusive content delivered weekly
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
              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  <img src="/logo.svg" alt="AthleteIQ Logo" className="h-12 w-auto" />
                </div>
                <p className="text-[#8898B4] text-sm max-w-[220px] leading-relaxed mb-6">
                  AI-powered athletic training platform helping you achieve your goals faster
                </p>
                <div className="flex items-center gap-3">
                  {['𝕏', '📷', '👍', '▶'].map((icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-9 h-9 border border-[#2E6BE6]/15 rounded flex items-center justify-center text-white/50 hover:border-[#2E6BE6] hover:bg-[#2E6BE6]/10 hover:text-white transition-all"
                    >
                      <span className="text-sm">{icon}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white/30 text-xs uppercase tracking-[3px] mb-4">Product</h4>
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
                <h4 className="text-white/30 text-xs uppercase tracking-[3px] mb-4">Company</h4>
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
                <h4 className="text-white/30 text-xs uppercase tracking-[3px] mb-4">Legal</h4>
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

            <div className="border-t border-[#2E6BE6]/15 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/20 text-xs">
                © 2024 AthleteIQ. All rights reserved.
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
    </>
  );
}
