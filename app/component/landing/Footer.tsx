import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#02060f] border-t border-white/10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2E6BE6] to-[#00C2A8] flex items-center justify-center shadow-lg shadow-[#2E6BE6]/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-semibold text-white text-lg">Smart<span className="text-[#00C2A8]">Athlete</span></span>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-400">
              A modern training hub for athletes and coaches that keeps progress easy to track and simple to share.
            </p>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[3px] text-slate-500 mb-4">Explore</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Features', href: '#features' },
                { label: 'Coaches', href: '#coaches' },
                { label: 'Privacy', href: '#privacy' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-slate-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[3px] text-slate-500 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Terms', href: '#terms' },
                { label: 'Cookies', href: '#cookies' },
                { label: 'Security', href: '#security' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-slate-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} SmartAthlete. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="#privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
