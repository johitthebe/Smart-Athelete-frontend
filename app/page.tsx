"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleGetStarted = () => {
    router.push("/auth/signup"); 
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Project Title - Left */}
          <h1 className="text-xl font-semibold text-gray-800">
            Smart Athlete Performance Tracker & Advisor
          </h1>

          {/* Login Button - Right */}
          <button
            className="text-blue-600 font-medium hover:underline"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Track. Improve. Perform Better.
        </h2>

        <p className="max-w-2xl text-gray-600 text-lg mb-8">
          A web-based platform that helps athletes and coaches record performance,
          set goals, track progress, and receive feedback without expensive
          devices or complex systems.
        </p>

        {/* Call to Action */}
        <div className="flex gap-4">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handleGetStarted}
          >
            Get Started
          </button>
          <button
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            onClick={() => router.push("/login")}
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © 2025 Smart Athlete Performance Tracker | Final Year Project
      </footer>
    </main>
  );
}
