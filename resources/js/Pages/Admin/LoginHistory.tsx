import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { History, Shield, Globe, Clock, User } from 'lucide-react';

interface HistoryItem {
    id: string;
    user_id: string;
    ip_address: string;
    user_agent: string;
    login_at: string;
    user: {
        name: string;
        email: string;
        role: string;
    }
}

export default function LoginHistory({ histories }: { histories: any }) {
    const data: HistoryItem[] = histories.data;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                        <History className="w-6 h-6 text-blue-600" />
                        Riwayat Login Pengguna
                    </h2>
                </div>
            }
        >
            <Head title="Login History" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Data Akses & Login Terakhir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Pengguna</th>
                                        <th scope="col" className="px-6 py-3">Role</th>
                                        <th scope="col" className="px-6 py-3">IP Address</th>
                                        <th scope="col" className="px-6 py-3">User Agent / Browser</th>
                                        <th scope="col" className="px-6 py-3">Waktu Login</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item) => (
                                        <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                                        {item.user?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{item.user?.name}</p>
                                                        <p className="text-xs text-gray-500">{item.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    item.user?.role === 'SUPER_ADMIN' || item.user?.role === 'ADMIN'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {item.user?.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs">
                                                <div className="flex items-center gap-1">
                                                    <Globe className="w-4 h-4 text-gray-400" />
                                                    {item.ip_address}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs truncate max-w-xs" title={item.user_agent}>
                                                    {item.user_agent}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 whitespace-nowrap">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    {new Date(item.login_at).toLocaleString('id-ID', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short'
                                                    })}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                Belum ada data riwayat login.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Simple */}
                        <div className="flex items-center justify-between mt-6">
                            <span className="text-sm text-gray-600">
                                Showing {histories.from || 0} to {histories.to || 0} of {histories.total} entries
                            </span>
                            <div className="flex gap-2">
                                {histories.prev_page_url && (
                                    <a href={histories.prev_page_url} className="px-4 py-2 border rounded text-sm hover:bg-gray-50">Previous</a>
                                )}
                                {histories.next_page_url && (
                                    <a href={histories.next_page_url} className="px-4 py-2 border rounded text-sm hover:bg-gray-50">Next</a>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
