import ConnectSection from "./components/ConnectSection";
import FeaturesSection from "./components/FeatureSection";
import Hero from "./components/Hero";
import LeadForm from "./components/LeadForm";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
    <Navbar />
    <Hero />
    <FeaturesSection />
    <LeadForm />
    <ConnectSection />
    </>
  );
}
