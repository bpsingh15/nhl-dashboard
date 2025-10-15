"use client";

import { useEffect, useState } from "react";

type ViewMode = "league" | "conference" | "division";

export default function HomePage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("league");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/top-scorers");
        const json = await res.json();
        setPlayers(json.topScorers || []);
      } catch (err) {
        console.error("Failed to fetch players:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchStandings() {
      try {
        const res = await fetch("/api/standings");
        const json = await res.json();
        setStandings(json.teams || []);
      } catch (err) {
        console.error("Failed to fetch standings:", err);
      }
    }
    fetchStandings();
  }, []);

  if (loading) return <p className="p-4">Loading dashboard...</p>;

  // 🧮 Group by conference
  const getConferenceStandings = () => {
    const east = standings
      .filter((t) => t.conference?.toLowerCase().includes("east"))
      .sort((a, b) => b.points - a.points);
    const west = standings
      .filter((t) => t.conference?.toLowerCase().includes("west"))
      .sort((a, b) => b.points - a.points);
    return { east, west };
  };

  // 🧮 Group by division
  const getDivisionStandings = () => {
    const divisions: Record<string, any[]> = {};
    standings.forEach((team) => {
      const div = team.division || "Unknown Division";
      if (!divisions[div]) divisions[div] = [];
      divisions[div].push(team);
    });

    Object.keys(divisions).forEach((div) => {
      divisions[div].sort((a, b) => b.points - a.points);
    });

    return divisions;
  };

  const { east, west } = getConferenceStandings();
  const divisions = getDivisionStandings();

  // 🔁 Button cycle logic
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
    <main className="p-8 text-white">
      {/* 🏒 Top Scorers */}
      <h1 className="text-3xl font-bold mb-4">
        🏒 Top Scorers (Last 5–10 Games)
      </h1>
      <ul className="space-y-2">
        {players.map((p, i) => (
          <li key={i} className="border p-4 rounded-lg">
            <strong>{p.name}</strong> — {p.goals} G / {p.assists} A
          </li>
        ))}
      </ul>

      {/* 🏆 Standings Header + Toggle */}
      <div className="flex items-center justify-between mt-12 mb-4">
        <h2 className="text-3xl font-bold">
          {viewMode === "league"
            ? "🏆 League Standings"
            : viewMode === "conference"
            ? "🏒 Conference Standings"
            : "🧭 Division Standings"}
        </h2>
        <button
          onClick={cycleView}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
        >
          {viewMode === "league"
            ? "Switch to Conference"
            : viewMode === "conference"
            ? "Switch to Division"
            : "Switch to League"}
        </button>
      </div>

      {/* 🧮 League View */}
      {viewMode === "league" && (
        <ul className="space-y-2 max-h-[80vh] overflow-y-auto border rounded-lg p-2">
          {standings.map((t, i) => (
            <li key={i} className="border p-3 rounded-md">
              <strong>
                {i + 1}. {t.name}
              </strong>{" "}
              — {t.points} pts ({t.wins}-{t.losses}-{t.otLosses})
            </li>
          ))}
        </ul>
      )}

      {/* 🧮 Conference View */}
      {viewMode === "conference" && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-2">
              🌅 Eastern Conference
            </h3>
            <ul className="space-y-2 border rounded-lg p-2 max-h-[80vh] overflow-y-auto">
              {east.map((t, i) => (
                <li key={i} className="border p-3 rounded-md">
                  <strong>
                    {i + 1}. {t.name}
                  </strong>{" "}
                  — {t.points} pts
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2">
              🌄 Western Conference
            </h3>
            <ul className="space-y-2 border rounded-lg p-2 max-h-[80vh] overflow-y-auto">
              {west.map((t, i) => (
                <li key={i} className="border p-3 rounded-md">
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

      {/* 🧮 Division View */}
      {viewMode === "division" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(divisions).map(([division, teams]) => (
            <div key={division}>
              <h3 className="text-2xl font-semibold mb-2">{division}</h3>
              <ul className="space-y-2 border rounded-lg p-2 max-h-[80vh] overflow-y-auto">
                {teams.map((t, i) => (
                  <li key={i} className="border p-3 rounded-md">
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
    </main>
  );
}
