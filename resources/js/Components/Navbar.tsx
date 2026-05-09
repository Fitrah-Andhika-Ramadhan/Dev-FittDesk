'use client';

import { Bell, LogOut, User, ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Link, usePage, router } from '@inertiajs/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const { auth, flash } = usePage().props as any;
  const notifications = auth?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">
          Welcome, {user?.name}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Preview Landing Page - For Admin */}
        <Link href="/landing" target="_blank">
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Preview Landing</span>
          </Button>
        </Link>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between pr-4">
                <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                {unreadCount > 0 && (
                    <button 
                        onClick={() => router.post(route('notifications.readAll'), {}, { preserveScroll: true })}
                        className="text-xs text-blue-600 hover:underline font-medium"
                    >
                        Tandai semua dibaca
                    </button>
                )}
            </div>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 text-center">Belum ada notifikasi.</div>
            ) : (
                notifications.map((notif: any) => (
                    <DropdownMenuItem 
                        key={notif.id} 
                        className="flex flex-col items-start p-3 focus:bg-gray-50 cursor-pointer"
                        onClick={() => {
                            if (!notif.is_read) {
                                router.post(route('notifications.read', notif.id), {}, { preserveScroll: true });
                            }
                            if (notif.type.includes('TICKET')) {
                                router.visit(route('tickets.index'));
                            } else if (notif.type.includes('REPORT')) {
                                router.visit(route('daily_reports.index'));
                            }
                        }}
                    >
                        <div className="flex items-center gap-2 mb-1 w-full">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${notif.is_read ? 'bg-transparent' : 'bg-blue-500'}`}></span>
                            <span className={`font-semibold text-sm ${notif.is_read ? 'text-gray-500' : 'text-gray-900'}`}>{notif.title}</span>
                        </div>
                        <p className={`text-xs pl-4 whitespace-pre-wrap ${notif.is_read ? 'text-gray-400' : 'text-gray-600'}`}>{notif.message}</p>
                        <span className="text-[10px] pl-4 text-gray-400 mt-2">{notif.created_at ? new Date(notif.created_at).toLocaleString('id-ID') : 'Baru saja'}</span>
                    </DropdownMenuItem>
                ))
            )}
            <DropdownMenuSeparator />
            <div className="p-2 text-center">
                <Link href="#" className="text-xs text-gray-500 hover:text-gray-700">See All Notification</Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={route('profile.edit')} className="w-full">
              <DropdownMenuItem className="cursor-pointer w-full">
                <User className="w-4 h-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            <Link href={route('admin.settings')} className="w-full">
              <DropdownMenuItem className="cursor-pointer w-full">
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Explicit Logout Button */}
        <Link href={route('logout')} method="post" as="button">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition-colors px-3 rounded-full">
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Logout</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}
