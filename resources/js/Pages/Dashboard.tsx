import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Ticket, BookOpen, FileText, ArrowRight, TrendingUp, Activity, CheckCircle2, Clock, Zap } from 'lucide-react';

export default function Dashboard({ stats, auth }: any) {
  const isAdmin = auth?.user?.role === 'SUPER_ADMIN' || auth?.user?.role === 'ADMIN';

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Dashboard" />
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white mb-8 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 p-8 md:p-10">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
                Selamat Datang kembali, {auth.user?.name}! 👋
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl font-light">
                Pantau seluruh aktivitas Helpdesk, kelola laporan harian, dan pantau penyelesaian tiket IT Anda dalam satu *dashboard* terpusat.
            </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Ticket Stat */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
            <div className="h-2 w-full bg-blue-500"></div>
            <CardContent className="p-6 relative">
                <div className="absolute top-6 right-6 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Ticket className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Tiket {isAdmin ? 'Total' : 'Aktif Anda'}
                </h3>
                <div className="text-4xl font-black text-gray-900 mb-4">{stats?.tickets || 0}</div>
                
                <div className="flex items-center text-sm text-blue-600 font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Perlu perhatian Anda</span>
                </div>
            </CardContent>
        </Card>

        {/* Knowledge Base Stat */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
            <div className="h-2 w-full bg-indigo-500"></div>
            <CardContent className="p-6 relative">
                <div className="absolute top-6 right-6 w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Artikel Knowledge Base
                </h3>
                <div className="text-4xl font-black text-gray-900 mb-4">{stats?.articles || 0}</div>
                
                <div className="flex items-center text-sm text-indigo-600 font-medium">
                    <Activity className="w-4 h-4 mr-1" />
                    <span>Dokumen aktif</span>
                </div>
            </CardContent>
        </Card>

        {/* Daily Reports Stat */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
            <div className="h-2 w-full bg-emerald-500"></div>
            <CardContent className="p-6 relative">
                <div className="absolute top-6 right-6 w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Laporan Harian
                </h3>
                <div className="text-4xl font-black text-gray-900 mb-4">{stats?.reports || 0}</div>
                
                <div className="flex items-center text-sm text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    <span>Laporan tercatat</span>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Aksi Cepat
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href={route('tickets.create')} className="w-full">
                    <Button variant="outline" className="w-full h-auto py-4 justify-start text-left font-semibold border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                        <Ticket className="w-5 h-5 mr-3 text-blue-500" />
                        <div>
                            <div>Buat Tiket Baru</div>
                            <div className="text-xs text-gray-500 font-normal mt-0.5">Laporkan kendala IT</div>
                        </div>
                    </Button>
                </Link>
                <Link href={route('daily_reports.create')} className="w-full">
                    <Button variant="outline" className="w-full h-auto py-4 justify-start text-left font-semibold border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <FileText className="w-5 h-5 mr-3 text-emerald-500" />
                        <div>
                            <div>Isi Laporan Harian</div>
                            <div className="text-xs text-gray-500 font-normal mt-0.5">Catat progres hari ini</div>
                        </div>
                    </Button>
                </Link>
                {isAdmin && (
                    <Link href={route('articles.create')} className="w-full sm:col-span-2">
                        <Button variant="outline" className="w-full h-auto py-4 justify-start text-left font-semibold border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                            <BookOpen className="w-5 h-5 mr-3 text-indigo-500" />
                            <div>
                                <div>Tulis Artikel KB</div>
                                <div className="text-xs text-gray-500 font-normal mt-0.5">Tambah panduan dokumentasi</div>
                            </div>
                        </Button>
                    </Link>
                )}
            </div>
        </div>

        {/* System Info / Motivation */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-sm text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Status Sistem
            </h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="font-medium">Core Services</span>
                    </div>
                    <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">Online</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="font-medium">Database (Vercel)</span>
                    </div>
                    <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">Online</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="font-medium">Live Chat Server</span>
                    </div>
                    <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">Online</span>
                </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                <span>Terakhir diperbarui: Baru saja</span>
            </div>
        </div>
      </div>

    </AuthenticatedLayout>
  );
}
