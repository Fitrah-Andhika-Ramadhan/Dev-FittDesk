import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Activity, Server, Database, Globe, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function SystemStatus() {
  const services = [
    { name: 'Website Utama FittDesk', type: 'Frontend', status: 'Operational', uptime: '99.9%', icon: Globe },
    { name: 'Sistem ERP Internal', type: 'Backend', status: 'Operational', uptime: '99.5%', icon: Database },
    { name: 'HRIS (Sistem Cuti & Absensi)', type: 'Web App', status: 'Degraded', uptime: '98.2%', icon: Server },
    { name: 'Email Server Exchange', type: 'Infrastructure', status: 'Operational', uptime: '99.99%', icon: Server },
    { name: 'Gateway Pembayaran', type: 'API', status: 'Outage', uptime: '95.0%', icon: Activity },
    { name: 'VPN Kantor', type: 'Network', status: 'Operational', uptime: '99.8%', icon: Globe },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Operational':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'Degraded':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><AlertCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'Outage':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200"><XCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Operational') return 'border-l-4 border-l-green-500';
    if (status === 'Degraded') return 'border-l-4 border-l-yellow-500';
    if (status === 'Outage') return 'border-l-4 border-l-red-500';
    return '';
  };

  return (
    <AuthenticatedLayout>
      <Head title="System Status" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Status Sistem & Layanan</h1>
        <p className="text-gray-600 mt-2">Pantau kondisi operasional layanan IT internal dan eksternal secara real-time.</p>
      </div>

      <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <div>
          <h3 className="font-semibold text-green-900">Secara Umum Layanan Berjalan Normal</h3>
          <p className="text-sm text-green-700">Terakhir diperbarui: {new Date().toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Card key={index} className={`hover:shadow-md transition-shadow ${getStatusColor(service.status)}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <service.icon className="w-5 h-5 text-gray-500" />
                    {service.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{service.type}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Uptime (30 Hari)</span>
                  <span className="font-semibold text-gray-900">{service.uptime}</span>
                </div>
                <div>
                  {getStatusBadge(service.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">Riwayat Insiden Terakhir</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5"></div>
              <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
            </div>
            <div className="pb-4">
              <p className="font-semibold">Gateway Pembayaran Tidak Dapat Diakses</p>
              <p className="text-sm text-gray-500">2 Mei 2026 10:15 WIB</p>
              <p className="text-sm mt-1">Vendor gateway pembayaran pihak ketiga sedang mengalami gangguan jaringan. Tim internal sedang berkoordinasi dengan tim support terkait.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1.5"></div>
              <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
            </div>
            <div className="pb-4">
              <p className="font-semibold">Kelambatan Sistem HRIS</p>
              <p className="text-sm text-gray-500">1 Mei 2026 08:00 WIB</p>
              <p className="text-sm mt-1">Traffic lonjakan saat absensi pagi menyebabkan respon aplikasi lambat. Kapasitas server telah ditingkatkan (Auto-scaling).</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5"></div>
            </div>
            <div>
              <p className="font-semibold">Maintenance Server Email Selesai</p>
              <p className="text-sm text-gray-500">28 April 2026 02:00 WIB</p>
              <p className="text-sm mt-1">Upgrade firmware keamanan untuk server email internal telah selesai dilakukan tanpa downtime yang signifikan.</p>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
