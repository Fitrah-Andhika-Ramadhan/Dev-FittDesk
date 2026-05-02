import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Ticket, BookOpen, FileText } from 'lucide-react';

export default function Dashboard({ stats, auth }: any) {
  const isAdmin = auth?.user?.role === 'SUPER_ADMIN' || auth?.user?.role === 'ADMIN';

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Dashboard" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Selamat Datang, {auth.user?.name}
        </h1>
        <p className="text-gray-600 mt-2">
          FittDesk Helpdesk & Service Center
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-500" />
              Tiket Service Desk {isAdmin ? '(Total)' : '(Milik Saya)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {stats?.tickets || 0}
            </div>
            <Link href={route('tickets.index')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Lihat Tiket &rarr;
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-500" />
              Artikel Knowledge Base (Total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {stats?.articles || 0}
            </div>
            <Link href={route('articles.index')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Jelajahi Knowledge Base &rarr;
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              Laporan Harian (Milik Saya)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {stats?.reports || 0}
            </div>
            <Link href={route('daily_reports.index')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Kelola Laporan Harian &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>

    </AuthenticatedLayout>
  );
}
