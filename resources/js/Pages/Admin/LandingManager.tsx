import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Save, Edit2, ExternalLink, Eye } from 'lucide-react';
import axios from 'axios';

interface LandingContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
  };
  stats: {
    projects: number;
    units: number;
    yearsExperience: number;
    satisfaction: number;
  };
  about: {
    title: string;
    description: string;
    mission: string;
    vision: string;
  };
}

export default function LandingManager() {
  const { auth } = usePage<any>().props;
  const user = auth?.user;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<LandingContent | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get('/app-api/landing/content');
      const data = response.data;
      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    
    setSaving(true);
    try {
      const response = await axios.put('/app-api/landing/content', content);
      const data = response.data;
      if (data.success) {
        setEditingSection(null);
        alert('Content saved successfully');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center flex-1 py-20">
          <p>Loading...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Head title="Manage Landing Page" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Landing Page</h1>
        <p className="text-gray-600 mt-2">Edit hero section, statistics, and about content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview Landing
            </CardTitle>
            <CardDescription>See how your landing page looks</CardDescription>
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

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Media Gallery
            </CardTitle>
            <CardDescription>Manage images and videos</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/media-manager">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Go to Media Manager
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Landing Info
            </CardTitle>
            <CardDescription>Public access details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-3">
              <p>Public URL: <code className="bg-gray-100 px-2 py-1 rounded text-xs">/</code></p>
            </div>
            <p className="text-xs text-gray-500">Anyone can view the landing page without login</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main headline and description</CardDescription>
          </div>
          <Button
            variant={editingSection === 'hero' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setEditingSection(editingSection === 'hero' ? null : 'hero')}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={content?.hero.title || ''}
              onChange={(e) => setContent({
                ...content!,
                hero: { ...content!.hero, title: e.target.value }
              })}
              disabled={editingSection !== 'hero'}
              className="w-full p-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Subtitle</label>
            <input
              type="text"
              value={content?.hero.subtitle || ''}
              onChange={(e) => setContent({
                ...content!,
                hero: { ...content!.hero, subtitle: e.target.value }
              })}
              disabled={editingSection !== 'hero'}
              className="w-full p-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={content?.hero.description || ''}
              onChange={(e) => setContent({
                ...content!,
                hero: { ...content!.hero, description: e.target.value }
              })}
              disabled={editingSection !== 'hero'}
              className="w-full p-2 border rounded-lg h-24 disabled:bg-gray-100"
            />
          </div>

          {editingSection === 'hero' && (
            <Button onClick={handleSave} disabled={saving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Company Statistics</CardTitle>
            <CardDescription>Key metrics displayed on landing page</CardDescription>
          </div>
          <Button
            variant={editingSection === 'stats' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setEditingSection(editingSection === 'stats' ? null : 'stats')}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Projects</label>
              <input
                type="number"
                value={content?.stats.projects || 0}
                onChange={(e) => setContent({
                  ...content!,
                  stats: { ...content!.stats, projects: parseInt(e.target.value) || 0 }
                })}
                disabled={editingSection !== 'stats'}
                className="w-full p-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Units</label>
              <input
                type="number"
                value={content?.stats.units || 0}
                onChange={(e) => setContent({
                  ...content!,
                  stats: { ...content!.stats, units: parseInt(e.target.value) || 0 }
                })}
                disabled={editingSection !== 'stats'}
                className="w-full p-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Years Experience</label>
              <input
                type="number"
                value={content?.stats.yearsExperience || 0}
                onChange={(e) => setContent({
                  ...content!,
                  stats: { ...content!.stats, yearsExperience: parseInt(e.target.value) || 0 }
                })}
                disabled={editingSection !== 'stats'}
                className="w-full p-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Satisfaction %</label>
              <input
                type="number"
                value={content?.stats.satisfaction || 0}
                onChange={(e) => setContent({
                  ...content!,
                  stats: { ...content!.stats, satisfaction: parseInt(e.target.value) || 0 }
                })}
                disabled={editingSection !== 'stats'}
                className="w-full p-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>
          </div>

          {editingSection === 'stats' && (
            <Button onClick={handleSave} disabled={saving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>About Company</CardTitle>
            <CardDescription>Company description, mission, and vision</CardDescription>
          </div>
          <Button
            variant={editingSection === 'about' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setEditingSection(editingSection === 'about' ? null : 'about')}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Company Title</label>
            <input
              type="text"
              value={content?.about.title || ''}
              onChange={(e) => setContent({
                ...content!,
                about: { ...content!.about, title: e.target.value }
              })}
              disabled={editingSection !== 'about'}
              className="w-full p-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={content?.about.description || ''}
              onChange={(e) => setContent({
                ...content!,
                about: { ...content!.about, description: e.target.value }
              })}
              disabled={editingSection !== 'about'}
              className="w-full p-2 border rounded-lg h-20 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Mission</label>
            <input
              type="text"
              value={content?.about.mission || ''}
              onChange={(e) => setContent({
                ...content!,
                about: { ...content!.about, mission: e.target.value }
              })}
              disabled={editingSection !== 'about'}
              className="w-full p-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Vision</label>
            <input
              type="text"
              value={content?.about.vision || ''}
              onChange={(e) => setContent({
                ...content!,
                about: { ...content!.about, vision: e.target.value }
              })}
              disabled={editingSection !== 'about'}
              className="w-full p-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          {editingSection === 'about' && (
            <Button onClick={handleSave} disabled={saving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  );
}
