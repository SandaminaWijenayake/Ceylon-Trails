import { Link } from "react-router-dom";
import authpageImg from "@/assets/authpage1.jpg";
import type { InputHTMLAttributes, ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img
          src={authpageImg}
          alt="Sri Lanka"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/65" />
        <div className="relative flex items-end h-full p-14">
          <div>
            <Link
              to="/"
              className="font-display text-xl font-bold text-primary-foreground mb-5 block tracking-tight"
            >
              Ceylon<span className="text-accent">Trails</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm max-w-sm text-pretty leading-relaxed">
              Discover ancient temples, pristine beaches, and vibrant culture
              across the island paradise.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-10 bg-background">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="lg:hidden font-display text-xl font-bold text-foreground mb-10 block tracking-tight"
          >
            Ceylon<span className="text-accent">Trails</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm mt-3 mb-10 leading-relaxed">
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Field({ label, ...props }: FieldProps) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground mb-2 block uppercase tracking-wider">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-muted/60 border border-border/40 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/30 transition-all"
      />
    </div>
  );
}
