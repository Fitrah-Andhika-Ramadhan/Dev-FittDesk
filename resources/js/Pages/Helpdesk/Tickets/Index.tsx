import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Ticket, Plus, Search } from 'lucide-react';

export default function Index({ auth, tickets, filters, isAdmin }: PageProps<{ tickets: any, filters: any, isAdmin: boolean }>) {
    const [status, setStatus] = useState(filters?.status || '');
    const [priority, setPriority] = useState(filters?.priority || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('tickets.index'), { status, priority }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Service Desk Tickets</h2>}
        >
            <Head title="Service Desk" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6 p-6">
                        <form onSubmit={handleFilter} className="flex gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select 
                                    value={status} 
                                    onChange={e => setStatus(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="OPEN">OPEN</option>
                                    <option value="IN_PROGRESS">IN PROGRESS</option>
                                    <option value="RESOLVED">RESOLVED</option>
                                    <option value="CLOSED">CLOSED</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Prioritas</label>
                                <select 
                                    value={priority} 
                                    onChange={e => setPriority(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="">Semua Prioritas</option>
                                    <option value="LOW">LOW</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="HIGH">HIGH</option>
                                    <option value="CRITICAL">CRITICAL</option>
                                </select>
                            </div>
                            <div>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                    <Search className="w-4 h-4 mr-2" /> Filter
                                </button>
                            </div>
                            <div className="ml-auto">
                                <Link
                                    href={route('tickets.create')}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Buat Tiket Baru
                                </Link>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiket</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemohon</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioritas</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tickets.data.length === 0 ? (
                                        <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">Belum ada tiket.</td></tr>
                                    ) : tickets.data.map((ticket: any) => (
                                        <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.get(route('tickets.show', ticket.id))}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Ticket className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" />
                                                    <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {ticket.user?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${ticket.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' : 
                                                      ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' : 
                                                      ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 
                                                      'bg-green-100 text-green-800'}`}>
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${ticket.status === 'CLOSED' || ticket.status === 'RESOLVED' ? 'bg-gray-100 text-gray-800' : 
                                                      ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 
                                                      'bg-purple-100 text-purple-800'}`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            {isAdmin && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {ticket.assignee?.name || <span className="text-gray-400 italic">Unassigned</span>}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {/* Pagination */}
                            <div className="mt-4 flex justify-center">
                                {tickets.links && tickets.links.map((link: any, k: number) => (
                                    <Link
                                        key={k}
                                        href={link.url || '#'}
                                        className={`mx-1 px-3 py-1 border rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
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
