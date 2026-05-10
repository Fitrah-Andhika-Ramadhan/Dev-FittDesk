import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Trash2, Edit2, Plus, Image as ImageIcon, Video, ExternalLink, Eye, Info, Youtube, Link2 } from 'lucide-react';
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

// ─── helpers ────────────────────────────────────────────────────────────────

function isGoogleDrive(url: string) {
  return url.includes('drive.google.com');
}

function isYouTube(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function isVimeo(url: string) {
  return url.includes('vimeo.com');
}

/** Return a user-friendly source label */
function sourceLabel(item: Media): { label: string; color: string } {
  if (item.type === 'image') return { label: 'Image', color: 'text-blue-600' };
  if (isYouTube(item.url))    return { label: 'YouTube', color: 'text-red-600' };
  if (isVimeo(item.url))      return { label: 'Vimeo',   color: 'text-sky-600' };
  if (isGoogleDrive(item.url))return { label: 'Google Drive', color: 'text-green-600' };
  return { label: 'Video', color: 'text-purple-600' };
}

// ─── card preview ────────────────────────────────────────────────────────────

function MediaCardPreview({ item }: { item: Media }) {
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

  // Video — show thumbnail with play overlay if available
  if (item.thumbnail) {
    return (
      <div className="relative w-full h-full">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Video'; }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="bg-black/60 rounded-full p-2">
            <Video className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
    );
  }

  // No thumbnail — gradient placeholder
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center gap-2">
      <Video className="w-10 h-10 text-white/40" />
      <span className="text-xs text-white/40">No preview</span>
    </div>
  );
}

// ─── guide boxes ─────────────────────────────────────────────────────────────

function VideoGuide() {
  return (
    <div className="mt-3 space-y-3">
      {/* YouTube */}
      <div className="rounded-xl border border-red-100 bg-red-50 p-3">
        <p className="text-xs font-bold text-red-700 flex items-center gap-1 mb-1">
          <Youtube className="w-3.5 h-3.5" /> YouTube
        </p>
        <p className="text-xs text-red-600">
          Paste URL biasa, sistem akan otomatis konversi:<br />
          <code className="bg-red-100 px-1 rounded">https://www.youtube.com/watch?v=xxxxx</code>
        </p>
        <p className="text-xs text-red-500 mt-1">
          Thumbnail otomatis diambil dari YouTube ✓
        </p>
      </div>

      {/* Google Drive */}
      <div className="rounded-xl border border-green-100 bg-green-50 p-3">
        <p className="text-xs font-bold text-green-700 flex items-center gap-1 mb-1">
          <Link2 className="w-3.5 h-3.5" /> Google Drive
        </p>
        <p className="text-xs text-green-600">
          Cara mendapatkan link:
        </p>
        <ol className="text-xs text-green-700 mt-1 ml-3 list-decimal space-y-0.5">
          <li>Buka file di Google Drive</li>
          <li>Klik kanan → <strong>Bagikan / Share</strong></li>
          <li>Ubah akses ke <strong>"Siapa saja dengan link"</strong></li>
          <li>Salin link lalu paste di sini</li>
        </ol>
        <code className="text-[10px] text-green-600 bg-green-100 px-1 rounded block mt-1 break-all">
          https://drive.google.com/file/d/FILE_ID/view?usp=sharing
        </code>
        <p className="text-xs text-green-500 mt-1">
          Sistem otomatis konversi ke link preview ✓
        </p>
      </div>
    </div>
  );
}

