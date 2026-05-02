import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Create({ auth, projects }: PageProps<{ projects: any }>) {
    const { data, setData, post, processing, errors } = useForm({
        project_id: '',
        report_date: new Date().toISOString().split('T')[0],
        weather: '',
        workers_count: 0,
        equipment: '',
        material_received: '',
        activities: '',
        issues: '',
        notes: '',
        status: 'DRAFT',
        photo: null as File | null
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('daily_reports.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buat Laporan Harian Baru</h2>}
        >
            <Head title="Buat Laporan Harian" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <form onSubmit={submit} encType="multipart/form-data">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Departemen *</label>
                                    <select 
                                        value={data.project_id} 
                                        onChange={e => setData('project_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">-- Pilih Departemen --</option>
                                        {projects.map((p: any) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    {errors.project_id && <div className="text-red-500 text-sm mt-1">{errors.project_id}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tanggal Laporan *</label>
                                    <input 
                                        type="date" 
                                        value={data.report_date} 
                                        onChange={e => setData('report_date', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.report_date && <div className="text-red-500 text-sm mt-1">{errors.report_date}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Shift / Kondisi</label>
                                    <input 
                                        type="text" 
                                        value={data.weather} 
                                        onChange={e => setData('weather', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        placeholder="Shift Pagi, Malam, Normal, dll"
                                    />
                                    {errors.weather && <div className="text-red-500 text-sm mt-1">{errors.weather}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Total Tiket Ditangani *</label>
                                    <input 
                                        type="number" 
                                        value={data.workers_count} 
                                        onChange={e => setData('workers_count', parseInt(e.target.value))}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        min="0"
                                        required
                                    />
                                    {errors.workers_count && <div className="text-red-500 text-sm mt-1">{errors.workers_count}</div>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Ringkasan Penanganan *</label>
                                    <textarea 
                                        value={data.activities} 
                                        onChange={e => setData('activities', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        rows={4}
                                        required
                                    ></textarea>
                                    {errors.activities && <div className="text-red-500 text-sm mt-1">{errors.activities}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hardware / Aset Terkait</label>
                                    <textarea 
                                        value={data.equipment} 
                                        onChange={e => setData('equipment', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        rows={3}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pembaruan Sistem / Modul</label>
                                    <textarea 
                                        value={data.material_received} 
                                        onChange={e => setData('material_received', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        rows={3}
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Isu Eskalasi / Belum Terselesaikan</label>
                                    <textarea 
                                        value={data.issues} 
                                        onChange={e => setData('issues', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        rows={2}
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Catatan Tambahan</label>
                                    <textarea 
                                        value={data.notes} 
                                        onChange={e => setData('notes', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        rows={2}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Foto Dokumentasi</label>
                                    <input 
                                        type="file" 
                                        onChange={e => setData('photo', e.target.files ? e.target.files[0] : null)}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        accept="image/*"
                                    />
                                    {errors.photo && <div className="text-red-500 text-sm mt-1">{errors.photo}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status Laporan</label>
                                    <select 
                                        value={data.status} 
                                        onChange={e => setData('status', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="DRAFT">DRAFT</option>
                                        <option value="SUBMITTED">SUBMITTED (Ajukan)</option>
                                        <option value="APPROVED">APPROVED (Setujui)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end">
                                <Link href={route('daily_reports.index')} className="text-gray-600 hover:text-gray-900 mr-4">
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Simpan Laporan
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
