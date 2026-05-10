import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Upload, Trash2, Edit2, Plus, Image as ImageIcon, Video, ExternalLink, Eye, AlertCircle } from 'lucide-react';
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

function isEmbedUrl(url: string) {
  return url.includes('youtube.com/embed') || url.includes('player.vimeo.com');
}

function isYouTubeOrVimeo(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
}

/** Preview for a media card in the grid */
function MediaPreview({ item }: { item: Media }) {
  if (item.type === 'image') {
    return (
      <img
        src={item.thumbnail || item.url}
        alt={item.title}
        className="w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Image'; }}
      />
    );
  }

  // Video: show thumbnail if set, else show iframe for embeds, else show <video>
  if (item.thumbnail) {
    return (
      <div className="relative w-full h-full">
        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/60 rounded-full p-3">
            <Video className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    );
  }

  if (isYouTubeOrVimeo(item.url) || isEmbedUrl(item.url)) {
    return (
      <iframe
        src={item.url}
        title={item.title}
        className="w-full h-full pointer-events-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    );
  }

  return (
    <video
      src={item.url}
      className="w-full h-full object-cover"
      muted
      playsInline
      preload="metadata"
    />
  );
}

export default function MediaManager() {
  const { auth } = usePage<any>().props;
  const user = auth?.user;

  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    type: 'image' as 'image' | 'video',
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
      if (response.data.success) setMedia(response.data.data);
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ type: 'image', title: '', description: '', url: '', thumbnail: '', featured: false });
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleAddClick = () => {
    setEditingId(null);
    resetForm();
    setShowForm(true);
  };

  const handleEditClick = (item: Media) => {
    setEditingId(item.id);
    setSelectedFile(null);
    setPreviewUrl('');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
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
      if (editingId) {
        submitData.append('_method', 'PUT');
      }

      const response = await axios.post('/app-api/landing/media', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setShowForm(false);
        resetForm();
        fetchMedia();
        Swal.fire('Sukses!', editingId ? 'Media berhasil diupdate.' : 'Media berhasil ditambahkan.', 'success');
      } else {
        Swal.fire('Gagal!', response.data.error || 'Gagal menyimpan media.', 'error');
      }
    } catch (error: any) {
      console.error('Error saving media:', error);
      Swal.fire('Gagal!', error.response?.data?.message || error.response?.data?.error || 'Gagal menyimpan media.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus Media?',
      text: 'Media ini akan dihapus secara permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });
    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`/app-api/landing/media?id=${id}`);
      if (response.data.success) {
        fetchMedia();
        Swal.fire('Terhapus!', 'Media berhasil dihapus.', 'success');
      } else {
        Swal.fire('Gagal!', response.data.error || 'Gagal menghapus media.', 'error');
      }
    } catch (error: any) {
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
          <p className="text-gray-600 mt-1">Tambah, edit, dan kelola gambar & video di landing page</p>
        </div>
        <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Media
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Eye className="w-5 h-5" />Preview Landing</CardTitle>
            <CardDescription>Lihat tampilan media di landing page</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/" target="_blank" rel="noreferrer">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />Open Landing Page
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Eye className="w-5 h-5" />Manage Content</CardTitle>
            <CardDescription>Edit hero, stats, dan about section</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/landing-manager">
              <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />Go to Landing Manager
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Vercel Storage Notice */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Catatan Penting: Upload File vs URL</p>
          <p className="text-xs text-amber-700 mt-1">
            Pada lingkungan <strong>Vercel (serverless)</strong>, file yang di-upload langsung <strong>tidak akan tersimpan permanen</strong> karena tidak ada persistent disk.
            Untuk video, sebaiknya gunakan <strong>YouTube Embed URL</strong> atau <strong>Vimeo</strong>. Untuk gambar, gunakan URL dari <strong>Imgur, Cloudinary, atau CDN publik lainnya</strong>.
            <br />Jika ingin upload file, Anda perlu mengkonfigurasi <strong>AWS S3 atau Cloudinary</strong>.
          </p>
        </div>
      </div>

      {showForm && (
        <Card className="mb-8 border-blue-100 shadow-md">
          <CardHeader>
            <CardTitle>{editingId ? '✏️ Edit Media' : '➕ Add New Media'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      setFormData({ ...formData, type: e.target.value as 'image' | 'video', url: '', thumbnail: '' });
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="image">🖼️ Image</option>
                    <option value="video">🎬 Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Media description (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              {/* URL Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === 'video' ? '🔗 Video URL (YouTube / Vimeo / direct)' : '🔗 Image URL'}
                </label>
                <Input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder={
                    formData.type === 'video'
                      ? 'https://www.youtube.com/watch?v=... atau https://www.youtube.com/embed/...'
                      : 'https://i.imgur.com/... atau URL gambar publik'
                  }
                  required={!selectedFile && !editingId}
                />
                {formData.type === 'video' && (
                  <p className="text-xs text-blue-600 mt-1">
                    💡 YouTube Watch URL (<code>watch?v=</code>) akan otomatis dikonversi ke Embed URL oleh sistem.
                  </p>
                )}
              </div>

              {/* File Upload — only for image on Vercel, with caveat note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File (Akan menimpa URL di atas)
                </label>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept={formData.type === 'image' ? 'image/*' : 'video/*'}
                />
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ Upload file tidak persisten di Vercel. Gunakan URL eksternal untuk produksi.
                </p>

                {/* Local preview */}
                {previewUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden h-40 bg-gray-100">
                    {formData.type === 'image' ? (
                      <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <video src={previewUrl} className="w-full h-full object-cover" controls muted />
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail URL for video */}
              {formData.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🖼️ Thumbnail URL untuk Video (opsional, sangat disarankan)
                  </label>
                  <Input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Untuk YouTube: gunakan <code>https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg</code>
                  </p>
                </div>
              )}

              {/* Thumbnail for image */}
              {formData.type === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail URL (opsional, untuk gambar lebih kecil/optimized)
                  </label>
                  <Input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://... (biarkan kosong untuk pakai URL utama)"
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
                  Tandai sebagai <strong>Featured</strong> di landing page
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingId ? 'Update Media' : 'Add Media'}
                </Button>
                <Button type="button" onClick={() => { setShowForm(false); resetForm(); }} variant="outline">
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
              <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Belum ada media. Tambahkan gambar atau video pertama Anda!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition">
                <CardContent className="p-4">
                  <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden h-40">
                    <MediaPreview item={item} />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.type === 'image' ? (
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Video className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-xs font-semibold text-gray-600 uppercase">{item.type}</span>
                      {item.featured && (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    )}

                    <div className="text-xs text-gray-400 break-all pt-1 border-t">
                      <span className="font-medium text-gray-500">URL: </span>
                      {item.url.length > 50 ? item.url.substring(0, 50) + '...' : item.url}
                    </div>
                    <div className="text-xs text-gray-400">
                      Posisi: {item.position}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditClick(item)}
                      size="sm"
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      size="sm"
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-3 h-3" />Delete
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
