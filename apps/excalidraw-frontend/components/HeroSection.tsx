"use client";
import { Button } from "@/components/ui/button";
import useModalStore from "@/store/modal-store";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface HeroSection {
  token?: string | null;
  userId?: string | null;
}


const HeroSection = ({
  token,
  userId
}: HeroSection) => {

  const {onOpen} = useModalStore();
  const router = useRouter()

  function handleStartDrawing() {
    try {
      
      if(!token || !userId) {
        return toast.error("Please login to start drawing!");
      }

      onOpen("create-room-modal",{userId})

    } catch (error) {
      
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(174,72%,56%,0.15), transparent)' }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[hsl(174,72%,56%)]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[hsl(270,60%,65%)]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(222,47%,20%)]/50 border border-[hsl(222,47%,25%)] mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-[hsl(174,72%,56%)]" />
            <span className="text-sm text-[hsl(215,20%,65%)]">
              Free & Open Source Whiteboard
            </span>
          </div>

          {/* Headline */}
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in text-[hsl(210,40%,98%)]"
            style={{ animationDelay: '0.1s' }}
          >
            Sketch your ideas
            <br />
            <span className="bg-gradient-to-r from-[hsl(174,72%,56%)] via-cyan-400 to-[hsl(270,60%,65%)] bg-clip-text text-transparent">beautifully</span>
          </h1>

          {/* Subheadline */}
          <p 
            className="text-xl md:text-2xl text-[hsl(215,20%,65%)] mb-10 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            A virtual whiteboard for sketching hand-drawn like diagrams. 
            Collaborate with your team in real-time.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <Button onClick={handleStartDrawing} variant="hero" size="xl">
              Start Drawing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {token && (
              <Button onClick={() => router.push("/dashboard")} variant="hero-outline" size="xl">
                Dashboard
              </Button>
            )}
          </div>

          {/* Stats */}
          {/* <div 
            className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            {[
              { value: '10M+', label: 'Active Users' },
              { value: '50M+', label: 'Drawings Created' },
              { value: '4.9', label: 'User Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-[hsl(210,40%,98%)]">{stat.value}</div>
                <div className="text-sm text-[hsl(215,20%,65%)]">{stat.label}</div>
              </div>
            ))}
          </div> */}
        </div>

        {/* Preview Image */}
        <div 
          className="mt-20 max-w-5xl mx-auto animate-fade-in"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="relative rounded-2xl overflow-hidden border border-[hsl(222,47%,25%)]/50 bg-[hsl(222,47%,14%)]/50 backdrop-blur-sm shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(222,47%,11%)]/80 to-transparent pointer-events-none z-10" />
            <SketchPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

const SketchPreview = () => (
  <svg viewBox="0 0 800 400" className="w-full h-auto">
    {/* Background grid */}
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(222,47%,20%)" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="800" height="400" fill="hsl(222,47%,11%)" />
    <rect width="800" height="400" fill="url(#grid)" />
    
    {/* Sketchy elements */}
    <g stroke="hsl(174,72%,56%)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Rectangle */}
      <path d="M 100 100 L 250 102 L 248 200 L 102 198 Z" opacity="0.8" />
      {/* Arrow */}
      <path d="M 260 150 L 350 150" />
      <path d="M 340 140 L 355 150 L 340 160" />
      {/* Circle */}
      <ellipse cx="450" cy="150" rx="60" ry="55" opacity="0.8" />
      {/* Another arrow */}
      <path d="M 520 150 L 610 150" />
      <path d="M 600 140 L 615 150 L 600 160" />
      {/* Diamond */}
      <path d="M 700 100 L 750 150 L 700 200 L 650 150 Z" opacity="0.8" />
    </g>
    
    {/* Text placeholders */}
    <g fill="hsl(215,20%,65%)" fontFamily="Inter" fontSize="14">
      <text x="140" y="155">Start</text>
      <text x="425" y="155">Process</text>
      <text x="680" y="155">End</text>
    </g>

    {/* Decorative sketchy notes */}
    <g stroke="hsl(270,60%,65%)" strokeWidth="1.5" fill="none" opacity="0.6">
      <path d="M 150 280 L 350 282" strokeDasharray="5 5" />
      <path d="M 450 280 L 650 278" strokeDasharray="5 5" />
    </g>
  </svg>
);

export default HeroSection;