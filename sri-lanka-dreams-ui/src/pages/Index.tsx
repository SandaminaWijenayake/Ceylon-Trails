import {
  Search,
  Calendar,
  Users,
  Star,
  Shield,
  Headphones,
  Clock,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { destinations, tours, testimonials } from "@/data/travel-data";
import heroImg from "@/assets/hero-beach.jpg";

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
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <img
        src={heroImg}
        alt="Sri Lanka tropical beach"
        className="absolute inset-0 w-full h-full object-cover"
      />
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

          {/* <div className="mt-12 bg-card/95 backdrop-blur-xl rounded-lg p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)] animate-fade-up" style={{ animationDelay: "240ms" }}>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 bg-muted/60 rounded-md px-4 py-3.5">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <input placeholder="Where to?" className="bg-transparent text-sm w-full outline-none text-foreground placeholder:text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2 bg-muted/60 rounded-md px-4 py-3.5">
                <Calendar className="w-4 h-4 text-accent shrink-0" />
                <input placeholder="When?" className="bg-transparent text-sm w-full outline-none text-foreground placeholder:text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2 bg-muted/60 rounded-md px-4 py-3.5">
                <Users className="w-4 h-4 text-accent shrink-0" />
                <input placeholder="Guests" className="bg-transparent text-sm w-full outline-none text-foreground placeholder:text-muted-foreground" />
              </div>
              <Button variant="accent" className="rounded-md h-auto py-3.5">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}

function DestinationsSection() {
  return (
    <section className="py-28 bg-background">
      <div className="container-travel">
        <RevealSection>
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
            Destinations
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
            Explore Sri Lanka
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg text-pretty leading-relaxed">
            From misty mountains to golden shores — every corner tells a story
            worth discovering.
          </p>
        </RevealSection>

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-5 gap-5">
          {destinations.map((d, i) => (
            <RevealSection key={d.name} delay={i * 80}>
              <Link
                to="/tours"
                className="group relative block rounded-lg overflow-hidden aspect-[3/4]"
              >
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display font-semibold text-primary-foreground text-lg">
                    {d.name}
                  </h3>
                  <p className="text-primary-foreground/60 text-xs mt-1 tracking-wide">
                    {d.tourCount} experiences
                  </p>
                </div>
              </Link>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToursSection() {
  return (
    <section className="py-28 bg-muted/40">
      <div className="container-travel">
        <RevealSection>
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <p className="text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
                Curated Experiences
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
                Popular Tours
              </h2>
              <p className="mt-4 text-muted-foreground text-pretty leading-relaxed">
                Traveller-tested, locally guided — our most loved experiences.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/tours">View all tours →</Link>
            </Button>
          </div>
        </RevealSection>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {tours.slice(0, 4).map((t, i) => (
            <RevealSection key={t.id} delay={i * 80}>
              <TourCard tour={t} />
            </RevealSection>
          ))}
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
              <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-8">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed opacity-85 text-pretty italic">
                  "{t.text}"
                </p>
                <div className="mt-8 flex items-center gap-4">
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
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <DestinationsSection />
      <ToursSection />
      <WhySection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
