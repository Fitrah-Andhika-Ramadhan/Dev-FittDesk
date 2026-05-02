import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Show({ auth, article }: PageProps<{ article: any }>) {
    
    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Hapus Artikel?',
            text: "Artikel ini akan dihapus secara permanen.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            router.delete(route('articles.destroy', article.id), {
                onSuccess: () => Swal.fire('Terhapus!', 'Artikel berhasil dihapus.', 'success'),
            });
        }
    };

    const content = (
        <div className="py-12">
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link href={route('articles.index')} className="text-gray-600 hover:text-gray-900 flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2"/> Kembali ke Knowledge Base
                    </Link>
                    
                    {(auth.user?.role === 'SUPER_ADMIN' || auth.user?.role === 'ADMIN') && (
                        <div className="flex gap-2">
                            <Link href={route('articles.edit', article.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                            <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                <Trash2 className="w-4 h-4 mr-2" /> Hapus
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                    <div className="mb-8 border-b pb-8">
                        <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">{article.category}</span>
                        <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            {article.title}
                        </h1>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                            <div className="flex-shrink-0 mr-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                                    {article.author?.name?.charAt(0)}
                                </div>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{article.author?.name}</p>
                                <p>Ditulis pada {new Date(article.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-blue prose-lg max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}>
                    </div>
                </div>
            </div>
        </div>
    );

    return auth.user ? (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{article.title}</h2>}>
            <Head title={article.title} />
            {content}
        </AuthenticatedLayout>
    ) : (
        <>
            <Head title={article.title} />
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white border-b border-gray-100 p-4 flex justify-between items-center max-w-7xl mx-auto">
                    <div className="font-bold text-xl text-blue-600 flex items-center gap-2">FittDesk Docs</div>
                    <div className="flex gap-4">
                        <Link href={route('login')} className="text-gray-600 hover:text-gray-900">Log in</Link>
                    </div>
                </nav>
                {content}
            </div>
        </>
    );
}
