"use client";

import { useState, useEffect } from "react";

type ViewMode = "league" | "conference" | "division";

export default function StandingsPage() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("league");

  useEffect(() => {
    async function fetchStandings() {
      const res = await fetch(`/api/standings?view=${viewMode}`);
      const json = await res.json();
      setStandings(json.teams || []);
      setLoading(false);
    }
    fetchStandings();
  }, [viewMode]); // 👈 re-fetch each time view changes

  if (loading) return <p>Loading standings...</p>;

  const cycleView = () => {
    setViewMode((prev) =>
      prev === "league"
        ? "conference"
        : prev === "conference"
        ? "division"
        : "league"
    );
  };

  return (
    <div className="bg-[#1B1B3A] p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {viewMode === "league"
            ? "🏆 League Standings"
            : viewMode === "conference"
            ? "🏒 Conference Standings"
            : "🧭 Division Standings"}
        </h1>
        <button
          onClick={cycleView}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
        >
          {viewMode === "league"
            ? "Switch to Conference"
            : viewMode === "conference"
            ? "Switch to Division"
            : "Switch to League"}
        </button>
      </div>

      <ul className="space-y-2">
        {standings.map((t, i) => (
          <li key={i} className="border border-gray-700 p-3 rounded-lg">
            <strong>
              {i + 1}. {t.name}
            </strong>{" "}
            — {t.points} pts
          </li>
        ))}
      </ul>
    </div>
  );
}
