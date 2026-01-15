import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { cookies } from 'next/headers'

export default async function Home() {

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value;

  return (
    <div className="min-h-screen bg-[hsl(222,47%,11%)]">
      <Navbar token={token} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
