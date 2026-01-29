"use client"
import { Button } from "@/components/ui/button";
import useModalStore from "@/store/modal-store";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

interface CTASectionProps {
  token?: string | null;
  userId?: string | null;
}

const CTASection = ({token,userId}: CTASectionProps) => {
  const {onOpen} = useModalStore();

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
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(174,72%,56%,0.15), transparent)' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[hsl(210,40%,98%)]">
            Ready to start
            <span className="bg-gradient-to-r from-[hsl(174,72%,56%)] via-cyan-400 to-[hsl(270,60%,65%)] bg-clip-text text-transparent"> sketching?</span>
          </h2>
          <p className="text-lg text-[hsl(215,20%,65%)] mb-10">
            Join millions of users who trust SketchFlow for their creative work.
            Free forever, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => {onOpen("create-room-modal")}}  variant="hero" size="xl">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;