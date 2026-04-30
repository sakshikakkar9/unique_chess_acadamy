import { useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import GalleryItem from "@/features/gallery/components/GalleryItem";
import { useGallery } from "@/features/gallery/hooks/useGallery";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import heroImg from "@/assets/hero-chess.jpg"; 
import { Link } from "react-router-dom";

// --- CANVAS PARTICLE SYSTEM ---
const InteractiveBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrameId;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = "rgba(125, 211, 252, 0.4)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const init = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < count; i++) particles.push(new Particle());
    };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    };
    window.addEventListener("resize", resize);
    resize(); init(); animate();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animationFrameId); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
};

export default function GalleryPage() {
  const { images, filter, setFilter, categories, isLoading } = useGallery();

  return (
    <div className="min-h-screen relative text-slate-50 selection:bg-sky-500/30 overflow-x-hidden 
      /* 4-Step Blue Gradient Background */
      bg-gradient-to-br from-[#0f172a] via-[#1e293b] via-[#0c4a6e] to-[#075985]">
      
      <Navbar />
      <InteractiveBackground />

      {/* HERO SECTION WITH GLASS EFFECT */}
      <section className="relative pt-40 pb-24 flex items-center">
        <div className="container mx-auto px-6 z-10 text-center">
          <ScrollReveal>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sky-300 text-xs font-bold tracking-widest uppercase mb-8"
            >
              <Sparkles className="h-4 w-4 animate-pulse" /> Gallery Highlights
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter">
              Moments of <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">Excellence</span>
            </h1>
            
            <p className="text-sky-100/70 max-w-2xl mx-auto text-xl leading-relaxed mb-16 font-medium">
              A visual chronicle of strategy, victory, and the journey toward mastery.
            </p>

            {/* Category Filter - Glassy Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-500 border backdrop-blur-xl",
                    filter === cat
                      ? "bg-sky-500/80 text-white border-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] scale-110"
                      : "bg-white/5 border-white/10 text-sky-100 hover:bg-white/10 hover:border-sky-400/50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* MAIN GALLERY GRID */}
      <section className="relative z-10 pb-32">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-[3rem] bg-white/5 border border-white/10" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {images.length > 0 ? (
                images.map((img, i) => (
                  <ScrollReveal key={img.id} delay={i * 0.05}>
                    <div className="group relative rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:border-sky-400/50 hover:shadow-2xl hover:shadow-sky-500/20">
                      <GalleryItem image={img} index={i} />
                    </div>
                  </ScrollReveal>
                ))
              ) : (
                <div className="col-span-full text-center py-40 bg-white/5 backdrop-blur-md rounded-[4rem] border border-dashed border-white/20">
                  <ImageIcon className="h-20 w-20 text-sky-500/30 mx-auto mb-6" />
                  <p className="text-sky-200 font-black uppercase tracking-widest text-lg">No Images Found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER - LIGHTER SHADE & FULL READABILITY */}
      <footer className="relative z-10 pt-24 pb-12 bg-white/5 backdrop-blur-3xl border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-16 border-b border-white/10">
            
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/40">
                   <span className="text-white font-black text-2xl italic">U</span>
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                  Unique <span className="text-sky-400">Chess</span>
                </h3>
              </div>
              <p className="text-sky-100/60 text-sm leading-relaxed">
                Nurturing Grandmasters through professional discipline and champion mentorship.
              </p>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-sky-400">Navigation</h4>
              <ul className="space-y-4">
                {['About Us', 'Courses', 'Tournaments', 'Gallery'].map((item) => (
                  <li key={item}>
                    <Link to={`/${item.toLowerCase()}`} className="text-sky-100/80 hover:text-white text-sm font-bold transition-all flex items-center gap-2 group">
                      <div className="h-1 w-0 bg-sky-400 group-hover:w-4 transition-all duration-300" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-sky-400">Programs</h4>
              <ul className="space-y-4">
                {['Beginner', 'Intermediate', 'Advanced Mastery'].map((item) => (
                  <li key={item} className="text-sky-100/80 text-sm font-bold hover:text-sky-300 cursor-pointer transition-all">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-sky-400">Visit Us</h4>
              <div className="space-y-6 text-sky-100/90">
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-sky-400" />
                  <span className="text-sm font-bold">Yamuna Nagar, Haryana</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-sky-400" />
                  <span className="text-sm font-bold">play@uniquechess.in</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-sky-100/40 font-bold uppercase tracking-widest">
              © 2026 Unique Chess Academy.
            </p>
            <p className="text-xs text-white font-black uppercase tracking-widest bg-sky-500/20 px-4 py-2 rounded-lg border border-sky-500/30">
              Designed by Sakshi
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}