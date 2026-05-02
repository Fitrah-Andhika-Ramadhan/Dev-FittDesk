import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Settings as SettingsIcon, Database, Lock, Bell, Save } from 'lucide-react';

export default function Settings() {
  const { auth } = usePage<any>().props;
  const user = auth?.user;

  const [settings, setSettings] = useState({
    projectName: 'FittDesk IT Service Management',
    location: 'Jakarta, Indonesia',
    companyName: 'FittDesk',
    email: 'admin@fittdesk.com',
    phone: '+62-21-XXXX-XXXX',
    slaWarningThreshold: 85,
    autoCloseDays: 5,
    notificationsEnabled: true,
    emailNotifications: true,
  });

  const [changed, setChanged] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      [key]: value,
    });
    setChanged(true);
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    setChanged(false);
    alert('Settings saved successfully!');
  };

  return (
    <AuthenticatedLayout>
      <Head title="Admin Settings" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-1">Configure system settings and preferences</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Project Information
          </CardTitle>
          <CardDescription>Basic project details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <Input
                value={settings.projectName}
                onChange={(e) => handleSettingChange('projectName', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Input
                value={settings.location}
                onChange={(e) => handleSettingChange('location', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <Input
                value={settings.companyName}
                onChange={(e) => handleSettingChange('companyName', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input
                value={settings.phone}
                onChange={(e) => handleSettingChange('phone', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alert Thresholds
          </CardTitle>
          <CardDescription>Configure when alerts should be triggered</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SLA Warning Threshold (%)
              </label>
              <Input
                type="number"
                value={settings.slaWarningThreshold}
                onChange={(e) => handleSettingChange('slaWarningThreshold', parseInt(e.target.value))}
                className="w-full"
                min="0"
                max="100"
              />
              <p className="text-xs text-gray-500 mt-1">Alert when SLA compliance falls below this percentage</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auto-close Tickets (Days)
              </label>
              <Input
                type="number"
                value={settings.autoCloseDays}
                onChange={(e) => handleSettingChange('autoCloseDays', parseInt(e.target.value))}
                className="w-full"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Automatically close resolved tickets after this many days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Enable All Notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Email Notifications</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Information
          </CardTitle>
          <CardDescription>System database statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Database Type</p>
              <p className="text-lg font-semibold text-gray-900">MySQL</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="text-lg font-semibold text-green-600">Connected</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Version</p>
              <p className="text-lg font-semibold text-gray-900">11.0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Manage security and access control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">Two-Factor Authentication</p>
            <Button variant="outline" size="sm">Enable 2FA</Button>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">Session Timeout</p>
            <p className="text-sm text-gray-600">Sessions expire after 2 hours of inactivity in Laravel</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">Password Policy</p>
            <p className="text-sm text-gray-600">Minimum 8 characters</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 sticky bottom-0 bg-white p-4 rounded-lg shadow">
        <Button variant="outline" onClick={() => {
          setChanged(false);
          window.location.reload();
        }}>
          Cancel
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleSave}
          disabled={!changed}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </AuthenticatedLayout>
  );
}
