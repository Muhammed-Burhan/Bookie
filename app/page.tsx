import Hero from '@/components/home/Hero';
import Trending from '@/components/home/Trending';

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Cinematic Hero Section */}
      <Hero />
      
      {/* Featured / Trending Section */}
      <Trending />
      
      {/* Subliminal Brand Accent */}
      <div className="py-24 bg-bg-primary/50 relative">
        <div className="container max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-6 opacity-30">
            <div className="h-[1px] w-32 bg-accent" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.5em]">
              The Sanctuary of Knowledge
            </span>
            <div className="h-[1px] w-32 bg-accent" />
          </div>
        </div>
      </div>
    </main>
  );
}
