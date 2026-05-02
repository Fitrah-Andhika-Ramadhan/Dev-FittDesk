import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Bug, Search, Filter } from 'lucide-react';

export default function BugIndex({ bugs, filters, isAdmin }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'MEDIUM'
  });

  const [updateData, setUpdateData] = useState({
    status: '',
    resolution_notes: ''
  });

  const handleFilter = (status: string) => {
    router.get('/bugs', { status: status === 'ALL' ? '' : status }, { preserveState: true });
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/bugs', formData, {
      onSuccess: () => {
        setIsReportOpen(false);
        setFormData({ title: '', description: '', severity: 'MEDIUM' });
      }
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    router.put(`/bugs/${selectedBug.id}`, updateData, {
      onSuccess: () => {
        setIsUpdateOpen(false);
        setSelectedBug(null);
      }
    });
  };

  const openUpdateModal = (bug: any) => {
    setSelectedBug(bug);
    setUpdateData({
      status: bug.status,
      resolution_notes: bug.resolution_notes || ''
    });
    setIsUpdateOpen(true);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <Badge className="bg-red-500 hover:bg-red-600">CRITICAL</Badge>;
      case 'HIGH': return <Badge className="bg-orange-500 hover:bg-orange-600">HIGH</Badge>;
      case 'MEDIUM': return <Badge className="bg-yellow-500 hover:bg-yellow-600">MEDIUM</Badge>;
      case 'LOW': return <Badge className="bg-blue-500 hover:bg-blue-600">LOW</Badge>;
      default: return <Badge>{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <Badge variant="outline" className="text-red-600 border-red-600">OPEN</Badge>;
      case 'INVESTIGATING': return <Badge variant="outline" className="text-yellow-600 border-yellow-600">INVESTIGATING</Badge>;
      case 'FIXED': return <Badge variant="outline" className="text-green-600 border-green-600">FIXED</Badge>;
      case 'CLOSED': return <Badge variant="outline" className="text-gray-600 border-gray-600">CLOSED</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Bug Reports" />

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bug className="w-8 h-8 text-red-600" /> Bug Reports & History
          </h1>
          <p className="text-gray-600 mt-2">Dokumentasi kendala dan bug sistem yang ditemukan</p>
        </div>
        <Button onClick={() => setIsReportOpen(true)} className="bg-red-600 hover:bg-red-700 text-white">
          <Bug className="w-4 h-4 mr-2" /> Report Bug
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleFilter('ALL')} className={!filters?.status ? 'bg-slate-100' : ''}>All</Button>
              <Button variant="outline" onClick={() => handleFilter('OPEN')} className={filters?.status === 'OPEN' ? 'bg-slate-100' : ''}>Open</Button>
              <Button variant="outline" onClick={() => handleFilter('INVESTIGATING')} className={filters?.status === 'INVESTIGATING' ? 'bg-slate-100' : ''}>Investigating</Button>
              <Button variant="outline" onClick={() => handleFilter('FIXED')} className={filters?.status === 'FIXED' ? 'bg-slate-100' : ''}>Fixed</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {bugs.data.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed">
            Tidak ada bug report ditemukan.
          </div>
        ) : (
          bugs.data.map((bug: any) => (
            <Card key={bug.id} className="hover:shadow-md transition-shadow overflow-hidden">
              <div className="border-l-4 border-red-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(bug.status)}
                        {getSeverityBadge(bug.severity)}
                        <span className="text-sm text-gray-500">Reported by {bug.reporter.name}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{bug.title}</h3>
                      <p className="text-gray-600 mt-2 whitespace-pre-wrap">{bug.description}</p>
                      
                      {bug.resolution_notes && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm border">
                          <p className="font-semibold text-gray-700 mb-1">Resolution Notes:</p>
                          <p className="text-gray-600 whitespace-pre-wrap">{bug.resolution_notes}</p>
                        </div>
                      )}
                    </div>
                    {isAdmin && (
                      <Button variant="outline" size="sm" onClick={() => openUpdateModal(bug)}>
                        Update Status
                      </Button>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Report Bug Dialog */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Report a Bug</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReport} className="space-y-4 mt-4">
            <div>
              <Label>Title</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Brief description of the bug"
                required 
              />
            </div>
            <div>
              <Label>Severity</Label>
              <Select value={formData.severity} onValueChange={(v) => setFormData({...formData, severity: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Steps to reproduce, expected behavior, actual behavior..."
                className="h-32"
                required 
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">Submit Bug Report</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Bug Dialog (Admin Only) */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Bug Status</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
            <div>
              <Label>Status</Label>
              <Select value={updateData.status} onValueChange={(v) => setUpdateData({...updateData, status: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="INVESTIGATING">Investigating</SelectItem>
                  <SelectItem value="FIXED">Fixed</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Resolution Notes</Label>
              <Textarea 
                value={updateData.resolution_notes} 
                onChange={(e) => setUpdateData({...updateData, resolution_notes: e.target.value})}
                placeholder="Explain what was fixed or why it was closed..."
                className="h-32"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
