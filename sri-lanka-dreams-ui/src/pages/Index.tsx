import {
  Star,
  Shield,
  Headphones,
  Clock,
  MapPin,
  Compass,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { testimonials } from "@/data/travel-data";
import heroImg1 from "@/assets/hero-image1.jpg";
import heroImg2 from "@/assets/hero-image2.webp";
import heroImg3 from "@/assets/hero-image3.jpg";
import introImg1 from "@/assets/image1.jpg";
import introImg3 from "@/assets/image3.jpg";
import introImg4 from "@/assets/image4.jpeg";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal(0.15);
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-[2px]"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = [heroImg1, heroImg2, heroImg3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {heroImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Sri Lanka ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-primary/65" />
      <div className="relative container-travel py-32">
        <div className="max-w-2xl">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-6 animate-fade-up">
            Sri Lanka — The Pearl of the Indian Ocean
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-primary-foreground leading-[1.08] text-balance animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            Extraordinary Journeys Through an Ancient Island
          </h1>
          <p
            className="mt-8 text-base text-primary-foreground/75 max-w-lg leading-relaxed text-pretty animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            Handcrafted itineraries through ancient temples, misty highlands,
            and sun-kissed coastlines. Your Sri Lanka adventure begins here.
          </p>
          <div
            className="flex gap-2 mt-10 animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-8 bg-accent"
                    : "w-4 bg-primary-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function IntroSection() {
  const introImages = [introImg1, introImg3, introImg4];

  return (
    <section className="py-28 bg-background">
      <div className="container-travel">
        <RevealSection className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
            The Pearl of the Indian Ocean
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
            Sri Lanka Awaits
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty leading-relaxed">
            From ancient kingdoms and sacred temples to pristine beaches and
            misty tea plantations, Sri Lanka is a land of endless wonder.
            Whether you seek adventure, culture, or serenity — this island has
            it all.
          </p>
        </RevealSection>

        <div className="grid md:grid-cols-3 gap-5">
          {introImages.map((img, i) => (
            <RevealSection
              key={i}
              delay={i * 100}
              className="group relative overflow-hidden rounded-xl aspect-[4/3]"
            >
              <img
                src={img}
                alt={`Sri Lanka ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToursSection() {
  const [apiTours, setApiTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get(`${API_BASE}/tours`);
        const activeTours = response.data.tours.filter(
          (t: any) => t.status === "active",
        );
        const topRated = activeTours
          .sort((a: any, b: any) => b.rating - a.rating)
          .slice(0, 4);
        setApiTours(topRated);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <section className="py-28 bg-muted/40">
      <div className="container-travel">
        <RevealSection className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
            Curated Experiences
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
            Popular Tours
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty leading-relaxed">
            Traveller-tested, locally guided — our most loved experiences.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {loading ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Loading tours...
            </div>
          ) : apiTours.length > 0 ? (
            apiTours.map((t, i) => (
              <RevealSection key={t._id} delay={i * 80}>
                <TourCard tour={t} />
              </RevealSection>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No tours available
            </div>
          )}
        </div>
        <div className="text-center mt-10">
          <Button variant="outline" asChild>
            <Link to="/tours">View all tours →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Shield,
    title: "Trusted & Verified",
    desc: "Every tour partner is vetted for safety and quality.",
  },
  {
    icon: Headphones,
    title: "24/7 Concierge",
    desc: "Our team is always available, wherever you are.",
  },
  {
    icon: Clock,
    title: "Flexible Booking",
    desc: "Free cancellation up to 48 hours before departure.",
  },
  {
    icon: Star,
    title: "Best Price Guarantee",
    desc: "Find it cheaper and we'll match the price.",
  },
];

function HowItWorksSection() {
  const steps = [
    {
      icon: Compass,
      title: "Choose Your Adventure",
      desc: "Browse our curated tours and pick the experience that speaks to you.",
    },
    {
      icon: Calendar,
      title: "Book With Ease",
      desc: "Select your dates and guests our team handles the rest.",
    },
    {
      icon: CheckCircle,
      title: "Travel Worry-Free",
      desc: "Enjoy your journey with 24/7 support and flexible cancellation.",
    },
  ];

  return (
    <section className="py-28 bg-muted/30">
      <div className="container-travel">
        <RevealSection className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
            Simple Process
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
            How It Works
          </h2>
        </RevealSection>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <RevealSection
              key={step.title}
              delay={i * 100}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-xs font-semibold text-accent uppercase tracking-widest mb-3">
                Step {i + 1}
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
                {step.desc}
              </p>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="py-28 bg-background">
      <div className="container-travel">
        <RevealSection>
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4 text-center">
            Why Us
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-center text-balance">
            The CeylonTrails Difference
          </h2>
        </RevealSection>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((f, i) => (
            <RevealSection key={f.title} delay={i * 80}>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <f.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-3">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-28 bg-primary text-primary-foreground">
      <div className="container-travel">
        <RevealSection>
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4 text-center">
            Testimonials
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-balance">
            What Travellers Say
          </h2>
        </RevealSection>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <RevealSection key={t.name} delay={i * 100}>
              <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-8 flex flex-col h-full">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed opacity-85 text-pretty italic">
                  "{t.text}"
                </p>
                <div className="mt-auto flex items-center pt-8 gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-sm font-semibold text-accent">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs opacity-50">{t.location}</p>
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <IntroSection />
      <ToursSection />
      <HowItWorksSection />
      <WhySection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
