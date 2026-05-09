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
  const initialNotifications = auth?.notifications || [];
  
  const [notifications, setNotifications] = React.useState(initialNotifications);
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [isUserOpen, setIsUserOpen] = React.useState(false);

  const notifRef = React.useRef<HTMLDivElement>(null);
  const userRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    // Polling for new notifications every 30 seconds using lightweight fetch
    const interval = setInterval(() => {
      fetch('/app-api/notifications')
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data)) {
                setNotifications(data);
            }
        })
        .catch(err => console.error("Error fetching notifications", err));
    }, 30000);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-40 relative">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">
          Welcome, {user?.name}
        </h2>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Preview Landing Page - For Admin */}
        <Link href="/landing" target="_blank">
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Preview Landing</span>
          </Button>
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <Button variant="ghost" size="icon" className="relative cursor-pointer" onClick={() => setIsNotifOpen(!isNotifOpen)}>
            <Bell className="w-5 h-5 text-gray-600 pointer-events-none" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full pointer-events-none"></span>
            )}
          </Button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50 py-2">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                  <span className="font-semibold text-sm text-gray-800">Notifikasi</span>
                  {unreadCount > 0 && (
                      <button 
                          onClick={() => {
                              router.post(route('notifications.readAll'), {}, { preserveScroll: true });
                              setIsNotifOpen(false);
                          }}
                          className="text-xs text-blue-600 hover:underline font-medium"
                      >
                          Tandai semua dibaca
                      </button>
                  )}
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                  {notifications.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500 text-center">Belum ada notifikasi.</div>
                  ) : (
                      notifications.map((notif: any) => (
                          <div 
                              key={notif.id} 
                              className="flex flex-col items-start p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                              onClick={() => {
                                  if (!notif.is_read) {
                                      router.post(route('notifications.read', notif.id), {}, { preserveScroll: true });
                                  }
                                  if (notif.type.includes('TICKET')) {
                                      router.visit(route('tickets.index'));
                                  } else if (notif.type.includes('REPORT')) {
                                      router.visit(route('daily_reports.index'));
                                  }
                                  setIsNotifOpen(false);
                              }}
                          >
                              <div className="flex items-center gap-2 mb-1 w-full">
                                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${notif.is_read ? 'bg-transparent' : 'bg-blue-500'}`}></span>
                                  <span className={`font-semibold text-sm ${notif.is_read ? 'text-gray-500' : 'text-gray-900'}`}>{notif.title}</span>
                              </div>
                              <p className={`text-xs pl-4 whitespace-pre-wrap ${notif.is_read ? 'text-gray-400' : 'text-gray-600'}`}>{notif.message}</p>
                              <span className="text-[10px] pl-4 text-gray-400 mt-2">{notif.created_at ? new Date(notif.created_at).toLocaleString('id-ID') : 'Baru saja'}</span>
                          </div>
                      ))
                  )}
              </div>
              <div className="p-2 text-center border-t border-gray-100 mt-1">
                  <Link href={route('notifications.index')} className="text-xs text-gray-500 hover:text-gray-700 font-medium" onClick={() => setIsNotifOpen(false)}>See All Notification</Link>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userRef}>
          <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => setIsUserOpen(!isUserOpen)}>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold pointer-events-none">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </Button>

          {isUserOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <span className="font-semibold text-sm text-gray-800">My Account</span>
              </div>
              <Link href={route('profile.edit')} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserOpen(false)}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
              <Link href={route('admin.settings')} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserOpen(false)}>
                Settings
              </Link>
            </div>
          )}
        </div>

        {/* Explicit Logout Button */}
        <Link href={route('logout')} method="post" as="button">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition-colors px-3 rounded-full cursor-pointer">
            <LogOut className="w-4 h-4 pointer-events-none" />
            <span className="font-medium text-sm">Logout</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}
