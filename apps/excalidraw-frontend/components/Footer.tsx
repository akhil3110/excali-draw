import { Pencil } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-[hsl(222,47%,25%)]/50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(174,72%,56%)]/10 border border-[hsl(174,72%,56%)]/30">
              <Pencil className="h-4 w-4 text-[hsl(174,72%,56%)]" />
            </div>
            <span className="text-lg font-semibold text-[hsl(210,40%,98%)]">
              Sketch<span className="text-[hsl(174,72%,56%)]">Flow</span>
            </span>
          </a>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-[hsl(215,20%,65%)]">
            <a href="#" className="hover:text-[hsl(210,40%,98%)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[hsl(210,40%,98%)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[hsl(210,40%,98%)] transition-colors">GitHub</a>
            <a href="#" className="hover:text-[hsl(210,40%,98%)] transition-colors">Twitter</a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-[hsl(215,20%,65%)]">
            © 2025 SketchFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;