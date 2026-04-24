import { RevealSection } from "./RevealSection";
import introImg1 from "@/assets/image1.webp";
import introImg3 from "@/assets/image3.webp";
import introImg4 from "@/assets/image4.webp";

export default function IntroSection() {
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
