import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Users, Mail, Phone, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function Team() {
  const teamMembers = [
    {
      id: '1',
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      position: 'Project Director',
      email: 'admin@fittdesk.com',
      phone: '+62812345678',
      department: 'Management',
      status: 'Active',
      joinDate: new Date('2023-01-15'),
      avatar: 'A',
    },
    {
      id: '2',
      name: 'Budi Santoso',
      role: 'MANAGER',
      position: 'Construction Manager',
      email: 'budi@fittdesk.com',
      phone: '+62812345679',
      department: 'Construction',
      status: 'Active',
      joinDate: new Date('2023-02-01'),
      avatar: 'B',
    },
    {
      id: '3',
      name: 'Siti Nurhaliza',
      role: 'MANAGER',
      position: 'Quality Manager',
      email: 'siti@fittdesk.com',
      phone: '+62812345680',
      department: 'Quality Assurance',
      status: 'Active',
      joinDate: new Date('2023-02-15'),
      avatar: 'S',
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-red-100 text-red-800';
      case 'MANAGER': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case 'Management': return 'bg-purple-50';
      case 'Construction': return 'bg-yellow-50';
      case 'Quality Assurance': return 'bg-blue-50';
      default: return 'bg-white';
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Team" />
      
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">Manage project team members and roles</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {teamMembers.map((member) => (
          <Card key={member.id} className={`${getDepartmentColor(member.department)} hover:shadow-md transition-shadow`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.position}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(member.role)}`}>
                  {member.role}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">{member.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${member.phone}`} className="hover:text-blue-600">{member.phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  {member.department}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-between">
                <span className="text-xs text-gray-500">Joined: {member.joinDate.toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AuthenticatedLayout>
  );
}
