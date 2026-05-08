import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Download, Filter, FileText, RefreshCcw, Search, Trash2, Upload, X } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

type DocumentItem = {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description?: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
  docType: string;
  uploadedBy?: string;
  uploadedAt: string;
  version: number;
};

type DocumentStats = {
  total: number;
  totalSize: number;
  byType: Record<string, number>;
};

const documentTypes = [
  { value: 'all', label: 'All Documents', icon: '📁' },
  { value: 'SOP', label: 'SOP', icon: '📄' },
  { value: 'POLICY', label: 'IT Policy', icon: '🛡️' },
  { value: 'MANUAL', label: 'User Manual', icon: '📖' },
  { value: 'ARCHITECTURE', label: 'Architecture', icon: '🏗️' },
  { value: 'LICENSE', label: 'Software License', icon: '🔑' },
  { value: 'CONTRACT', label: 'Vendor Contract', icon: '📋' },
  { value: 'REPORT', label: 'Audit Report', icon: '📊' },
  { value: 'OTHER', label: 'Other', icon: '🗂️' },
];

const initialUploadForm = {
  projectId: '1',
  projectName: 'FittDesk IT Service Management',
  title: '',
  description: '',
  docType: 'SOP',
  fileType: 'application/pdf',
  manualFileUrl: '',
};

