import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { BookOpen, Search, Filter } from 'lucide-react';

export default function Index({ auth, articles, filters }: PageProps<{ articles: any, filters: any }>) {
    const [search, setSearch] = useState(filters?.search || '');
    const [category, setCategory] = useState(filters?.category || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('articles.index'), { search, category }, { preserveState: true });
    };

    const content = (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Knowledge Base
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Panduan lengkap, dokumentasi API, dan tutorial teknis.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <form onSubmit={handleSearch} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Pencarian</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                    placeholder="Cari artikel..."
                                />
                            </div>
                        </div>
                        <div className="w-64">
                            <label className="block text-sm font-medium text-gray-700">Kategori</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="">Semua Kategori</option>
                                <option value="General">General</option>
                                <option value="API Documentation">API Documentation</option>
                                <option value="Tutorials">Tutorials</option>
                                <option value="Troubleshooting">Troubleshooting</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Filter
                        </button>
                        {(auth.user?.role === 'SUPER_ADMIN' || auth.user?.role === 'ADMIN') && (
                            <Link href={route('articles.create')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-auto">
                                Tulis Artikel
                            </Link>
                        )}
                    </form>
                </div>

                <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
                    {articles.data.length === 0 ? (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            Tidak ada artikel ditemukan.
                        </div>
                    ) : articles.data.map((article: any) => (
                        <Link key={article.id} href={route('articles.show', article.slug)} className="flex flex-col rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow bg-white">
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-600">
                                        {article.category}
                                    </p>
                                    <div className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900">{article.title}</p>
                                        <p className="mt-3 text-base text-gray-500 line-clamp-3">
                                            {article.content.substring(0, 150)}...
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <div className="flex-shrink-0">
                                        <span className="sr-only">{article.author?.name}</span>
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                                            {article.author?.name?.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">
                                            {article.author?.name}
                                        </p>
                                        <div className="flex space-x-1 text-sm text-gray-500">
                                            <time dateTime={article.created_at}>{new Date(article.created_at).toLocaleDateString()}</time>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                    {articles.links && articles.links.map((link: any, k: number) => (
                        <Link
                            key={k}
                            href={link.url || '#'}
                            className={`mx-1 px-4 py-2 border rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>

            </div>
        </div>
    );

    return auth.user ? (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Knowledge Base</h2>}>
            <Head title="Knowledge Base" />
            {content}
        </AuthenticatedLayout>
    ) : (
        <>
            <Head title="Knowledge Base" />
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white border-b border-gray-100 p-4 flex justify-between items-center max-w-7xl mx-auto">
                    <div className="font-bold text-xl text-blue-600 flex items-center gap-2"><BookOpen/> FittDesk Docs</div>
                    <div className="flex gap-4">
                        <Link href={route('login')} className="text-gray-600 hover:text-gray-900">Log in</Link>
                    </div>
                </nav>
                {content}
            </div>
        </>
    );
}
