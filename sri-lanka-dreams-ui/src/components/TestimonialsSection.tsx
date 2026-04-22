import { Star } from "lucide-react";
import { RevealSection } from "./RevealSection";
import { testimonials } from "@/data/travel-data";

export default function TestimonialsSection() {
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