import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Printer, Edit, ArrowLeft } from 'lucide-react';

export default function Show({ auth, report }: PageProps<{ report: any }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Laporan Harian</h2>}
        >
            <Head title="Detail Laporan Harian" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-4 flex justify-between items-center">
                        <Link href={route('daily_reports.index')} className="text-gray-600 hover:text-gray-900 flex items-center font-semibold">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar
                        </Link>
                        <div className="flex gap-2">
                            <Link href={route('daily_reports.edit', report.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                            <a href={route('daily_reports.pdf', report.id)} target="_blank" rel="noreferrer" className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded flex items-center">
                                <Printer className="w-4 h-4 mr-2" /> Print / PDF
                            </a>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        
                        <div className="text-center mb-8 border-b pb-4">
                            <h1 className="text-2xl font-bold uppercase">Dokumentasi Laporan Harian IT</h1>
                            <p className="text-gray-500">FittDesk IT Service Management</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500">Departemen</h3>
                                <p className="text-lg">{report.project_name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500">Tanggal Laporan</h3>
                                <p className="text-lg">{new Date(report.report_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500">Shift / Kondisi</h3>
                                <p className="text-lg">{report.weather || '-'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500">Total Tiket Ditangani</h3>
                                <p className="text-lg">{report.workers_count} Tiket</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500">Status</h3>
                                <p className="text-lg">
                                    <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                                        report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        report.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {report.status}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500">Dibuat Oleh</h3>
                                <p className="text-lg">{report.user?.name || 'Unknown'}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-md font-bold bg-gray-100 p-2 mb-3">Detail Pekerjaan</h3>
                            
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-700">Ringkasan Penanganan:</h4>
                                <div className="mt-1 text-gray-800 whitespace-pre-wrap border rounded p-3 bg-gray-50">
                                    {report.activities}
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-700">Hardware / Aset Terkait:</h4>
                                <div className="mt-1 text-gray-800 whitespace-pre-wrap border rounded p-3 bg-gray-50">
                                    {report.equipment || '-'}
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-700">Pembaruan Sistem / Modul:</h4>
                                <div className="mt-1 text-gray-800 whitespace-pre-wrap border rounded p-3 bg-gray-50">
                                    {report.material_received || '-'}
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-700">Isu Eskalasi / Belum Terselesaikan:</h4>
                                <div className="mt-1 text-gray-800 whitespace-pre-wrap border rounded p-3 bg-gray-50">
                                    {report.issues || '-'}
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-700">Catatan Tambahan:</h4>
                                <div className="mt-1 text-gray-800 whitespace-pre-wrap border rounded p-3 bg-gray-50">
                                    {report.notes || '-'}
                                </div>
                            </div>
                        </div>

                        {report.photo_path && (
                            <div className="mb-6">
                                <h3 className="text-md font-bold bg-gray-100 p-2 mb-3">Dokumentasi Foto</h3>
                                <div className="text-center">
                                    <img 
                                        src={`/storage/${report.photo_path}`} 
                                        alt="Dokumentasi" 
                                        className="mx-auto border rounded shadow-sm max-w-full"
                                        style={{ maxHeight: '500px' }}
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
