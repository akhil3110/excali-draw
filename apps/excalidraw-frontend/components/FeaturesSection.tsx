import { Zap, Users, Lock, Palette, Download, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant response with optimized rendering. No lag, just pure creativity.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time. See changes as they happen.",
  },
  {
    icon: Lock,
    title: "End-to-End Encrypted",
    description: "Your drawings are private. Full encryption keeps your ideas safe.",
  },
  {
    icon: Palette,
    title: "Hand-drawn Style",
    description: "Beautiful sketchy aesthetic that makes diagrams feel personal and approachable.",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "Export to PNG, SVG, or share a link. Your drawings, your way.",
  },
  {
    icon: Globe,
    title: "Works Offline",
    description: "No internet? No problem. Keep sketching and sync when you're back online.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[hsl(210,40%,98%)]">
            Everything you need to
            <span className="bg-gradient-to-r from-[hsl(174,72%,56%)] via-cyan-400 to-[hsl(270,60%,65%)] bg-clip-text text-transparent"> sketch ideas</span>
          </h2>
          <p className="text-lg text-[hsl(215,20%,65%)] max-w-2xl mx-auto">
            Powerful features wrapped in a simple, intuitive interface. 
            Start creating in seconds.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-[hsl(222,47%,25%)]/50 hover:border-[hsl(174,72%,56%)]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[hsl(174,72%,56%)]/5 animate-fade-in"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                background: 'linear-gradient(180deg, hsl(222,47%,16%) 0%, hsl(222,47%,12%) 100%)'
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(174,72%,56%)]/10 border border-[hsl(174,72%,56%)]/20 mb-4 group-hover:bg-[hsl(174,72%,56%)]/20 transition-colors">
                <feature.icon className="h-6 w-6 text-[hsl(174,72%,56%)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[hsl(210,40%,98%)]">
                {feature.title}
              </h3>
              <p className="text-[hsl(215,20%,65%)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;