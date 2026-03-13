"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

type Assignment = {
  id: number;
  athlete: number;
  athlete_name: string;
  athlete_email: string;
  athlete_username: string;
  assigned_at: string;
  is_active: boolean;
};

type Athlete = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  date_joined: string;
};

export default function AthletesListPage() {
  const router = useRouter();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAthletes();
  }, []);

  const fetchAthletes = async () => {
    try {
      const response = await fetch("/api/coach/athletes/", {
        credentials: "include",
      });

      if (response.ok) {
        const data: Assignment[] = await response.json();
        // Transform assignment data to athlete format
        const athletesList: Athlete[] = data.map((assignment) => {
          const [firstName, ...lastNameParts] = (assignment.athlete_name || '').split(' ');
          return {
            id: assignment.athlete,
            username: assignment.athlete_username,
            first_name: firstName || '',
            last_name: lastNameParts.join(' ') || '',
            email: assignment.athlete_email,
            date_joined: assignment.assigned_at,
          };
        });
        setAthletes(athletesList);
      } else {
        console.error("Failed to fetch athletes:", response.status);
      }
    } catch (err) {
      console.error("Error fetching athletes:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAthletes = athletes.filter((athlete) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${athlete.first_name} ${athlete.last_name}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      athlete.username.toLowerCase().includes(searchLower) ||
      athlete.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6 space-y-5">
      <header>
        <h1 className="text-xl font-semibold text-gray-900">My Athletes</h1>
        <p className="text-sm text-gray-500">View and manage your athletes</p>
      </header>

      {/* Search */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search athletes by name, username, or email..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
        />
      </div>

      {/* Athletes List */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900">All Athletes</h2>
          <p className="text-xs text-gray-500">
            {filteredAthletes.length} athlete{filteredAthletes.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : filteredAthletes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">
              {searchQuery ? "No athletes found matching your search" : "No athletes yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Athlete</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAthletes.map((athlete) => {
                  const displayName =
                    athlete.first_name || athlete.last_name
                      ? `${athlete.first_name} ${athlete.last_name}`.trim()
                      : athlete.username;
                  
                  const initial = displayName ? displayName[0]?.toUpperCase() : '?';

                  return (
                    <tr key={athlete.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {initial}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{displayName}</p>
                            <p className="text-xs text-gray-500">@{athlete.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{athlete.email}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(athlete.date_joined).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/coach/athletes/${athlete.id}`)}
                            className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/coach/messages?compose=true&athlete=${athlete.id}`)}
                            className="rounded-full border border-blue-300 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50"
                          >
                            Message
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
