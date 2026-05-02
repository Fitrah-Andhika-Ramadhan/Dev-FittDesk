import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Create({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        description: '',
        priority: 'MEDIUM',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tickets.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buat Tiket Baru</h2>}
        >
            <Head title="Buat Tiket" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Subjek Kendala *</label>
                                    <input 
                                        type="text" 
                                        value={data.subject} 
                                        onChange={e => setData('subject', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                        placeholder="Contoh: Email perusahaan tidak bisa menerima pesan"
                                    />
                                    {errors.subject && <div className="text-red-500 text-sm mt-1">{errors.subject}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tingkat Prioritas</label>
                                    <select 
                                        value={data.priority} 
                                        onChange={e => setData('priority', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="LOW">LOW - Kendala ringan, tidak mengganggu operasional</option>
                                        <option value="MEDIUM">MEDIUM - Mengganggu operasional sebagian</option>
                                        <option value="HIGH">HIGH - Operasional terganggu, butuh segera ditangani</option>
                                        <option value="CRITICAL">CRITICAL - Sistem down, butuh penanganan instan</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Deskripsi Detail *</label>
                                    <textarea 
                                        value={data.description} 
                                        onChange={e => setData('description', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        rows={6}
                                        required
                                        placeholder="Jelaskan secara detail kendala yang dialami..."
                                    ></textarea>
                                    {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end">
                                <Link href={route('tickets.index')} className="text-gray-600 hover:text-gray-900 mr-4">
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Kirim Tiket
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
