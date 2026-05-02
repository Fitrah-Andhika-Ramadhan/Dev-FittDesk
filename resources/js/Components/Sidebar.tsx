'use client';

import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  BarChart3,
  Building2,
  FileText,
  Settings,
  ChevronDown,
  Menu,
  X,
  Home,
  TrendingUp,
  Users,
  Image,
  Activity,
  Bug,
} from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface SidebarProps {
  user: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const { url: pathname } = usePage();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard',
    },
    {
      label: 'Knowledge Base',
      icon: FileText,
      href: '/knowledge-base',
    },
    {
      label: 'Service Desk',
      icon: Settings,
      href: '/tickets',
    },
  ];

  const adminOnlyItems = [
    {
      label: 'System Status',
      icon: Activity,
      href: '/system-status',
    },
    {
      label: 'Bug Reports',
      icon: Bug,
      href: '/bugs',
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      href: '/analytics',
    },
    {
      label: 'Documents',
      icon: FileText,
      href: '/documents',
    },
    {
      label: 'Reports',
      icon: TrendingUp,
      href: '/reports',
    },
    {
      label: 'Team',
      icon: Users,
      href: '/team',
    },
  ];

  const adminMenuItems = [
    {
      label: 'Manage Landing',
      icon: FileText,
      href: '/admin/landing-manager',
    },
    {
      label: 'Media Manager',
      icon: Image,
      href: '/admin/media-manager',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/admin/settings',
    },
    {
      label: 'Laporan Harian',
      icon: FileText,
      href: '/daily-reports',
    },
    {
      label: 'Login History',
      icon: Users,
      href: '/admin/login-history',
    },
  ];

  const isActive = (href: string) => pathname === href;
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-transform duration-300 overflow-y-auto z-40`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            FittDesk
          </h1>
          <p className="text-xs text-blue-200 mt-1">Helpdesk & Service Center</p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-300 text-blue-900 flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-blue-200 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <nav className="p-4 space-y-2">
          <p className="text-xs font-semibold text-blue-200 uppercase px-2 mb-4">Main</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}

          {isAdmin && adminOnlyItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Admin Menu */}
        {isAdmin && (
          <nav className="p-4 space-y-2 border-t border-blue-700">
            <p className="text-xs font-semibold text-blue-200 uppercase px-2 mb-4">
              Administration
            </p>
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      active
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Logout Button */}
        <div className="px-4 py-6 mt-4 mb-16 border-t border-blue-800">
          <Link href={route('logout')} method="post" as="button" className="w-full">
            <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500 hover:text-white transition-all text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Logout
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700 bg-blue-900">
          <p className="text-xs text-blue-300 text-center">
            FittDesk Helpdesk
          </p>
          <p className="text-xs text-blue-400 text-center mt-1">v1.0.0</p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
