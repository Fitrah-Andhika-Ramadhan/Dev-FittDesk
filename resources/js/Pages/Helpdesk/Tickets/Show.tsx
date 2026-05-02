import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Show({ auth, ticket, agents, isAdmin }: PageProps<{ ticket: any, agents: any, isAdmin: boolean }>) {
    const { data, setData, put, processing } = useForm({
        status: ticket.status,
        assigned_to: ticket.assigned_to || '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('tickets.update', ticket.id));
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Hapus Tiket?',
            text: "Tiket ini akan dihapus secara permanen.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            router.delete(route('tickets.destroy', ticket.id), {
                onSuccess: () => Swal.fire('Terhapus!', 'Tiket berhasil dihapus.', 'success'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Tiket</h2>}
        >
            <Head title={`Tiket: ${ticket.subject}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-4 flex justify-between items-center">
                        <Link href={route('tickets.index')} className="text-gray-600 hover:text-gray-900 flex items-center font-semibold">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar Tiket
                        </Link>
                        {isAdmin && (
                            <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                <Trash2 className="w-4 h-4 mr-2" /> Hapus Tiket
                            </button>
                        )}
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <div className="flex flex-col md:flex-row justify-between border-b pb-6 mb-6">
                            <div className="flex-1 pr-6 border-r border-gray-200">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.subject}</h1>
                                <p className="text-gray-600 mb-6">Dilaporkan oleh <strong>{ticket.user?.name}</strong> pada {new Date(ticket.created_at).toLocaleDateString()}</p>
                                
                                <h3 className="text-lg font-semibold mb-2 border-b pb-2">Deskripsi Kendala</h3>
                                <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                    {ticket.description}
                                </div>
                            </div>
                            
                            <div className="md:w-64 pl-6 flex-shrink-0 mt-6 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Informasi Tiket</h3>
                                
                                <div className="mb-4">
                                    <span className="block text-sm text-gray-500 mb-1">Prioritas:</span>
                                    <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full 
                                        ${ticket.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' : 
                                          ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' : 
                                          ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-green-100 text-green-800'}`}>
                                        {ticket.priority}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <span className="block text-sm text-gray-500 mb-1">Status:</span>
                                    <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full 
                                        ${ticket.status === 'CLOSED' || ticket.status === 'RESOLVED' ? 'bg-gray-100 text-gray-800' : 
                                          ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 
                                          'bg-purple-100 text-purple-800'}`}>
                                        {ticket.status}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <span className="block text-sm text-gray-500 mb-1">Assigned To:</span>
                                    <span className="font-semibold text-gray-800">{ticket.assignee?.name || 'Unassigned'}</span>
                                </div>
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="bg-gray-50 p-6 rounded-lg border">
                                <h3 className="text-lg font-bold mb-4">Tindakan Admin (Update Status)</h3>
                                <form onSubmit={handleUpdate} className="flex gap-4 items-end flex-wrap">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-sm font-medium text-gray-700">Ubah Status</label>
                                        <select 
                                            value={data.status} 
                                            onChange={e => setData('status', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        >
                                            <option value="OPEN">OPEN</option>
                                            <option value="IN_PROGRESS">IN PROGRESS</option>
                                            <option value="RESOLVED">RESOLVED</option>
                                            <option value="CLOSED">CLOSED</option>
                                        </select>
                                    </div>
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-sm font-medium text-gray-700">Assign To (Agent)</label>
                                        <select 
                                            value={data.assigned_to} 
                                            onChange={e => setData('assigned_to', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        >
                                            <option value="">-- Unassigned --</option>
                                            {agents.map((agent: any) => (
                                                <option key={agent.id} value={agent.id}>{agent.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
