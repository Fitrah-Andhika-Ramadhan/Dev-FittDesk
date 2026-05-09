import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { CheckCircle, Bell } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function Index({ auth, notificationsList }: PageProps & { notificationsList: any }) {
    const handleRead = (notif: any) => {
        if (!notif.is_read) {
            router.post(route('notifications.read', notif.id), {}, { preserveScroll: true });
        }
        if (notif.type.includes('TICKET')) {
            router.visit(route('tickets.index'));
        } else if (notif.type.includes('REPORT')) {
            router.visit(route('daily_reports.index'));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Semua Notifikasi" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Bell className="w-6 h-6 text-blue-600" />
                            Semua Notifikasi
                        </h1>
                        <Button 
                            variant="outline" 
                            onClick={() => router.post(route('notifications.readAll'), {}, { preserveScroll: true })}
                            className="flex items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Tandai Semua Dibaca
                        </Button>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {notificationsList.data.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                Belum ada notifikasi.
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {notificationsList.data.map((notif: any) => (
                                    <li 
                                        key={notif.id} 
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.is_read ? 'bg-blue-50/30' : ''}`}
                                        onClick={() => handleRead(notif)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1">
                                                <span className={`block w-2.5 h-2.5 rounded-full ${!notif.is_read ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`text-sm font-semibold ${!notif.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                    {notif.title}
                                                </h3>
                                                <p className={`mt-1 text-sm whitespace-pre-wrap ${!notif.is_read ? 'text-gray-700' : 'text-gray-500'}`}>
                                                    {notif.message}
                                                </p>
                                                <p className="mt-2 text-xs text-gray-400">
                                                    {notif.created_at ? new Date(notif.created_at).toLocaleString('id-ID') : 'Baru saja'}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Pagination - Simple prev/next for now */}
                    <div className="mt-4 flex justify-between items-center">
                        <Button 
                            variant="ghost" 
                            disabled={!notificationsList.prev_page_url}
                            onClick={() => router.visit(notificationsList.prev_page_url)}
                        >
                            &laquo; Sebelumnya
                        </Button>
                        <span className="text-sm text-gray-500">
                            Halaman {notificationsList.current_page} dari {notificationsList.last_page}
                        </span>
                        <Button 
                            variant="ghost" 
                            disabled={!notificationsList.next_page_url}
                            onClick={() => router.visit(notificationsList.next_page_url)}
                        >
                            Selanjutnya &raquo;
                        </Button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
