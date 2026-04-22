import { Star, Shield, Headphones, Clock } from "lucide-react";
import { RevealSection } from "./RevealSection";

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

export default function WhySection() {
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