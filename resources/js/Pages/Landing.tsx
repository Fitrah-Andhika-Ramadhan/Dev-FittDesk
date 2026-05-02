import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import {
  Building2,
  TrendingUp,
  Zap,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Star,
  Award,
  ShieldCheck,
  Hammer,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import axios from 'axios';

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
}

interface StatsContent {
  projects: number;
  units: number;
  yearsExperience: number;
  satisfaction: number;
}

interface AboutContent {
  title: string;
  description: string;
  mission: string;
  vision: string;
}

interface Media {
  id: string;
  type: 'image' | 'video';
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  featured: boolean;
}

interface LandingContent {
  hero: HeroContent;
  stats: StatsContent;
  about: AboutContent;
}

const heroSlides = [
  {
    src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop',
    title: 'Helpdesk & Service Center',
    caption: 'Integrated IT Service Management for FittDesk',
  },
  {
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    title: 'Knowledge Base',
    caption: 'Comprehensive documentation and technical guides',
  },
  {
    src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop',
    title: '24/7 Ticketing System',
    caption: 'Report issues and track resolution progress in real-time',
  },
  {
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop',
    title: 'Expert Support',
    caption: 'Professional technical writers and support agents ready to help',
  },
];

export default function Landing() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [content, setContent] = useState<LandingContent | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [contentRes, mediaRes] = await Promise.all([
          axios.get('/api/landing/content'),
          axios.get('/api/landing/media'),
        ]);

        if (contentRes.data.success) {
          setContent(contentRes.data.data);
        }
        if (mediaRes.data.success) {
          setMedia(mediaRes.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch landing content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  const handlePrevSlide = () => {
    setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Head title="Welcome to FittDesk" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Default content if API fails
  const defaultContent: LandingContent = {
    hero: {
      title: 'FittDesk Helpdesk',
      subtitle: 'Integrated Support & Service Center',
      description: 'Layanan terpadu pelaporan kendala IT, Knowledge Base, dan dokumentasi operasional perusahaan.',
      ctaText: 'Access Knowledge Base',
    },
    stats: {
      projects: 1500,
      units: 50,
      yearsExperience: 250,
      satisfaction: 99,
    },
    about: {
      title: 'About FittDesk IT Support',
      description:
        'FittDesk IT Support is dedicated to ensuring smooth operations and providing comprehensive documentation for all internal systems.',
      mission: 'To provide lightning-fast resolution to technical issues and create accessible knowledge for everyone',
      vision: 'To build a self-sustaining ecosystem of technical knowledge and reliable IT support',
    },
  };

  const landingContent = content || defaultContent;

  return (
    <div className="min-h-screen bg-white">
      <Head title="Helpdesk & Support Center | FittDesk" />
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">FittDesk</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href={route('login')}>
              <Button variant="outline">Login</Button>
            </Link>
            <Link href={route('register')}>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">Register</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">{landingContent.hero.title}</h1>
              <p className="text-2xl text-blue-100 mb-4">{landingContent.hero.subtitle}</p>
              <p className="text-lg text-blue-50 mb-8">{landingContent.hero.description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#features">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-2">
                    {landingContent.hero.ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="#contact">
                  <Button variant="outline" className="border-white text-white hover:bg-blue-700">
                    Contact Us
                  </Button>
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur">
                <div className="relative h-[420px]">
                  {heroSlides.map((slide, index) => (
                    <div
                      key={slide.src}
                      className={`absolute inset-0 transition-opacity duration-700 ${
                        index === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={slide.src}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <p className="text-sm uppercase tracking-[0.2em] text-blue-200 mb-2">Image Runner</p>
                        <h3 className="text-2xl font-bold">{slide.title}</h3>
                        <p className="text-sm text-blue-100 mt-1">{slide.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={handlePrevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 text-white backdrop-blur flex items-center justify-center hover:bg-white/30 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={handleNextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 text-white backdrop-blur flex items-center justify-center hover:bg-white/30 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.src}
                      type="button"
                      aria-label={`Go to slide ${index + 1}`}
                      onClick={() => setActiveSlide(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activeSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-4xl font-bold text-gray-900">{landingContent.stats.projects}+</p>
                <p className="text-gray-600 mt-2">Tickets Resolved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-4xl font-bold text-gray-900">{landingContent.stats.units}+</p>
                <p className="text-gray-600 mt-2">Active Agents</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-4xl font-bold text-gray-900">{landingContent.stats.yearsExperience}+</p>
                <p className="text-gray-600 mt-2">Articles Published</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-4xl font-bold text-gray-900">{landingContent.stats.satisfaction}%</p>
                <p className="text-gray-600 mt-2">Resolution Satisfaction</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Support?</h2>
            <p className="text-xl text-gray-600">Fast response, clear documentation, and dedicated assistance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Fast Response SLA',
                description: 'Guaranteed response times based on ticket priority and severity',
              },
              {
                icon: Hammer,
                title: 'Expert Technical Writers',
                description: 'Clear, concise, and accurate documentation for all systems',
              },
              {
                icon: Zap,
                title: '24/7 Availability',
                description: 'Our knowledge base is always accessible whenever you need it',
              },
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6 text-center">
                  <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Gallery Section */}
      {media.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Service Highlights</h2>
              <p className="text-xl text-gray-600">Discover our key IT services and documentation modules</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item) => (
                <div key={item.id} className="group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                  <div className="relative overflow-hidden h-64 bg-gray-100">
                    {item.type === 'image' ? (
                      <img
                        src={item.thumbnail || item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <iframe
                        src={item.url}
                        title={item.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                    {item.featured && (
                      <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Company Profile Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{landingContent.about.title}</h2>
              <p className="text-lg text-gray-600 mb-8">{landingContent.about.description}</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                  <p className="text-gray-600 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    {landingContent.about.mission}
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Our Vision</h3>
                  <p className="text-gray-600 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    {landingContent.about.vision}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
                alt="IT Support Center"
                className="rounded-lg shadow-lg w-full h-auto"
              />
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
                  alt="Team Collaboration"
                  className="rounded-lg shadow-lg w-full h-auto"
                />
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
                  alt="Support Agent"
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-600 mb-8">Subscribe to get the latest updates about our projects</p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              disabled={subscribed}
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </Button>
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 mb-8">
              Punya pertanyaan atau siap menjadi bagian dari komunitas eksklusif FittDesk?
            </p>
            <div className="flex justify-center items-center gap-4">
              <Link href={route('register')}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                  Join / Daftarkan Diri Disini
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-600">Jakarta, Indonesia</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Phone className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+62 812 3456 7890</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">info@fittdesk.com</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                FittDesk
              </h4>
              <p className="text-sm">Integrated Helpdesk & Service Center</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#about" className="hover:text-white">
                    About IT
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white">
                    Services
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Follow Us</h4>
              <p className="text-sm">Stay connected with our latest updates</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 FittDesk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