function ImageGuide() {
  return (
    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
      <p className="text-xs font-bold text-blue-700 flex items-center gap-1 mb-1">
        <ImageIcon className="w-3.5 h-3.5" /> Gambar — Gunakan URL Publik
      </p>
      <p className="text-xs text-blue-600 mb-1">
        Rekomendasi layanan hosting gambar gratis:
      </p>
      <ul className="text-xs text-blue-700 ml-3 list-disc space-y-0.5">
        <li><a href="https://imgur.com/upload" target="_blank" rel="noreferrer" className="underline">Imgur.com</a> — upload &amp; salin link .jpg</li>
        <li><a href="https://postimages.org" target="_blank" rel="noreferrer" className="underline">PostImages.org</a> — gratis, tanpa akun</li>
        <li>Google Drive: share publik lalu ganti <code>/view</code> dengan <code>/preview</code></li>
      </ul>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function MediaManager() {
  const { auth } = usePage<any>().props;
  const user = auth?.user;

  const [media, setMedia]         = useState<Media[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'image' as 'image' | 'video',
    title: '',
    description: '',
    url: '',
    thumbnail: '',
    featured: false,
  });

  useEffect(() => { fetchMedia(); }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/app-api/landing/media');
      if (res.data.success) setMedia(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ type: 'image', title: '', description: '', url: '', thumbnail: '', featured: false });
  };

  const handleAdd = () => { setEditingId(null); resetForm(); setShowForm(true); };

  const handleEdit = (item: Media) => {
    setEditingId(item.id);
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

    if (!formData.url.trim()) {
      Swal.fire('URL diperlukan', 'Silakan masukkan URL media.', 'warning');
      return;
    }

    try {
      const body = new FormData();
      if (editingId) { body.append('id', editingId); body.append('_method', 'PUT'); }
      body.append('type',        formData.type);
      body.append('title',       formData.title);
      body.append('description', formData.description);
      body.append('url',         formData.url);
      body.append('thumbnail',   formData.thumbnail);
      body.append('featured',    String(formData.featured));

      const res = await axios.post('/app-api/landing/media', body);
      if (res.data.success) {
        setShowForm(false); resetForm(); fetchMedia();
        Swal.fire('Sukses!', editingId ? 'Media diupdate.' : 'Media ditambahkan.', 'success');
      } else {
        Swal.fire('Gagal!', res.data.error || 'Terjadi kesalahan.', 'error');
      }
    } catch (err: any) {
      Swal.fire('Gagal!', err.response?.data?.message || 'Terjadi kesalahan.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus Media?', text: 'Tindakan ini tidak bisa dibatalkan.',
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Hapus', cancelButtonText: 'Batal',
    });
    if (!result.isConfirmed) return;
    const res = await axios.delete(`/app-api/landing/media?id=${id}`);
    if (res.data.success) { fetchMedia(); Swal.fire('Terhapus!', '', 'success'); }
  };

  if (!user || loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Head title="Media Manager" />

      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Manager</h1>
          <p className="text-gray-500 mt-1">Kelola gambar &amp; video yang tampil di landing page</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Media
        </Button>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><Eye className="w-4 h-4" />Preview Landing</CardTitle>
            <CardDescription>Lihat tampilan media di landing page</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/" target="_blank" rel="noreferrer">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />Buka Landing Page
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><Eye className="w-4 h-4" />Manage Content</CardTitle>
            <CardDescription>Edit hero, stats, dan about section</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/landing-manager">
              <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />Landing Manager
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-8 border-blue-100 shadow-md">
          <CardHeader>
            <CardTitle>{editingId ? '✏️ Edit Media' : '➕ Tambah Media Baru'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Type + Title */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Media</label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      setFormData({ ...formData, type: e.target.value as 'image' | 'video', url: '', thumbnail: '' });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="image">🖼️ Gambar (Image)</option>
                    <option value="video">🎬 Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Judul media"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (opsional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              {/* URL Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === 'video' ? '🔗 Link Video (YouTube / Google Drive / Vimeo) *' : '🔗 URL Gambar *'}
                </label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder={
                    formData.type === 'video'
                      ? 'https://www.youtube.com/watch?v=...  atau  https://drive.google.com/file/d/.../view'
                      : 'https://i.imgur.com/...  atau  URL gambar publik lainnya'
                  }
                  required
                />

                {/* Contextual Guides */}
                {formData.type === 'video' && <VideoGuide />}
                {formData.type === 'image' && <ImageGuide />}
              </div>

              {/* Thumbnail — optional for video, image uses URL itself */}
              {formData.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🖼️ URL Thumbnail Video (opsional)
                  </label>
                  <Input
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="Biarkan kosong untuk YouTube — thumbnail otomatis diambil"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Untuk Google Drive: upload thumbnail gambar ke Imgur, lalu paste URL-nya di sini.
                  </p>
                </div>
              )}

              {formData.type === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Thumbnail (opsional, untuk versi lebih kecil)
                  </label>
                  <Input
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="Biarkan kosong untuk pakai URL utama"
                  />
                </div>
              )}

              {/* Featured */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Tandai sebagai <strong>Featured</strong> di landing page
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingId ? 'Update Media' : 'Tambah Media'}
                </Button>
                <Button type="button" onClick={() => { setShowForm(false); resetForm(); }} variant="outline">
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Media Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Semua Media ({media.length})</h2>

        {media.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Belum ada media. Klik <strong>Add Media</strong> untuk memulai!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((item) => {
              const src = sourceLabel(item);
              return (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {/* Preview */}
                    <div className="mb-4 bg-gray-100 rounded-xl overflow-hidden h-40">
                      <MediaCardPreview item={item} />
                    </div>

                    {/* Meta */}
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.type === 'image'
                          ? <ImageIcon className={`w-4 h-4 ${src.color}`} />
                          : <Video className={`w-4 h-4 ${src.color}`} />
                        }
                        <span className={`text-xs font-semibold uppercase ${src.color}`}>{src.label}</span>
                        {item.featured && (
                          <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                            ⭐ Featured
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                      )}

                      <p className="text-xs text-gray-400 break-all pt-1 border-t">
                        <span className="font-medium">URL: </span>
                        {item.url.length > 55 ? item.url.substring(0, 55) + '…' : item.url}
                      </p>
                      <p className="text-xs text-gray-400">Posisi: {item.position}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(item)} size="sm" variant="outline" className="flex-1 gap-1">
                        <Edit2 className="w-3 h-3" /> Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)} size="sm" variant="outline"
                        className="flex-1 gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="w-3 h-3" /> Hapus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
