"use client";

import { useState, useEffect } from "react";

type ViewMode = "league" | "conference" | "division";

export default function StandingsPage() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("league");

  useEffect(() => {
    async function fetchStandings() {
      const res = await fetch("/api/standings");
      const json = await res.json();
      setStandings(json.teams || []);
      setLoading(false);
    }
    fetchStandings();
  }, []);

  if (loading) return <p className="p-4">Loading standings...</p>;

  // Grouping Helpers
  const getConferenceStandings = () => {
    const east = standings.filter((t) =>
      t.conference?.toLowerCase().includes("east")
    );
    const west = standings.filter((t) =>
      t.conference?.toLowerCase().includes("west")
    );
    return {
      east: east.sort((a, b) => b.points - a.points),
      west: west.sort((a, b) => b.points - a.points),
    };
  };

  const getDivisionStandings = () => {
    const divisions: Record<string, any[]> = {};
    standings.forEach((t) => {
      const div = t.division || "Unknown Division";
      if (!divisions[div]) divisions[div] = [];
      divisions[div].push(t);
    });
    Object.keys(divisions).forEach((d) =>
      divisions[d].sort((a, b) => b.points - a.points)
    );
    return divisions;
  };

  const { east, west } = getConferenceStandings();
  const divisions = getDivisionStandings();

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
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

      {viewMode === "league" && (
        <ul className="space-y-2">
          {standings.map((t, i) => (
            <li key={i} className="border border-gray-700 p-4 rounded-lg">
              <strong>
                {i + 1}. {t.name}
              </strong>{" "}
              — {t.points} pts
            </li>
          ))}
        </ul>
      )}

      {viewMode === "conference" && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl mb-2">🌅 Eastern Conference</h2>
            <ul className="space-y-2">
              {east.map((t, i) => (
                <li key={i} className="border border-gray-700 p-4 rounded-lg">
                  <strong>
                    {i + 1}. {t.name}
                  </strong>{" "}
                  — {t.points} pts
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl mb-2">🌄 Western Conference</h2>
            <ul className="space-y-2">
              {west.map((t, i) => (
                <li key={i} className="border border-gray-700 p-4 rounded-lg">
                  <strong>
                    {i + 1}. {t.name}
                  </strong>{" "}
                  — {t.points} pts
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {viewMode === "division" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(divisions).map(([division, teams]) => (
            <div key={division}>
              <h2 className="text-2xl mb-2">{division}</h2>
              <ul className="space-y-2">
                {teams.map((t, i) => (
                  <li key={i} className="border border-gray-700 p-4 rounded-lg">
                    <strong>
                      {i + 1}. {t.name}
                    </strong>{" "}
                    — {t.points} pts
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
