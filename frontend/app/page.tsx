import Features from "@/components/landingComps/Features";
import Footer from "@/components/landingComps/Footer";
import { HeroSection } from "@/components/landingComps/HeroSection";
import Topbar from "@/components/landingComps/Topbar";



export default function Home() {
  return (
    <>
      <Topbar/>
      <HeroSection/>
      <Features/>
      <Footer/>
    </>
  );
}
