'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">
              Smart<span className="text-blue-600">Athlete</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="#coaches" className="text-sm text-gray-600 hover:text-gray-900">Coaches</Link>
            <Link href="#testimonials" className="text-sm text-gray-600 hover:text-gray-900">Testimonials</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/signup" className="text-sm text-gray-600 hover:text-gray-900">Sign Up</Link>
            <Link href="/auth/login" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
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
              <span className="text-blue-600">ACHIEVE MORE</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Track your performance, get AI-powered insights, and connect with expert coaches to reach your goals faster.
            </p>
            <div className="flex gap-4">
              <Link href="/auth/signup" className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800">
                GET STARTED TODAY
              </Link>
              <button className="px-6 py-3 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                PLAY VIDEO
              </button>
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
      <section className="bg-blue-600 py-12 px-6">
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
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">WHY SMART ATHLETE?</h2>
          <p className="text-center text-gray-600 mb-12">Everything you need to reach your athletic potential</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📊',
                title: 'AI-Powered Insights',
                description: 'Get personalized recommendations based on your performance data and training history.'
              },
              {
                icon: '🎯',
                title: 'Smart Goal Tracking',
                description: 'Set ambitious goals and track your progress with intelligent analytics and benchmarks.'
              },
              {
                icon: '👨‍🏫',
                title: 'Expert Coach Guidance',
                description: 'Connect with certified coaches who provide feedback and help you improve faster.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-xl">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Your Coaches */}
      <section id="coaches" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">MEET YOUR COACHES</h2>
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
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
      <section className="py-20 px-6 bg-blue-50">
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
            <form className="flex gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800">
                →
              </button>
            </form>
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
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
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
