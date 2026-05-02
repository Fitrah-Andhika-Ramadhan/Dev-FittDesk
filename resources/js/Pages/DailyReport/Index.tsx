import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FileText, Plus, Edit, Trash2, Printer, Search, Download } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Index({ auth, reports, projects, filters }: PageProps<{ reports: any, projects: any, filters: any }>) {
    const [projectFilter, setProjectFilter] = useState(filters?.project_id || '');
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('daily_reports.index'), {
            project_id: projectFilter,
            date_from: dateFrom,
            date_to: dateTo,
            status: statusFilter
        }, { preserveState: true });
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Hapus Laporan Harian?',
            text: "Laporan ini akan dihapus secara permanen.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            router.delete(route('daily_reports.destroy', id), {
                onSuccess: () => Swal.fire('Terhapus!', 'Laporan harian berhasil dihapus.', 'success'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Harian Kerja</h2>}
        >
            <Head title="Laporan Harian" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Filter Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6 p-6">
                        <form onSubmit={handleFilter} className="flex flex-wrap gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Departemen / Klien</label>
                                <select 
                                    value={projectFilter} 
                                    onChange={e => setProjectFilter(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="">Semua Departemen</option>
                                    {projects.map((p: any) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Dari</label>
                                <input 
                                    type="date" 
                                    value={dateFrom} 
                                    onChange={e => setDateFrom(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Sampai</label>
                                <input 
                                    type="date" 
                                    value={dateTo} 
                                    onChange={e => setDateTo(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select 
                                    value={statusFilter} 
                                    onChange={e => setStatusFilter(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="DRAFT">DRAFT</option>
                                    <option value="SUBMITTED">SUBMITTED</option>
                                    <option value="APPROVED">APPROVED</option>
                                </select>
                            </div>
                            <div>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                    <Search className="w-4 h-4 mr-2" /> Filter
                                </button>
                            </div>
                            <div className="ml-auto">
                                <Link
                                    href={route('daily_reports.create')}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Buat Laporan Baru
                                </Link>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departemen</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift / Kondisi</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Insiden</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reports.data.length === 0 ? (
                                        <tr><td colSpan={6} className="px-6 py-4 text-center">Tidak ada laporan ditemukan.</td></tr>
                                    ) : reports.data.map((report: any) => (
                                        <tr key={report.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(report.report_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{report.project_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{report.weather}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{report.workers_count} Tiket</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    report.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                                <Link href={route('daily_reports.show', report.id)} className="text-blue-600 hover:text-blue-900" title="Lihat">
                                                    <FileText className="w-5 h-5" />
                                                </Link>
                                                <Link href={route('daily_reports.edit', report.id)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <a href={route('daily_reports.pdf', report.id)} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900" title="Print/PDF">
                                                    <Printer className="w-5 h-5" />
                                                </a>
                                                <button onClick={() => handleDelete(report.id)} className="text-red-600 hover:text-red-900" title="Hapus">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {/* Pagination (Simplified) */}
                            <div className="mt-4">
                                {reports.links && reports.links.map((link: any, k: number) => (
                                    <Link
                                        key={k}
                                        href={link.url || '#'}
                                        className={`inline-block px-3 py-1 border ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
