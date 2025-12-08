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

  useEffect(() => {
    const tempUser =
      typeof window !== "undefined" ? localStorage.getItem("temp_user") : null;
    if (!tempUser) {
      router.push("/signup");
    } else {
      setUser(JSON.parse(tempUser));
    }
  }, [router]);

  if (!user) return null;

  const handleContinue = async () => {
    try {
      setSubmitting(true);

      const res = await fetch("http://127.0.0.1:8000/api/set-role/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id, role: selectedRole }),
      });

      if (res.ok) {
        localStorage.removeItem("temp_user");
        router.push("/login");
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
        <div className="relative h-32 w-32 mb-6">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-contain rounded-lg"
          />
        </div>

        <p className="font-semibold text-base text-black mb-1">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>

        <div className="mt-4 h-4 w-4 rounded-full border-2 border-[#173B80] flex items-center justify-center">
          {active && (
            <span className="h-2.5 w-2.5 rounded-full bg-[#173B80]" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="w-full max-w-3xl px-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 mb-6 flex items-center gap-1"
        >
          <span>&larr;</span> Back
        </button>

        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-2">
          Select your account type
        </h1>
        <p className="text-sm text-gray-500 text-center mb-10">
          We’ll streamline your setup experience accordingly.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center mb-10">
          <Card
            role="coach"
            title="For Coach"
            description="Manage athletes, track progress, and plan training."
            imageSrc="/coach.svg"      // file in public/coach.svg
          />
          <Card
            role="athlete"
            title="For Athlete"
            description="Follow training plans and monitor your own performance."
            imageSrc="/athlete.svg"    // file in public/athlete.svg
          />
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleContinue}
            disabled={submitting}
            className="w-full md:w-80 bg-[#173B80] text-white py-3 rounded-md text-sm font-medium hover:bg-[#102a5a] disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
