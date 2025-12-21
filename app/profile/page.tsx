"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/component/Navbar";
import Footer from "@/app/component/Footer";


type User = {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
};

type ProfileForm = {
  fullName: string;
  email: string;
  age: string;
  gender: string;
  sport: string;
  trainingCategory: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    email: "",
    age: "",
    gender: "",
    sport: "",
    trainingCategory: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("user");
    if (stored) {
      const u: User = JSON.parse(stored);
      setUser(u);
      setForm((prev) => ({
        ...prev,
        fullName:
          (u.first_name || u.last_name
            ? `${u.first_name || ""} ${u.last_name || ""}`.trim()
            : u.username) || "",
        email: u.email || "",
        // demo defaults – later load from backend profile API
        age: "24",
        gender: "Male",
        sport: "Track & Field",
        trainingCategory: "Intermediate",
      }));
    }
  }, []);

  const initials =
    form.fullName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "U";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: send to backend profile endpoint
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    // optional: reload from backend/localStorage
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 mx-auto w-full max-w-6xl px-6 py-6">
        {/* Header row */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">My Profile</h1>

          {editing ? (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
              >
                💾 Save
              </button>
              <button
                onClick={handleCancel}
                className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 bg-white"
              >
                ✕ Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* Main card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <h2 className="text-base font-semibold text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your profile details and athletic background
          </p>

          <div className="mt-6 flex flex-col gap-6 md:flex-row">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-700">
                {initials}
              </div>
              {editing && (
                <button className="rounded-lg border px-3 py-1 text-xs font-medium text-gray-700 bg-white">
                  Change Photo
                </button>
              )}
            </div>

            {/* Form grid */}
            <div className="flex-1 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Full name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm disabled:bg-gray-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm disabled:bg-gray-100"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm disabled:bg-gray-100"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm disabled:bg-gray-100"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Sport */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Sport
                </label>
                <input
                  type="text"
                  name="sport"
                  value={form.sport}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm disabled:bg-gray-100"
                />
              </div>

              {/* Training category */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Training Category
                </label>
                <select
                  name="trainingCategory"
                  value={form.trainingCategory}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm disabled:bg-gray-100"
                >
                  <option value="">Select</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Teams & Coaches row */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm border">
            <h3 className="text-sm font-semibold text-gray-900">Teams</h3>
            <p className="mt-1 text-xs text-gray-500">Your affiliated teams</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border px-3 py-1">Sprint Team</span>
              <span className="rounded-full border px-3 py-1">
                Athletics Club
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border">
            <h3 className="text-sm font-semibold text-gray-900">Coaches</h3>
            <p className="mt-1 text-xs text-gray-500">
              Your assigned coaches
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border px-3 py-1">
                Coach Sarah Williams
              </span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
