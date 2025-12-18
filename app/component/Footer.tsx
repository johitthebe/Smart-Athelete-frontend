"use client";

export default function Footer() {
  return (
    <footer className="mt-8 border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-gray-500">
        <div className="mb-2 font-semibold text-blue-700">Smart Athlete</div>
        <div className="mb-4">
          Privacy Policy
        </div>
        <p className="mb-4">
          Lorem ipsum dolor sit amet consectetur. Nullam scelerisque consequat
          ante sem. Diam sagittis non eget diam id egestas ultrices pulvinar.
        </p>
        <div className="flex items-center justify-center gap-4 mb-2">
          <span>🔵</span>
          <span>🐦</span>
          <span>▶️</span>
        </div>
        <div>Copyright © 2025 Smartathlete.com</div>
      </div>
    </footer>
  );
}
