import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  FlaskConical,
  ShieldCheck,
  User,
  Headphones,
  BookOpen,
  BarChart3,
  Zap,
} from 'lucide-react';

interface DemoAccount {
  label: string;
  role: string;
  email: string;
  password: string;
  color: string;
  icon: React.ReactNode;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: 'Super Admin',
    role: 'Full Access',
    email: 'admin@fittdesk.com',
    password: 'password',
    color: 'bg-violet-50 border-violet-200 hover:border-violet-400',
    icon: <ShieldCheck className="w-4 h-4 text-violet-600" />,
  },
  {
    label: 'Admin',
    role: 'Manage Tickets',
    email: 'admin2@fittdesk.com',
    password: 'password',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    icon: <User className="w-4 h-4 text-blue-600" />,
  },
  {
    label: 'User / Staff',
    role: 'Submit Tickets',
    email: 'user@fittdesk.com',
    password: 'password',
    color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
    icon: <Headphones className="w-4 h-4 text-emerald-600" />,
  },
];

export default function Login({
  status,
  appEnv,
}: {
  status?: string;
  appEnv?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isDev = appEnv === 'local';

  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  const fillDemo = (account: DemoAccount) => {
    setData((prev) => ({ ...prev, email: account.email, password: account.password }));
  };

  return (
    <div className="min-h-screen bg-slate-100 overflow-hidden">
      <Head title="Log in" />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(29,78,216,1),rgba(79,70,229,1))]" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_10%_20%,white,transparent_22%),radial-gradient(circle_at_60%_25%,rgba(255,255,255,0.7),transparent_18%),radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.28),transparent_22%)]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] rounded-[30px] overflow-hidden shadow-2xl bg-white">

          {/* ── Left Panel ── */}
          <section className="hidden lg:flex flex-col justify-between p-12 xl:p-16 text-white relative bg-[linear-gradient(135deg,rgba(37,99,235,1),rgba(67,56,202,1))]">
            <div className="absolute inset-0 bg-[url('/hero-metro-paragon.jpg')] bg-cover bg-center opacity-10" />

            {/* Header */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-12">
                <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/15">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/70">FittDesk</p>
                  <h1 className="text-2xl font-bold">Admin Portal</h1>
                </div>
              </div>

              <div className="max-w-xl space-y-6 mt-4">
                <div className="h-12 w-12 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white text-2xl shadow-lg">
                  ✦
                </div>
                <h2 className="text-5xl xl:text-6xl font-black leading-tight">
                  Integrated
                  <br />
                  Support Center
                </h2>
                <p className="text-base xl:text-lg text-white/80 max-w-lg leading-relaxed">
                  Platform terpadu untuk pelaporan kendala IT, manajemen tiket helpdesk, Knowledge
                  Base, dan dokumentasi operasional perusahaan — semua dalam satu dasbor.
                </p>
              </div>

              {/* Feature pills */}
              <div className="mt-10 flex flex-wrap gap-3">
                {[
                  { icon: <Headphones className="w-3.5 h-3.5" />, text: 'IT Helpdesk' },
                  { icon: <BookOpen className="w-3.5 h-3.5" />, text: 'Knowledge Base' },
                  { icon: <BarChart3 className="w-3.5 h-3.5" />, text: 'Live Analytics' },
                  { icon: <Zap className="w-3.5 h-3.5" />, text: 'Real-time Notif' },
                ].map(({ icon, text }) => (
                  <span
                    key={text}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/15 text-white/90 backdrop-blur"
                  >
                    {icon}
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer stats */}
            <div className="relative">
              <div className="grid grid-cols-3 gap-4 max-w-lg mb-8">
                {[
                  ['Tickets', '24/7'],
                  ['Knowledge', 'Live'],
                  ['IT Support', 'Ready'],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/70">{label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/60">© 2026 FittDesk. All rights reserved.</p>
            </div>
          </section>

          {/* ── Right Panel ── */}
          <section className="flex items-center justify-center bg-white p-4 sm:p-6 lg:p-10">
            <div className="w-full max-w-md">

              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">FittDesk</p>
                  <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
                </div>
              </div>

              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0 pb-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500 font-semibold mb-2">Welcome Back!</p>
                  <CardTitle className="text-3xl sm:text-4xl font-black text-slate-900">Login Admin</CardTitle>
                  <CardDescription className="mt-2 text-slate-500 leading-relaxed">
                    Masuk ke dasbor FittDesk untuk mengelola tiket, memantau performa sistem IT,
                    dan mengakses Knowledge Base perusahaan.
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-0 pb-0">
                  <form onSubmit={handleLogin} className="space-y-4">

                    {/* Status / error alerts */}
                    {status && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm">
                        <span>{status}</span>
                      </div>
                    )}
                    {(errors.email || errors.password) && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.email || errors.password}</span>
                      </div>
                    )}

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@fittdesk.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        disabled={processing}
                        className="w-full h-12 rounded-xl border-slate-200 bg-white focus-visible:ring-2 focus-visible:ring-blue-500"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Password</label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          value={data.password}
                          onChange={(e) => setData('password', e.target.value)}
                          disabled={processing}
                          className="w-full h-12 rounded-xl border-slate-200 bg-white pr-12 focus-visible:ring-2 focus-visible:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((c) => !c)}
                          className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-slate-700"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center mt-4">
                      <input
                        id="remember_me"
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                      />
                      <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                        Remember me
                      </label>
                    </div>

                    {/* Submit */}
                    <Button
                      id="btn-login"
                      type="submit"
                      disabled={processing}
                      className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-lg shadow-slate-900/10"
                    >
                      {processing ? 'Logging in...' : 'Login Now'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>

                    {/* ── Demo Accounts (DEV only) ── */}
                    {isDev && (
                      <div className="mt-2 rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-4 space-y-3">
                        <div className="flex items-center gap-2 text-amber-700">
                          <FlaskConical className="w-4 h-4 shrink-0" />
                          <p className="text-xs font-bold uppercase tracking-widest">Demo Accounts (Dev Only)</p>
                        </div>
                        <div className="grid gap-2">
                          {DEMO_ACCOUNTS.map((acc) => (
                            <button
                              key={acc.email}
                              type="button"
                              onClick={() => fillDemo(acc)}
                              className={`w-full flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all duration-150 cursor-pointer ${acc.color}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
                                  {acc.icon}
                                </span>
                                <div>
                                  <p className="text-xs font-bold text-slate-800">{acc.label}</p>
                                  <p className="text-[10px] text-slate-500">{acc.email}</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                                {acc.role}
                              </span>
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-amber-600 text-center">
                          Klik akun di atas untuk mengisi form otomatis · password: <strong>password</strong>
                        </p>
                      </div>
                    )}

                    {/* Info cards */}
                    <div className="grid gap-3 sm:grid-cols-2 pt-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900 mb-1">Lupa password?</p>
                        <p className="text-xs text-slate-500">Hubungi admin internal jika akses bermasalah.</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900 mb-1">System Ready</p>
                        <p className="text-xs text-slate-500">IT Support, Knowledge Base & Reporting tersedia.</p>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
