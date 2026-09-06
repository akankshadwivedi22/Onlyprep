import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import HowItWorks from "./sections/HowItWorks";
import TopicRequest from "./sections/TopicRequest";
import FaqSection from "./sections/FaqSection";
import Footer from "./components/Footer";
import ProductionSection from "./sections/ProductionSection";

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      <main>
        <Hero />

        <HowItWorks />

        <ProductionSection />

        <TopicRequest />

        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;