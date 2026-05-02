import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import { usePage, router } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar user={user} />
            
            <div className="flex-1 overflow-auto">
                <Navbar user={user} onLogout={handleLogout} />

                {header && (
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
