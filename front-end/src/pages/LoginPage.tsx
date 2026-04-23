import axios from "axios";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AuthLayout, Field } from "./AuthLayout";

import image from "@/assets/authpage1.jpg";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export function LoginPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ loginEmail: "", password: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginDataHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const loginFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: loginData.loginEmail,
        password: loginData.password,
      });

      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userName", `${user.firstName} ${user.lastName}`);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userId", user.id);

      toast({
        title: "Logged in successfully",
        description: "You are now signed in.",
      });

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.response?.data?.message ?? error.message,
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
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
          name="loginEmail"
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
        <Button
          variant="accent"
          className="w-full"
          size="lg"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing in…" : "Log in"}
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
