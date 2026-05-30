'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me/`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        // Already logged in, redirect to appropriate dashboard
        if (data.role === 'admin') {
          router.replace("/admin");
        } else if (data.role === 'coach' || data.role === 'coach_pending') {
          router.replace("/dashboard/coach");
        } else {
          router.replace("/dashboard/player");
        }
      } else {
        setChecking(false);
      }
    } catch (err) {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.svg" 
              alt="Smart Athlete Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-xl text-gray-900">
              Smart<span className="text-[#173B80]">Athlete</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="#coaches" className="text-sm text-gray-600 hover:text-gray-900">Coaches</Link>
            <Link href="#testimonials" className="text-sm text-gray-600 hover:text-gray-900">Testimonials</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/signup" className="text-sm text-gray-600 hover:text-gray-900">Sign Up</Link>
            <Link href="/auth/login" className="px-4 py-2 bg-[#173B80] text-white text-sm font-medium rounded-lg hover:bg-[#0f2a5a]">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm text-gray-500 mb-4">ACHIEVE YOUR ATHLETIC GOALS</p>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              TRAIN<br />
              SMARTER,<br />
              <span className="text-[#173B80]">ACHIEVE MORE</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Track your performance, get AI-powered insights, and connect with expert coaches to reach your goals faster.
            </p>
            <div className="flex gap-4">
              <Link href="/auth/signup" className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800">
                GET STARTED TODAY
              </Link>
            </div>
          </div>
          
          <div className="relative h-[500px] rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=1000&fit=crop" 
              alt="Athlete training"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#173B80] py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
          <div>
            <p className="text-4xl font-bold mb-2">10K+</p>
            <p className="text-blue-100">ACTIVE ATHLETES WORLDWIDE</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">95%</p>
            <p className="text-blue-100">GOAL ACHIEVEMENT RATE</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">500+</p>
            <p className="text-blue-100">CERTIFIED COACHES</p>
          </div>
        </div>
      </section>

      {/* Track Every Activity */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">TRACK EVERY ACTIVITY</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'RUNNING', subtitle: 'Track your runs', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=400&fit=crop' },
              { title: 'SWIMMING', subtitle: 'Log your laps', image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400&h=400&fit=crop' },
              { title: 'CYCLING', subtitle: 'Monitor rides', image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400&h=400&fit=crop' },
              { title: 'GYM', subtitle: 'Track workouts', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop' },
            ].map((activity, i) => (
              <div key={i} className="relative h-64 rounded-xl overflow-hidden group cursor-pointer">
                <img src={activity.image} alt={activity.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <p className="text-white font-bold text-lg">{activity.title}</p>
                  <p className="text-gray-300 text-sm">{activity.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Smart Athlete */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#173B80]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#173B80]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#173B80]/10 rounded-full mb-6">
              <div className="w-2 h-2 bg-[#173B80] rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-[#173B80] uppercase tracking-wider">Why Choose Us</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              WHY SMART ATHLETE?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to reach your athletic potential
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'AI-Powered Insights',
                description: 'Get personalized recommendations based on your performance data and training history.',
                gradient: 'from-[#173B80] to-[#2E6BE6]',
                bgPattern: 'bg-gradient-to-br from-[#173B80]/10 to-[#2E6BE6]/5'
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Smart Goal Tracking',
                description: 'Set ambitious goals and track your progress with intelligent analytics and benchmarks.',
                gradient: 'from-[#173B80] to-[#00C2A8]',
                bgPattern: 'bg-gradient-to-br from-[#173B80]/10 to-[#00C2A8]/5'
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'Expert Coach Guidance',
                description: 'Connect with certified coaches who provide feedback and help you improve faster.',
                gradient: 'from-[#173B80] to-[#F59E0B]',
                bgPattern: 'bg-gradient-to-br from-[#173B80]/10 to-[#F59E0B]/5'
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 ${feature.bgPattern} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#173B80] transition-colors">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Decorative arrow */}
                  <div className="mt-6 flex items-center text-[#173B80] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm">Learn more</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
                
                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-bl-full`}></div>
              </div>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <Link 
              href="/auth/signup" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#173B80] to-[#2E6BE6] text-white font-semibold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span>Start Your Journey Today</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-4 text-sm text-gray-500">No credit card required • Free 14-day trial</p>
          </div>
        </div>
      </section>

      {/* Meet Your Coaches */}
      <section id="coaches" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">MEET YOUR COACHES</h2>
            <Link href="/auth/signup" className="text-[#173B80] hover:text-[#0f2a5a] font-medium">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Sarah M.', sport: 'Running Coach', rating: '4.9', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
              { name: 'John D.', sport: 'Strength Training', rating: '5.0', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
              { name: 'Emily R.', sport: 'Swimming Coach', rating: '4.8', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop' },
              { name: 'Mike T.', sport: 'Cycling Coach', rating: '4.9', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
            ].map((coach, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-64">
                  <img src={coach.image} alt={coach.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="font-bold text-gray-900">{coach.name}</p>
                  <p className="text-sm text-gray-600">{coach.sport}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-medium">{coach.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Link href="/auth/signup?role=coach" className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800">
              BECOME A COACH
            </Link>
            <Link href="/auth/signup" className="px-6 py-3 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50">
              BROWSE COACHES
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">WHAT ATHLETES SAY</h2>
          
          <div className="flex justify-center mb-8">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <span key={i} className="text-yellow-400 text-2xl">★</span>
              ))}
              <span className="ml-2 text-gray-600">4.9 out of 5 stars</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "SmartAthlete helped me achieve my marathon goal. The AI insights were spot-on!",
                author: "Alex Johnson",
                role: "Marathon Runner"
              },
              {
                text: "The coach feedback feature is incredible. I've improved my form and speed significantly.",
                author: "Maria Garcia",
                role: "Track Athlete"
              },
              {
                text: "Best training platform I've used. The goal tracking keeps me motivated every day.",
                author: "David Chen",
                role: "Triathlete"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(j => (
                    <span key={j} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#173B80]/5 via-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              START<br />
              YOUR JOURNEY<br />
              TODAY
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of athletes who are already training smarter and achieving more with SmartAthlete.
            </p>
            <Link 
              href="/auth/signup"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#173B80] text-white font-semibold rounded-lg hover:bg-[#0f2a5a] transition-colors"
            >
              <span>Get Started Now</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          
          <div className="relative h-[500px] rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=1000&fit=crop" 
              alt="Athlete"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/logo.svg" 
                  alt="Smart Athlete Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="font-bold text-xl">SmartAthlete</span>
              </div>
              <p className="text-gray-400 text-sm">Train smarter, achieve more.</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#coaches" className="hover:text-white">Coaches</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
            <p className="text-gray-400 text-sm">© 2026 SmartAthlete. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
