import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-beach.jpg";

export function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [loginData, setLoginData] = useState({ loginEmail: "", password: "" });

  const loginDataHandler = (e) => {
    e.preventDefault();
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const loginFormHandler = (e) => {
    e.preventDefault();
    console.log(loginData);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage your bookings and wishlists."
    >
      <form className="space-y-6" onSubmit={loginFormHandler}>
        <Field
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={loginData.loginEmail}
          onChange={loginDataHandler}
          name="email"
        />
        <div className="relative">
          <Field
            label="Password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            value={loginData.password}
            onChange={loginDataHandler}
            name="password"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-4 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPw ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="accent-accent rounded" /> Remember
            me
          </label>
          <a href="#" className="text-accent hover:underline">
            Forgot password?
          </a>
        </div>
        <Button variant="accent" className="w-full" size="lg">
          Log in
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-accent font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export function SignupPage() {
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    signupEmail: "",
    signupPassword: "",
  });

  const signupHandler = (e) => {
    e.preventDefault();
    console.log(signupData);
  };
  const signupDataHandler = (e) => {
    e.preventDefault();
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of travellers exploring Sri Lanka."
    >
      <form className="space-y-6" onSubmit={signupHandler}>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="First name"
            placeholder="Sandamina"
            name="firstName"
            value={signupData.firstName}
            onChange={signupDataHandler}
          />
          <Field
            label="Last name"
            placeholder="Wijenayake"
            name="lastName"
            value={signupData.lastName}
            onChange={signupDataHandler}
          />
        </div>
        <Field
          label="Email"
          type="email"
          placeholder="you@example.com"
          name="signupEmail"
          value={signupData.signupEmail}
          onChange={signupDataHandler}
        />
        <Field
          label="Password"
          type="password"
          placeholder="Create a password"
          name="signupPassword"
          value={signupData.signupPassword}
          onChange={signupDataHandler}
        />
        <label className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
          <input type="checkbox" className="accent-accent rounded mt-0.5" />I
          agree to the Terms of Service and Privacy Policy
        </label>
        <Button variant="accent" className="w-full" size="lg">
          Create account
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-accent font-medium hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img
          src={heroImg}
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

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
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
