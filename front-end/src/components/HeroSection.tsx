import { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import heroImg1 from "@/assets/hero-image1.webp";
import heroImg2 from "@/assets/hero-image2.webp";
import heroImg3 from "@/assets/hero-image3.webp";

export function RevealSection({
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

export default function HeroSection() {
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
