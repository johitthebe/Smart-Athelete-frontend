"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Role = "coach" | "athlete";

export default function ChooseRole() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>("coach");
  const [submitting, setSubmitting] = useState(false);

  // FIX 1: accept temp_user OR existing user from login
  useEffect(() => {
    if (typeof window === "undefined") return;

    const tempUser = localStorage.getItem("temp_user");
    const existingUser = localStorage.getItem("user");

    if (tempUser) {
      setUser(JSON.parse(tempUser));
    } else if (existingUser) {
      setUser(JSON.parse(existingUser));
    } else {
      router.push("/signup");
    }
  }, [router]);

  if (!user) return null;

  const handleContinue = async () => {
    if (!user) return;

    try {
      setSubmitting(true);

      const res = await fetch("http://127.0.0.1:8000/api/set-role/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: (user as any).id, role: selectedRole }),
      });

      if (res.ok) {
        // remove temp user
        localStorage.removeItem("temp_user");

        // build a full user object with role and store as "user"
        const updatedUser = { ...(user as any), role: selectedRole };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // FIX 2: correct redirect for player vs coach
        // correct redirect for athlete vs coach
      if (selectedRole === "athlete") {
        router.push("/dashboard/player");
      } else if (selectedRole === "coach") {
        router.push("/dashboard/coach");
      } else {
        router.push("/");
      }

      } else {
        const data = await res.json();
        alert(data?.error || "Failed to set role");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const Card = ({
    role,
    title,
    description,
    imageSrc,
  }: {
    role: Role;
    title: string;
    description: string;
    imageSrc: string;
  }) => {
    const active = selectedRole === role;

    return (
      <button
        type="button"
        onClick={() => setSelectedRole(role)}
        className={`flex flex-col items-center justify-between rounded-xl border px-10 py-8 text-center transition-all ${
          active
            ? "border-[#173B80] shadow-md bg-[#F5F8FF]"
            : "border-gray-200 bg-white hover:border-[#173B80]/60"
        }`}
      >
        {/* your image here */}
        <Image
          src={imageSrc}
          alt={title}
          width={120}
          height={120}
          className="mb-4"
        />
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        {active && (
          <span className="mt-2 text-xs font-medium text-[#173B80]">
            Selected
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-3xl px-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 mb-6 flex items-center gap-1"
        >
          ← Back
        </button>

        <h1 className="text-3xl md:text-4xl font-semibold mb-2">
          Select your account type
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          We’ll streamline your setup experience accordingly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card
            role="athlete"
            title="Athlete"
            description="Track your training, monitor progress, and share data with your coach."
            imageSrc="/athlete.svg"
          />
          <Card
            role="coach"
            title="Coach"
            description="Manage athletes, review performance metrics, and plan training."
            imageSrc="/Coach.svg"
          />
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={submitting}
          className="w-full bg-[#173B80] text-white py-3 rounded-md text-sm font-medium hover:bg-[#102a5a] transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
