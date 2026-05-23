"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Role = "coach" | "athlete";

export default function ChooseRole() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>("athlete");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current user from backend via proxy
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me/", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);

          // If user already has a role set (and it's not default athlete), redirect
          if (userData.role && userData.role !== "athlete") {
            if (userData.role === "admin") {
              router.push("/admin");
            } else if (userData.role === "coach") {
              router.push("/dashboard/coach");
            }
          }
        } else {
          // Not authenticated, redirect to login
          router.push("/auth/login");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const handleContinue = async () => {
    if (!user) return;

    try {
      setSubmitting(true);

      // Get CSRF token
      const getCookie = (name: string) => {
        if (typeof document === "undefined") return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
        return null;
      };

      // Fetch CSRF cookie first via proxy
      await fetch("/api/csrf/", {
        method: "GET",
        credentials: "include",
      });

      const csrfToken = getCookie("csrftoken");

      // Call set-my-role endpoint via proxy
      const res = await fetch("/api/auth/set-my-role/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect based on role
        if (selectedRole === "athlete") {
          // Check onboarding status for athletes
          const onboardingRes = await fetch("/api/auth/onboarding/status/", {
            method: "GET",
            credentials: "include",
            headers: {
              ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
            },
          });
          
          if (onboardingRes.ok) {
            const onboardingData = await onboardingRes.json();
            if (onboardingData.completed) {
              router.push("/dashboard/player");
            } else {
              router.push("/auth/onboarding");
            }
          } else {
            // If status check fails, go to onboarding to be safe
            router.push("/auth/onboarding");
          }
        } else if (selectedRole === "coach") {
          router.push("/dashboard/coach");
        }
      } else {
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
        <div className="relative w-[120px] h-[120px] mb-4">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-contain"
          />
        </div>
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
          We'll streamline your setup experience accordingly.
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
