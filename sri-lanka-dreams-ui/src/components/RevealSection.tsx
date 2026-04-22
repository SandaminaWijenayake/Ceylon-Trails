import { useScrollReveal } from "@/hooks/use-scroll-reveal";

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