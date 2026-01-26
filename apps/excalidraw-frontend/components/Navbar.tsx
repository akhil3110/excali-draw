"use client";

import { Button } from "@/components/ui/button";
import useModalStore from "@/store/modal-store";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  token?: string | null;
}

const Navbar = ({
  token
}: NavbarProps) => {

  const router = useRouter()
  const {onOpen} = useModalStore()
 
  async function handleLogout() {
    onOpen("logout-modal")
  }


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[hsl(222,47%,25%)]/50 bg-[hsl(222,47%,11%)]/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(174,72%,56%)]/10 border border-[hsl(174,72%,56%)]/30 group-hover:bg-[hsl(174,72%,56%)]/20 transition-colors">
            <Pencil className="h-5 w-5 text-[hsl(174,72%,56%)]" />
          </div>
          <span className="text-xl font-semibold text-[hsl(210,40%,98%)]">
            Sketch<span className="text-[hsl(174,72%,56%)]">Flow</span>
          </span>
        </a>

        {/* Navigation Links */}
        {/* <div className="hidden md:flex items-center gap-1">
          <Button variant="nav" size="sm">Features</Button>
          <Button variant="nav" size="sm">Pricing</Button>
          <Button variant="nav" size="sm">About</Button>
        </div> */}

        {/* Auth Buttons */}
        {token ? (
          <div className="flex items-center gap-3">
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,98%)]">
              Log Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button onClick={() => router.push("/auth/sign-in")} variant="ghost" size="sm" className="text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,98%)]">
              Log in
            </Button>
            <Button onClick={() => router.push("/auth/sign-up")} variant="nav-primary" size="sm">
              Sign up free
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;