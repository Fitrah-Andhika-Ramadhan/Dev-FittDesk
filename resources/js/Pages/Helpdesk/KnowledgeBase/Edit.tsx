import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Edit({ auth, article }: PageProps<{ article: any }>) {
    const { data, setData, put, processing, errors } = useForm({
        title: article.title,
        content: article.content,
        category: article.category,
        status: article.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('articles.update', article.id));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Artikel</h2>}>
            <Head title="Edit Artikel" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Judul Artikel</label>
                                    <input 
                                        type="text" 
                                        value={data.title} 
                                        onChange={e => setData('title', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Kategori</label>
                                    <select 
                                        value={data.category} 
                                        onChange={e => setData('category', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="General">General</option>
                                        <option value="API Documentation">API Documentation</option>
                                        <option value="Tutorials">Tutorials</option>
                                        <option value="Troubleshooting">Troubleshooting</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Konten</label>
                                    <textarea 
                                        value={data.content} 
                                        onChange={e => setData('content', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        rows={15}
                                        required
                                    ></textarea>
                                    {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select 
                                        value={data.status} 
                                        onChange={e => setData('status', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="DRAFT">DRAFT</option>
                                        <option value="PUBLISHED">PUBLISHED</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end">
                                <Link href={route('articles.index')} className="text-gray-600 hover:text-gray-900 mr-4">
                                    Batal
                                </Link>
                                <button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Update Artikel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
