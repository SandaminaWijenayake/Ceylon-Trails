import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

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

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE}/contact`, formData);
      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Failed to send",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@ceylontrails.lk",
      href: "mailto:sandaminawijenayake0717@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+94 77 123 4567",
      href: "tel:+94771234567",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Colombo, Sri Lanka",
      href: "#",
    },
  ];

  const subjects = [
    "General Inquiry",
    "Booking Question",
    "Custom Tour Request",
    "Feedback",
    "Partnership",
    "Other",
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <div className="pt-32 pb-20 bg-muted/30">
        <div className="container-travel">
          <RevealSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
                Get in Touch
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance">
                Contact Us
              </h1>
              <p className="mt-4 text-muted-foreground text-lg text-pretty leading-relaxed">
                Have questions about your Sri Lanka adventure? We'd love to hear
                from you. Our team is ready to help.
              </p>
            </div>
          </RevealSection>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <RevealSection className="lg:col-span-2" delay={100}>
              <div className="bg-card border border-border/60 rounded-2xl  px-5 py-8 sm:px-8  h-full">
                <h3 className="font-display font-semibold text-xl text-foreground mb-8">
                  Let's Connect
                </h3>

                <div className="space-y-6">
                  {contactInfo.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                        <item.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-foreground font-medium group-hover:text-accent transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-border/60">
                  <h4 className="font-display font-semibold text-foreground mb-4">
                    Office Hours
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p>Saturday: 9:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-border/60">
                  <h4 className="font-display font-semibold text-foreground mb-4">
                    Follow Us
                  </h4>
                  <div className="flex gap-1">
                    {["Facebook", "Instagram", "Twitter"].map((social) => (
                      <button
                        key={social}
                        className="px-2 sm:px-4 py-2 rounded-full bg-muted/50 text-sm text-muted-foreground hover:bg-accent/10 hover:text-accent transition-colors"
                      >
                        {social}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </RevealSection>

            <RevealSection className="lg:col-span-3" delay={200}>
              <div className="bg-card border border-border/60 rounded-2xl p-8 lg:p-10">
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  Send us a Message
                </h3>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we'll respond within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-foreground"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-foreground"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border/60 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                    >
                      <option value="">Select a subject</option>
                      {subjects.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-foreground"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us about your trip..."
                      className="w-full px-4 py-3 rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="lg"
                    className="w-full gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </RevealSection>
          </div>

          <RevealSection delay={300}>
            <div className="mt-20 rounded-2xl overflow-hidden h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.8151251542!2d79.8562055!3d6.92183865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo!5e0!3m2!1sen!2slk!4v1776880465799!5m2!1sen!2slk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location map"
              />
            </div>
          </RevealSection>
        </div>
      </div>
      <Footer />
    </div>
  );
}
