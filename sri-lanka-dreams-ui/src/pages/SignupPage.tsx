import axios from "axios";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AuthLayout, Field } from "./AuthLayout";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export function SignupPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    signupEmail: "",
    signupPassword: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const signupHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE}/auth/register`, {
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.signupEmail,
        password: signupData.signupPassword,
      });

      toast({
        title: "Account created",
        description: "Please log in with your new credentials.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error?.response?.data?.message ?? error.message,
      });
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signupDataHandler = (e: ChangeEvent<HTMLInputElement>) => {
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
            required
          />
          <Field
            label="Last name"
            placeholder="Wijenayake"
            name="lastName"
            value={signupData.lastName}
            onChange={signupDataHandler}
            required
          />
        </div>
        <Field
          label="Email"
          type="email"
          placeholder="you@example.com"
          name="signupEmail"
          value={signupData.signupEmail}
          onChange={signupDataHandler}
          required
        />
        <Field
          label="Password"
          type="password"
          placeholder="Create a password"
          name="signupPassword"
          value={signupData.signupPassword}
          onChange={signupDataHandler}
          required
        />
        <label className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
          <input type="checkbox" className="accent-accent rounded mt-0.5" />I
          agree to the Terms of Service and Privacy Policy
        </label>
        <Button
          variant="accent"
          className="w-full"
          size="lg"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating account…" : "Create account"}
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
