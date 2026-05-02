import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Analytics() {
  // Generate mock data for the last 30 days
  const generateData = () => {
    const data = [];
    const categories = ['Hardware', 'Software', 'Network', 'Access'];
    let date = new Date();
    date.setDate(date.getDate() - 30);
    
    for (let i = 0; i < 30; i++) {
      const created = Math.floor(Math.random() * 40) + 10; // 10-50
      const resolved = Math.floor(Math.random() * 35) + 15; // 15-50
      
      data.push({
        date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        created,
        resolved,
        slaCompliance: Math.floor(Math.random() * 15) + 85, // 85-100%
      });
      date.setDate(date.getDate() + 1);
    }
    return data;
  };

  const analyticsData = generateData();

  const categoryData = [
    { name: 'Hardware', tickets: 340 },
    { name: 'Software', tickets: 520 },
    { name: 'Network', tickets: 180 },
    { name: 'Access / IAM', tickets: 290 },
  ];

  return (
    <AuthenticatedLayout>
      <Head title="Analytics" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-1">IT Service Management Performance - Last 30 Days</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">3.4h</div>
            <p className="text-xs text-green-500 mt-1">↓ 12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">1,330</div>
            <p className="text-xs text-red-500 mt-1">↑ 5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">SLA Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">96.8%</div>
            <p className="text-xs text-green-500 mt-1">Target: &gt;95%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">4.8/5</div>
            <p className="text-xs text-gray-500 mt-1">Based on 850 ratings</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tickets Volume (Created vs Resolved)</CardTitle>
            <CardDescription>Daily ticket handling performance over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="created" stroke="#f43f5e" fill="#ffe4e6" name="Created" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="#d1fae5" name="Resolved" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Category</CardTitle>
            <CardDescription>Distribution of issues reported</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="tickets" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SLA Compliance Trend</CardTitle>
          <CardDescription>Daily SLA achievement vs 95% target</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" domain={[80, 100]} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="slaCompliance" stroke="#f59e0b" name="SLA %" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  );
}
