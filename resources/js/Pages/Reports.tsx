import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Badge } from '@/Components/ui/badge';
import { FileText, Download, Calendar, Filter, RefreshCcw, Search, Trash2, Plus, X } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

type ReportItem = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  reportType: string;
  data: any;
  createdAt: string;
};

type ReportStats = {
  total: number;
  completed: number;
  inProgress: number;
  byType: Record<string, number>;
};

const reportTypes = [
  { value: 'all', label: 'All Reports' },
  { value: 'SLA_PERFORMANCE', label: 'SLA Performance' },
  { value: 'TICKET_SUMMARY', label: 'Ticket Summary' },
  { value: 'INCIDENT_REPORT', label: 'Incident Report' },
  { value: 'ASSET_AUDIT', label: 'Asset Audit' },
  { value: 'UPTIME_REPORT', label: 'Uptime Report' },
  { value: 'SECURITY_AUDIT', label: 'Security Audit' },
  { value: 'USER_ACTIVITY', label: 'User Activity' },
  { value: 'CUSTOM', label: 'Custom' },
];

const initialForm = {
  title: '',
  description: '',
  reportType: 'TICKET_SUMMARY',
  status: 'Completed',
  pages: 1,
};

export default function ReportsPage() {
  const { auth } = usePage<any>().props;
  const user = auth?.user;

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [stats, setStats] = useState<ReportStats>({ total: 0, completed: 0, inProgress: 0, byType: {} });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async (nextType = activeType, nextSearch = search) => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (nextType && nextType !== 'all') params.set('type', nextType);
      if (nextSearch.trim()) params.set('search', nextSearch.trim());

      const response = await axios.get(`/api/reports${params.toString() ? `?${params.toString()}` : ''}`);
      const data = response.data;

      if (!data.success) {
        throw new Error(data.error || 'Failed to load reports');
      }

      setReports(data.data.reports || []);
      setStats(data.data.stats || { total: 0, completed: 0, inProgress: 0, byType: {} });
    } catch (fetchError: any) {
      console.error('Failed to fetch reports:', fetchError);
      setError(fetchError.response?.data?.error || fetchError.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchReports(activeType, search);
  };

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    fetchReports(type, search);
  };

  const handleRefresh = () => {
    fetchReports(activeType, search);
  };

  const handleChangeForm = (field: string, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCreateReport = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');

      const reportData = {
        title: form.title,
        description: form.description,
        reportType: form.reportType,
        data: {
          status: form.status,
          pages: Number(form.pages) || 1,
          projectName: 'FittDesk IT Service Management',
        },
      };

      const response = await axios.post('/api/reports', reportData);
      const data = response.data;
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create report');
      }

      setForm(initialForm);
      setShowForm(false);
      fetchReports(activeType, search);
    } catch (createError: any) {
      console.error('Create report error:', createError);
      setError(createError.response?.data?.error || createError.message || 'Failed to create report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReport = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus Laporan?',
      text: "Laporan ini akan dihapus secara permanen dan tidak dapat dikembalikan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });
    
    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`/api/reports/${id}`);
      const data = response.data;
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete report');
      }

      fetchReports(activeType, search);
      Swal.fire('Terhapus!', 'Laporan berhasil dihapus.', 'success');
    } catch (deleteError: any) {
      console.error('Delete report error:', deleteError);
      Swal.fire('Gagal!', deleteError.response?.data?.error || deleteError.message || 'Gagal menghapus laporan.', 'error');
    }
  };

  const handleDownloadReport = (report: ReportItem) => {
    const content = `Title: ${report.title}\nType: ${report.reportType}\nDescription: ${report.description}\nData: ${JSON.stringify(report.data, null, 2)}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = window.document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${report.title.replace(/\s+/g, '_')}.txt`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const formatDataField = (data: any, field: string, fallback: string | number) => {
    if (!data) return fallback;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return parsed[field] !== undefined ? parsed[field] : fallback;
      } catch (e) {
        return fallback;
      }
    }
    return data[field] !== undefined ? data[field] : fallback;
  };

  return (
    <AuthenticatedLayout>
      <Head title="Reports" />

      <div className="mb-8 flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate, download, and manage SLA and incident reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2" onClick={() => setShowForm((s) => !s)}>
            {showForm ? <X className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            {showForm ? 'Close Form' : 'Generate Report'}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
      </div>

      {showForm ? (
        <Card className="mb-8 border-blue-200 shadow-md">
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <CardDescription>Fill in the details to generate a new report document.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreateReport}>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleChangeForm('title', e.target.value)}
                  placeholder="e.g. Q4 Ticket Resolution Summary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <select
                  id="reportType"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.reportType}
                  onChange={(e) => handleChangeForm('reportType', e.target.value)}
                >
                  {reportTypes.filter((t) => t.value !== 'all').map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(e) => handleChangeForm('status', e.target.value)}
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Estimated Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  min="1"
                  value={form.pages}
                  onChange={(e) => handleChangeForm('pages', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description & Findings</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(e) => handleChangeForm('description', e.target.value)}
                  placeholder="Summary of the report..."
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                  {submitting ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div>
              <CardTitle>Report Library</CardTitle>
              <CardDescription className="mt-1">Filter, preview, download, and delete generated reports</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search reports"
                    className="pl-9 w-64"
                  />
                </div>
                <Button type="submit" variant="outline" size="icon"><Search className="w-4 h-4" /></Button>
              </form>
              <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={activeType}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                {reportTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No reports found. {search || activeType !== 'all' ? 'Try clearing your filters.' : 'Generate your first report.'}
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => {
                const status = formatDataField(report.data, 'status', 'Completed');
                const pages = formatDataField(report.data, 'pages', 1);
                const projectName = formatDataField(report.data, 'projectName', 'FittDesk');
                
                return (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{report.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                            <span>{pages} pages</span>
                            <span>{projectName}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 md:ml-4">
                          <div className="flex flex-col gap-2 min-w-[120px] items-end">
                            <Badge variant="outline" className="text-xs bg-gray-50">{report.reportType.replace(/_/g, ' ')}</Badge>
                            <Badge 
                              className={
                                status === 'Completed' ? 'bg-green-100 text-green-800' :
                                status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {status}
                            </Badge>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleDownloadReport(report)} title="Download Report">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteReport(report.id)} title="Delete Report" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  );
}
