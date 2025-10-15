"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"league" | "conference">("league");

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

  // Helper function to group by conference
  const getConferenceStandings = () => {
    const east = standings.filter((t) =>
      t.conference.toLowerCase().includes("east")
    );
    const west = standings.filter((t) =>
      t.conference.toLowerCase().includes("west")
    );

    return {
      east: east.slice(0, 5),
      west: west.slice(0, 5),
    };
  };

  const { east, west } = getConferenceStandings();

  return (
    <main className="p-8 text-white">
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

      <div className="flex items-center justify-between mt-12 mb-4">
        <h2 className="text-3xl font-bold">
          🏆{" "}
          {viewMode === "league" ? "League Standings" : "Conference Standings"}
        </h2>
        <button
          onClick={() =>
            setViewMode(viewMode === "league" ? "conference" : "league")
          }
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
        >
          {viewMode === "league" ? "Show Conference View" : "Show League View"}
        </button>
      </div>

      {viewMode === "league" ? (
        <ul className="space-y-2">
          {standings.map((t, i) => (
            <li key={i} className="border p-4 rounded-lg">
              <strong>
                {i + 1}. {t.name}
              </strong>{" "}
              — {t.points} pts ({t.wins}-{t.losses}-{t.otLosses})
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-2">
              🌅 Eastern Conference
            </h3>
            <ul className="space-y-2">
              {east.map((t, i) => (
                <li key={i} className="border p-4 rounded-lg">
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
            <ul className="space-y-2">
              {west.map((t, i) => (
                <li key={i} className="border p-4 rounded-lg">
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
    </main>
  );
}
