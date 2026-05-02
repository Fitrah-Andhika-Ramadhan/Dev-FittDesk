import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { AlertCircle, ArrowRight, Building2, Eye, EyeOff } from 'lucide-react';

export default function Login({ status }: { status?: string }) {
  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-100 overflow-hidden">
      <Head title="Log in" />
      
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(29,78,216,1),rgba(79,70,229,1))]" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_10%_20%,white,transparent_22%),radial-gradient(circle_at_60%_25%,rgba(255,255,255,0.7),transparent_18%),radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.28),transparent_22%)]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] rounded-[30px] overflow-hidden shadow-2xl bg-white">
          <section className="hidden lg:flex flex-col justify-between p-12 xl:p-16 text-white relative bg-[linear-gradient(135deg,rgba(37,99,235,1),rgba(67,56,202,1))]">
            <div className="absolute inset-0 bg-[url('/hero-metro-paragon.jpg')] bg-cover bg-center opacity-10" />
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
                  *
                </div>
                <h2 className="text-5xl xl:text-6xl font-black leading-tight">
                  Hello
                  <br />
                  FittDesk! 👋
                </h2>
                <p className="text-base xl:text-lg text-white/80 max-w-lg leading-relaxed">
                  Kelola proyek, SPR, dokumen, dan laporan dari satu dashboard yang bersih dan profesional.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-3 gap-4 max-w-lg mb-8">
                {[
                  ['Projects', '01'],
                  ['Docs', 'Live'],
                  ['SPR', 'Ready'],
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

          <section className="flex items-center justify-center bg-white p-4 sm:p-6 lg:p-10">
            <div className="w-full max-w-md">
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
                  <CardDescription className="mt-2 text-slate-500">Masuk ke dashboard monitoring FittDesk.</CardDescription>
                </CardHeader>

                <CardContent className="px-0 pb-0">
                  <form onSubmit={handleLogin} className="space-y-4">
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

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                      <Input
                        type="email"
                        placeholder="admin@fittdesk.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        disabled={processing}
                        className="w-full h-12 rounded-xl border-slate-200 bg-white focus-visible:ring-2 focus-visible:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          value={data.password}
                          onChange={(e) => setData('password', e.target.value)}
                          disabled={processing}
                          className="w-full h-12 rounded-xl border-slate-200 bg-white pr-12 focus-visible:ring-2 focus-visible:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-slate-700"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

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

                    <Button
                      type="submit"
                      disabled={processing}
                      className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-lg shadow-slate-900/10"
                    >
                      {processing ? 'Logging in...' : 'Login Now'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>



                    <div className="grid gap-3 sm:grid-cols-2 pt-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900 mb-1">Forgot password?</p>
                        <p className="text-xs text-slate-500">Hubungi admin internal jika akses bermasalah.</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900 mb-1">System Ready</p>
                        <p className="text-xs text-slate-500">Project control, docs, reports, and SPR are available.</p>
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
