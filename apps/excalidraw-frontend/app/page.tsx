import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { cookies } from 'next/headers'
import { getUserId } from "@/lib/getDetails";

export default async function Home() {

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value;
  const userId = getUserId(token!);

  return (
    <div className="min-h-screen bg-[hsl(222,47%,11%)]">
      <Navbar token={token} />
      <main>
        <HeroSection token={token} userId={userId} />
        <FeaturesSection />
        <CTASection token={token} userId={userId} />
      </main>
      <Footer />
    </div>
  );
}
