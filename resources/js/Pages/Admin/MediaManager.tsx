import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Upload, Trash2, Edit2, Plus, Image as ImageIcon, Video, ExternalLink, Eye } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Media {
  id: string;
  type: 'image' | 'video';
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  position: number;
  featured: boolean;
  uploadedAt: string;
}

export default function MediaManager() {
  const { auth } = usePage<any>().props;
  const user = auth?.user;
  
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    type: 'image',
    title: '',
    description: '',
    url: '',
    thumbnail: '',
    featured: false,
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/app-api/landing/media');
      const data = response.data;
      if (data.success) {
        setMedia(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setSelectedFile(null);
    setFormData({
      type: 'image',
      title: '',
      description: '',
      url: '',
      thumbnail: '',
      featured: false,
    });
    setShowForm(true);
  };

  const handleEditClick = (item: Media) => {
    setEditingId(item.id);
    setSelectedFile(null);
    setFormData({
      type: item.type,
      title: item.title,
      description: item.description,
      url: item.url,
      thumbnail: item.thumbnail,
      featured: item.featured,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = '/app-api/landing/media';
      const submitData = new FormData();
      if (editingId) submitData.append('id', editingId);
      submitData.append('type', formData.type);
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('url', formData.url);
      submitData.append('thumbnail', formData.thumbnail);
      submitData.append('featured', String(formData.featured));
      
      if (selectedFile) {
        submitData.append('file', selectedFile);
      }
      
      // In Laravel, PUT requests with FormData need _method=PUT
      if (editingId) {
        submitData.append('_method', 'PUT');
      }

      const response = await axios.post(url, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = response.data;

      if (data.success) {
        setShowForm(false);
        fetchMedia();
        Swal.fire('Sukses!', editingId ? 'Media berhasil diupdate.' : 'Media berhasil ditambahkan.', 'success');
      } else {
        Swal.fire('Gagal!', data.error || 'Gagal menyimpan media.', 'error');
      }
    } catch (error: any) {
      console.error('Error saving media:', error);
      Swal.fire('Gagal!', error.response?.data?.error || 'Gagal menyimpan media.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
        title: 'Hapus Media?',
        text: "Media ini akan dihapus secara permanen.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    });
    
    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`/app-api/landing/media?id=${id}`);
      const data = response.data;

      if (data.success) {
        fetchMedia();
        Swal.fire('Terhapus!', 'Media berhasil dihapus.', 'success');
      } else {
        Swal.fire('Gagal!', data.error || 'Gagal menghapus media.', 'error');
      }
    } catch (error: any) {
      console.error('Error deleting media:', error);
      Swal.fire('Gagal!', error.response?.data?.error || 'Gagal menghapus media.', 'error');
    }
  };

  if (!user || loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Head title="Media Manager" />

      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Manager</h1>
          <p className="text-gray-600 mt-1">Add, edit, and manage images and videos on the landing page</p>
        </div>
        <Button 
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Media
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview Landing
            </CardTitle>
            <CardDescription>See how media appears on landing page</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/" target="_blank" rel="noreferrer">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Open Landing Page
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Manage Content
            </CardTitle>
            <CardDescription>Edit hero, stats, and about section</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/landing-manager">
              <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Go to Landing Manager
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Media' : 'Add New Media'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Media Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Media title"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Media description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File (Overrides URL)
                </label>
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept={formData.type === 'image' ? 'image/*' : 'video/*'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media URL (If not uploading file)
                </label>
                <Input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder={formData.type === 'video' ? 'https://www.youtube.com/embed/...' : 'https://...'}
                  required={!selectedFile && !editingId}
                />
              </div>

              {formData.type === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail URL (optional)
                  </label>
                  <Input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Mark as featured on landing page
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingId ? 'Update Media' : 'Add Media'}
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">All Media ({media.length})</h2>
        
        {media.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No media uploaded yet. Add your first image or video!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition">
                <CardContent className="p-4">
                  <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden h-40">
                    {item.type === 'image' ? (
                      <img 
                        src={item.thumbnail || item.url} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      item.url.includes('youtube.com') || item.url.includes('youtu.be') || item.url.includes('vimeo.com') ? (
                        <iframe
                          src={item.url}
                          title={item.title}
                          className="w-full h-full pointer-events-none"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      ) : (
                        <video
                          src={item.url}
                          title={item.title}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      {item.type === 'image' ? (
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Video className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-xs font-semibold text-gray-600 uppercase">
                        {item.type}
                      </span>
                      {item.featured && (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    
                    <div className="text-xs text-gray-500 pt-2 border-t">
                      Position: {item.position}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditClick(item)}
                      size="sm"
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      size="sm"
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
