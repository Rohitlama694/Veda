import Link from "next/link";
import { ArrowRight, ShieldCheck, GraduationCap, Users } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8F6F0] flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="px-6 py-5 md:px-12 flex items-center justify-between border-b border-[#ECE7DC] bg-white/60 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-[#E2BD62]">VEDA</span>
          <span className="text-[10px] font-bold tracking-widest text-[#0F2E22] uppercase bg-[#8CE6B6] px-2 py-0.5 rounded">
            PORTAL
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0F2E22] text-[#8CE6B6] hover:bg-[#0A2218] transition-all shadow-xs"
          >
            Admin Dashboard →
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E7F7EF] border border-[#B7ECCF] text-xs font-semibold text-[#158054]">
          <span className="w-2 h-2 rounded-full bg-[#2EB872] animate-pulse" />
          Full-Stack Internship Submission & Review Portal
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#162520] leading-tight">
          Structured Internship Tracking for <span className="text-[#B48535]">Engineering Teams</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#586B63] leading-relaxed">
          VEDA connects internship administrators, supervising mentors, and interns in a single cohesive workspace. Monitor milestone tasks, inspect versioned GitHub submissions, and track structured review feedback.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/admin"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0F2E22] text-[#8CE6B6] font-bold text-sm hover:bg-[#0A2218] transition-all shadow-md flex items-center justify-center gap-2"
          >
            Open Administrator Overview <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-[#DED7C8] text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-all shadow-2xs"
          >
            Portal Login
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="bg-white p-5 rounded-2xl border border-[#EAE5DA] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#E7F7EF] text-[#158054] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#182622]">Administrator Overview</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time KPIs for user quotas, active intern progress, pending reviews, and approval rates.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EAE5DA] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#E5F5FA] text-[#0284C7] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#182622]">Mentor & Group Governance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Supervise cohort allocations, mentor reviews, and group milestone completion percentages.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EAE5DA] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#FEF5E7] text-[#D97706] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#182622]">Versioned Submissions</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Never overwrite earlier attempts. Audit feedback histories and resubmissions across tasks.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-[#ECE7DC] text-center text-xs text-slate-400">
        © 2026 VEDA Internship Task Portal. Designed for Django REST Framework backend integration.
      </footer>
    </main>
  );
}
