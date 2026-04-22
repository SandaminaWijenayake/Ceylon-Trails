import { Compass, Calendar, CheckCircle } from "lucide-react";
import { RevealSection } from "./RevealSection";

export default function HowItWorksSection() {
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