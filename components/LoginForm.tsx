import React from "react";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onToggleForm: () => void;
}

export default function LoginForm({ onToggleForm }: LoginFormProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="text-center lg:text-left mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Don't have an account?{" "}
          <button 
            type="button"
            onClick={onToggleForm}
            className="font-semibold text-[#1E88E5] hover:text-[#1565C0] transition-colors"
          >
            Sign up for free
          </button>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="email"
              required
              className="appearance-none block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white placeholder-slate-400 focus:outline-none focus:border-[#1E88E5] focus:ring-4 focus:ring-[#1E88E5]/10 transition-all text-slate-900 shadow-sm"
              placeholder="you@hospital.org"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <a href="#" className="text-xs font-semibold text-[#1E88E5] hover:text-[#1565C0]">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="password"
              required
              className="appearance-none block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white placeholder-slate-400 focus:outline-none focus:border-[#1E88E5] focus:ring-4 focus:ring-[#1E88E5]/10 transition-all text-slate-900 shadow-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          className="group w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#1E88E5] hover:bg-[#1565C0] hover:shadow-md transition-all active:scale-[0.98]"
        >
          Sign In
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <div className="relative my-6 text-center text-sm">
          <span className="relative z-10 bg-slate-50 px-2 text-slate-500">Or continue with</span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
        </div>

         <button
          type="button"
          className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
      </form>
    </div>
  );
}
