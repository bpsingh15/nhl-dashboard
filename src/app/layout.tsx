import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "NHL Dashboard",
  description: "Live NHL stats and standings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0B1D] text-white flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Right side: header + main content */}
        <div className="flex-1 flex flex-col bg-[#11112B]">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-8 border-b border-gray-800">
            <h1 className="text-xl font-semibold">🏒 NHL Dashboard</h1>
            <div className="flex items-center gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg text-sm">
                Notifications
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-600"></div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
