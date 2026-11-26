import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-500 flex items-center justify-center text-2xl font-bold mb-4">
        404
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        The requested administration page or route could not be found.
      </p>
      <Link
        href="/dashboard"
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-xs font-semibold text-white shadow-lg shadow-pink-500/20 hover:opacity-90 transition-opacity"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

