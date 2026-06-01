import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { LiveChatWidget } from '@/Components/LiveChatWidget';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  ChevronRight,
  ChevronLeft,
  Sparkles,
  PlayCircle,
  Globe2,
  ExternalLink,
  Rocket,
  Headset,
  Bot
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

const FloatingBubbles = () => {
  const bubbles = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((_, i) => {
        const size = Math.random() * 60 + 20;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 15 + 10;
        return (
          <motion.div
            key={i}
            className="absolute bottom-[-100px] rounded-full border border-blue-400/20 bg-gradient-to-tr from-blue-500/10 to-transparent backdrop-blur-[2px]"
            style={{ width: size, height: size, left: `${left}%` }}
            animate={{
              y: [0, -1200],
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
              opacity: [0, 0.6, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
};

const RunningText = () => {
  const texts = [
    "24/7 SUPPORT", "FAST RESPONSE", "EXPERT TEAM", "KNOWLEDGE BASE", "ITSM PLATFORM", 
    "HIGH SATISFACTION", "SEAMLESS INTEGRATION", "AI CHATBOT", "SECURE DATA"
  ];
  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-y border-white/20 py-5 flex relative z-20 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)]">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-blue-600 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-purple-600 to-transparent z-10 pointer-events-none"></div>
      <motion.div
        className="flex whitespace-nowrap gap-12 px-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 25, repeat: Infinity }}
      >
        {[...texts, ...texts, ...texts, ...texts].map((text, i) => (
          <div key={i} className="flex items-center gap-6 text-white font-extrabold tracking-[0.2em] text-sm sm:text-base drop-shadow-md">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="w-5 h-5 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" />
            </motion.div>
            {text}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

function MediaCard({ item, large }: { item: Media; large?: boolean }) {
  const isYouTubeOrVimeo =
    item.url.includes('youtube.com') ||
    item.url.includes('youtu.be') ||
    item.url.includes('vimeo.com') ||
    item.url.includes('player.vimeo');

  const isDrive = item.url.includes('drive.google.com');

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group rounded-3xl overflow-hidden bg-slate-50 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 ${
        large ? 'md:col-span-2 lg:col-span-2' : ''
      }`}
    >
      <div className="relative w-full bg-gray-900 overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {item.type === 'image' ? (
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src={item.thumbnail || item.url}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/800x450?text=Image';
            }}
          />
        ) : isYouTubeOrVimeo ? (
          <iframe
            src={item.url}
            title={item.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        ) : isDrive ? (
          <a
            href={item.url.replace('/preview', '/view')}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full relative group/drive overflow-hidden"
          >
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
              src={item.thumbnail || 'https://placehold.co/800x450?text=Google+Drive+Video'}
              alt={item.title}
              className="w-full h-full object-cover opacity-70 group-hover/drive:opacity-50 transition-opacity"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/800x450?text=Google+Drive+Video';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                whileHover={{ scale: 1.2, rotate: 90 }}
                className="bg-white/90 rounded-full p-4 shadow-2xl"
              >
                <PlayCircle className="w-12 h-12 text-blue-600" />
              </motion.div>
            </div>
          </a>
        ) : (
          <video
            src={item.url}
            className="w-full h-full object-cover"
            controls
            playsInline
            preload="metadata"
          />
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          {item.featured && (
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              ⭐ Featured
            </span>
          )}
          <span className="text-xs text-gray-400 uppercase font-medium tracking-wider">{item.type}</span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
        )}

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-5 py-2.5 rounded-full transition-all shadow-sm"
        >
          <ExternalLink className="w-4 h-4" />
          View Details
        </a>
      </div>
    </motion.div>
  );
}

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
          axios.get('/app-api/landing/content'),
          axios.get('/app-api/landing/media'),
        ]);

        if (contentRes.data.success) setContent(contentRes.data.data);
        if (mediaRes.data.success) setMedia(mediaRes.data.data);
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
    }, 5000);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Head title="Welcome to FittDesk" />
        <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-blue-500 rounded-full blur-xl"
            />
            <Building2 className="w-12 h-12 text-blue-600 animate-bounce relative z-10" />
        </div>
      </div>
    );
  }

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
      description: 'FittDesk IT Support is dedicated to ensuring smooth operations and providing comprehensive documentation for all internal systems.',
      mission: 'To provide lightning-fast resolution to technical issues and create accessible knowledge for everyone',
      vision: 'To build a self-sustaining ecosystem of technical knowledge and reliable IT support',
    },
  };

  const landingContent = content || defaultContent;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-600 selection:text-white">
      <Head title="Helpdesk & Support Center | FittDesk" />
      
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F1C]/80 backdrop-blur-lg border-b border-white/10 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">FittDesk</span>
          </motion.div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href={route('login')}>
              <Button variant="ghost" className="hidden sm:flex text-gray-300 hover:bg-white/10 hover:text-white font-medium transition-colors">Login</Button>
            </Link>
            <Link href={route('register')}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 shadow-md shadow-blue-500/20 transition-colors">Get Started</Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Modern Hero Section with Floating Bubbles */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-32 overflow-hidden bg-[#0A0F1C]">
        <FloatingBubbles />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none z-0" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Hero Text */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 mb-6 backdrop-blur-md cursor-default"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium tracking-wide">Next-Gen ITSM Platform</span>
              </motion.div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
                {landingContent.hero.title.split(' ').map((word, i) => (
                    <span key={i} className={i === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400' : ''}> {word} </span>
                ))}
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 font-light mb-4">
                {landingContent.hero.subtitle}
              </p>
              <p className="text-base sm:text-lg text-gray-400 mb-10 max-w-xl leading-relaxed">
                {landingContent.hero.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#features">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 py-6 text-lg shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] group">
                      {landingContent.hero.ctaText}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </a>
                <a href="#media">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white backdrop-blur-md group">
                      <PlayCircle className="w-5 h-5 mr-2 text-blue-400 group-hover:scale-110 transition-transform" />
                      Watch Demo
                    </Button>
                  </motion.div>
                </a>
              </div>
            </motion.div>

            {/* Hero Image Slider */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
              className="hidden lg:block relative perspective-1000"
            >
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl aspect-[4/3]">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.src}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      index === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
                    }`}
                  >
                    <img src={slide.src} alt={slide.title} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={index === activeSlide ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="absolute bottom-0 left-0 right-0 p-8"
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 mb-3">
                        <Globe2 className="w-4 h-4 text-blue-300" />
                        <span className="text-xs uppercase tracking-wider text-blue-100 font-semibold">Live Preview</span>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-2">{slide.title}</h3>
                      <p className="text-blue-200/80 font-medium">{slide.caption}</p>
                    </motion.div>
                  </div>
                ))}
                
                <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between z-20">
                    <button onClick={() => setActiveSlide((c) => (c - 1 + heroSlides.length) % heroSlides.length)} className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setActiveSlide((c) => (c + 1) % heroSlides.length)} className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="absolute bottom-4 right-8 flex gap-2 z-20">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index === activeSlide ? 'w-8 bg-blue-500' : 'w-2 bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
                { icon: TrendingUp, value: `${landingContent.stats.projects}+`, label: 'Tickets Resolved', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: Building2, value: `${landingContent.stats.units}+`, label: 'Active Agents', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { icon: Award, value: `${landingContent.stats.yearsExperience}+`, label: 'Articles Published', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { icon: Star, value: `${landingContent.stats.satisfaction}%`, label: 'Satisfaction Rate', color: 'text-amber-500', bg: 'bg-amber-50' }
            ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="border-0 shadow-xl shadow-blue-900/5 bg-white/90 backdrop-blur-xl hover:-translate-y-2 transition-transform duration-300 rounded-2xl overflow-hidden group h-full flex flex-col justify-center">
                      <CardContent className="p-6 sm:p-8 text-center relative flex-1">
                          <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-50 transition-colors ${stat.bg} group-hover:scale-110 duration-500 -z-10`}></div>
                          <stat.icon className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                          <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
                          <p className="text-sm sm:text-base font-medium text-gray-500 mt-1">{stat.label}</p>
                      </CardContent>
                  </Card>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Running Text Marquee */}
      <div className="mb-20">
        <RunningText />
      </div>

      {/* Bento Grid Features Section */}
      <section id="features" className="py-12 px-4 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-left"
            >
              <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Enterprise Grade</h2>
              <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Everything you need to support your team</h3>
              <p className="text-lg text-gray-600 leading-relaxed">A perfectly integrated ecosystem of tools designed to help IT teams resolve issues faster and maintain clear documentation.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 1 }}
              className="flex justify-center lg:justify-end relative"
            >
              <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
              <img 
                src="/images/support_agent_3d.png" 
                alt="IT Support Agent" 
                className="relative z-10 w-full max-w-md drop-shadow-2xl hover:-translate-y-4 transition-transform duration-500" 
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Large Featured Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden bg-white shadow-lg border border-gray-100 group"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50"></div>
                <div className="p-10 relative z-10 flex flex-col h-full">
                    <motion.div whileHover={{ scale: 1.1, rotate: 15 }} className="w-fit">
                      <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/40 mb-6 border border-white/20">
                        <Rocket className="w-12 h-12 text-white drop-shadow-md" />
                      </div>
                    </motion.div>
                    <h4 className="text-3xl font-bold text-gray-900 mb-4">Fast Response SLA</h4>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-md">Guaranteed response times based on ticket priority and severity. Our automated routing ensures the right agent sees the right ticket instantly.</p>
                    <div className="mt-auto">
                        <Button variant="link" className="text-blue-600 p-0 text-base font-semibold group-hover:translate-x-2 transition-transform">Learn more <ArrowRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                </div>
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-600/5 rounded-tl-full transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700"></div>
            </motion.div>

            {/* Small Box 1 */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden bg-white shadow-lg border border-gray-100 group"
            >
                <div className="p-8 h-full flex flex-col">
                    <motion.div whileHover={{ scale: 1.1, rotate: -15 }} className="w-fit">
                      <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/40 mb-4 border border-white/20">
                        <Headset className="w-8 h-8 text-white drop-shadow-md" />
                      </div>
                    </motion.div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Expert Writers</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Clear, concise, and accurate documentation maintained by professionals.</p>
                </div>
            </motion.div>

            {/* Small Box 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative rounded-3xl overflow-hidden bg-gray-900 text-white shadow-lg group"
            >
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-bl-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="p-8 h-full flex flex-col relative z-10">
                    <motion.div whileHover={{ scale: 1.1, rotate: 180 }} transition={{ duration: 0.5 }} className="w-fit">
                      <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg shadow-orange-500/40 mb-4 border border-white/20">
                        <Bot className="w-8 h-8 text-white drop-shadow-md" />
                      </div>
                    </motion.div>
                    <h4 className="text-xl font-bold mb-2">24/7 Availability</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">Our knowledge base is always accessible, providing instant answers anytime.</p>
                </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dynamic Media Section */}
      {media.length > 0 && (
        <section id="media" className="py-12 px-4 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-left"
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Platform Highlights</h2>
                <p className="text-lg text-gray-600 max-w-xl mb-6">Take a visual tour of FittDesk's powerful IT service capabilities and collaborative features.</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-fit">
                  <Button variant="outline" className="rounded-full border-gray-300 hover:bg-gray-50 shadow-sm">View all modules</Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 1, delay: 0.2 }}
                className="hidden md:flex justify-center lg:justify-end relative"
              >
                  <div className="absolute inset-0 bg-yellow-400/5 blur-3xl rounded-full"></div>
                  <img 
                    src="/images/team_collaboration_3d.png" 
                    alt="Team Collaboration" 
                    className="relative z-10 w-full max-w-[280px] drop-shadow-xl hover:rotate-3 hover:scale-105 transition-transform duration-500" 
                  />
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {media.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <MediaCard item={item} large={i === 0} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Split About Section */}
      <section className="py-16 px-4 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">{landingContent.about.title}</h2>
              <p className="text-xl text-gray-400 font-light leading-relaxed">{landingContent.about.description}</p>

              <div className="grid sm:grid-cols-2 gap-6 pt-6">
                <motion.div whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-colors">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/30">
                    <CheckCircle2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Mission</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{landingContent.about.mission}</p>
                </motion.div>

                <motion.div whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-colors">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/30">
                    <Star className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Vision</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{landingContent.about.vision}</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] transform rotate-3 scale-105 opacity-50 blur-lg animate-pulse"></div>
                <img
                    src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
                    alt="IT Support Center"
                    className="relative rounded-[2.5rem] shadow-2xl border border-white/10 w-full object-cover aspect-square sm:aspect-[4/3] lg:aspect-square"
                />
                
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 flex items-center gap-4 cursor-pointer"
                >
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                        <Award className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Certified Support</p>
                        <p className="text-xl font-bold text-gray-900">ISO 27001</p>
                    </div>
                </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section id="contact" className="py-16 px-4 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[80px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">Ready to transform your IT Support?</h2>
            <p className="text-xl text-blue-100 mb-10 font-light max-w-2xl mx-auto">
              Tingkatkan produktivitas tim Anda dengan ekosistem FittDesk yang terintegrasi penuh.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-16">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-4 rounded-full border-0 bg-white/10 text-white placeholder:text-blue-200 backdrop-blur-md focus:ring-2 focus:ring-white outline-none transition-all focus:bg-white/20"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
                  disabled={subscribed}
                >
                  {subscribed ? 'Subscribed! 🎉' : 'Get Started'}
                </Button>
              </motion.div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white text-left">
                {[
                  { icon: MapPin, title: 'Visit Us', desc: 'Jakarta, Indonesia' },
                  { icon: Phone, title: 'Call Us', desc: '08128886013' },
                  { icon: Mail, title: 'Email Us', desc: 'fittdesk@gmail.com' }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.2)" }}
                    className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/20 transition-colors"
                  >
                      <item.icon className="w-8 h-8 text-blue-200 mb-4" />
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-blue-100 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
            </div>
        </motion.div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-white py-6 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">FittDesk</span>
          </div>
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} FittDesk Integrated Services. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-gray-600">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <Link href="/login" className="hover:text-blue-600 transition-colors">Admin Login</Link>
          </div>
        </div>
      </footer>

      <LiveChatWidget />
    </div>
  );
}