export default function DocumentsPage() {
  const { auth } = usePage<any>().props;
  const user = auth?.user;
  
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [stats, setStats] = useState<DocumentStats>({ total: 0, totalSize: 0, byType: {} });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState(initialUploadForm);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async (nextType = activeType, nextSearch = search) => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (nextType && nextType !== 'all') params.set('type', nextType);
      if (nextSearch.trim()) params.set('search', nextSearch.trim());

      const response = await axios.get(`/app-api/documents${params.toString() ? `?${params.toString()}` : ''}`);
      const data = response.data;

      if (!data.success) {
        throw new Error(data.error || 'Failed to load documents');
      }

      setDocuments(data.data.documents || []);
      setStats(data.data.stats || { total: 0, totalSize: 0, byType: {} });
    } catch (fetchError: any) {
      console.error('Failed to fetch documents:', fetchError);
      setError(fetchError.response?.data?.error || fetchError.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const currentUserEmail = user?.email || 'admin@fittdesk.com';

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchDocuments(activeType, search);
  };

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    fetchDocuments(type, search);
  };

  const handleRefresh = () => {
    fetchDocuments(activeType, search);
  };

  const handleUploadFormChange = (field: string, value: string) => {
    setUploadForm((current) => ({ ...current, [field]: value }));
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Failed to read selected file'));
      reader.readAsDataURL(file);
    });

  const handleUploadDocument = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');

      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('docType', uploadForm.docType);
      formData.append('projectId', uploadForm.projectId || '1');
      formData.append('projectName', uploadForm.projectName || 'FittDesk IT Service Management');
      formData.append('description', uploadForm.description || '');
      formData.append('uploadedBy', currentUserEmail);
      formData.append('fileType', uploadForm.fileType);

      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (uploadForm.manualFileUrl.trim()) {
        formData.append('manualFileUrl', uploadForm.manualFileUrl);
      } else {
        throw new Error('Please select a file or provide a manual URL.');
      }

      const response = await axios.post('/app-api/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = response.data;
      if (!data.success) {
        throw new Error(data.error || 'Failed to upload document');
      }

      setUploadForm(initialUploadForm);
      setSelectedFile(null);
      setShowUploadForm(false);
      fetchDocuments(activeType, search);
    } catch (uploadError: any) {
      console.error('Upload document error:', uploadError);
      setError(uploadError.response?.data?.error || uploadError.message || 'Failed to upload document');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus Dokumen?',
      text: "Dokumen ini akan dihapus secara permanen dan tidak dapat dikembalikan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });
    
    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`/app-api/documents/${id}`);
      const data = response.data;
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete document');
      }

      fetchDocuments(activeType, search);
      Swal.fire('Terhapus!', 'Dokumen berhasil dihapus.', 'success');
    } catch (deleteError: any) {
      console.error('Delete document error:', deleteError);
      Swal.fire('Gagal!', deleteError.response?.data?.error || deleteError.message || 'Gagal menghapus dokumen.', 'error');
    }
  };

  const handleDownloadDocument = (doc: DocumentItem) => {
    const link = window.document.createElement('a');
    link.href = doc.fileUrl;
    link.download = `${doc.title}.${doc.fileType.includes('pdf') ? 'pdf' : 'txt'}`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const filteredDocTypes = useMemo(() => documentTypes, []);

  const totalStorage = `${stats.totalSize.toFixed(1)} MB`;

  return (
    <AuthenticatedLayout>
      <Head title="Documents" />

      <div className="mb-8 flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">SOP, IT policies, manuals, and system architecture documents</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2" onClick={() => setShowUploadForm((current) => !current)}>
            {showUploadForm ? <X className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {showUploadForm ? 'Close Form' : 'Upload Document'}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {showUploadForm ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleUploadDocument}>
              <div className="space-y-2">
                <Label htmlFor="document-title">Document Title</Label>
                <Input
                  id="document-title"
                  value={uploadForm.title}
                  onChange={(event) => handleUploadFormChange('title', event.target.value)}
                  placeholder="Enter document title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-type">Document Type</Label>
                <select
                  id="document-type"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={uploadForm.docType}
                  onChange={(event) => handleUploadFormChange('docType', event.target.value)}
                >
                  {documentTypes.filter((type) => type.value !== 'all').map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-id">Project ID</Label>
                <Input
                  id="project-id"
                  value={uploadForm.projectId}
                  onChange={(event) => handleUploadFormChange('projectId', event.target.value)}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-name">Department / Project</Label>
                <Input
                  id="project-name"
                  value={uploadForm.projectName}
                  onChange={(event) => handleUploadFormChange('projectName', event.target.value)}
                  placeholder="FittDesk IT Service Management"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-file">File</Label>
                <Input
                  id="document-file"
                  type="file"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file-type">File Type</Label>
                <select
                  id="file-type"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={uploadForm.fileType}
                  onChange={(event) => handleUploadFormChange('fileType', event.target.value)}
                >
                  <option value="application/pdf">PDF</option>
                  <option value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">Excel</option>
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="text/plain;charset=utf-8">Text</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="document-description">Description</Label>
                <Textarea
                  id="document-description"
                  value={uploadForm.description}
                  onChange={(event) => handleUploadFormChange('description', event.target.value)}
                  placeholder="Document description"
                  rows={3}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="manual-file-url">Manual File URL</Label>
                <Input
                  id="manual-file-url"
                  value={uploadForm.manualFileUrl}
                  onChange={(event) => handleUploadFormChange('manualFileUrl', event.target.value)}
                  placeholder="Optional if you want to store a custom file/link"
                />
              </div>
              <div className="md:col-span-2 flex items-center justify-between gap-3 pt-2">
                <p className="text-sm text-gray-500">
                  {selectedFile ? `Selected file: ${selectedFile.name}` : 'You can upload a file or save a preview link.'}
                </p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                    {submitting ? 'Uploading...' : 'Save Document'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totalStorage}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{activeType === 'all' ? 'All' : activeType}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-gray-900">IT & Operations</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Document Categories</h2>
          <form className="flex items-center gap-2" onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search documents"
                className="pl-9 w-64"
              />
            </div>
            <Button type="submit" variant="outline">Search</Button>
          </form>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredDocTypes.map((type) => (
            <Card
              key={type.value}
              className={`cursor-pointer transition-shadow ${activeType === type.value ? 'shadow-lg ring-2 ring-blue-500' : 'hover:shadow-lg'}`}
              onClick={() => handleTypeChange(type.value)}
            >
              <CardContent className="p-4 text-center space-y-2">
                <div className="text-3xl">{type.icon}</div>
                <p className="text-sm font-medium text-gray-700">{type.label}</p>
                <Badge variant="secondary">{type.value === 'all' ? stats.total : stats.byType[type.value] || 0}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center gap-4">
            <CardTitle>Recent Documents</CardTitle>
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => handleTypeChange('all')}>
              <Filter className="w-4 h-4" />
              Clear Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading documents...</div>
          ) : documents.length === 0 ? (
            <div className="py-10 text-center text-gray-500">No documents found.</div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-10 h-10 text-blue-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{doc.title}</p>
                      <p className="text-sm text-gray-600 truncate">{doc.description || doc.projectName}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-1 flex-wrap">
                        <Badge variant="secondary" className="text-xs">{doc.docType}</Badge>
                        <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{doc.fileSize.toFixed(1)} MB</span>
                        <span>•</span>
                        <span>v{doc.version}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(doc)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  );
}
