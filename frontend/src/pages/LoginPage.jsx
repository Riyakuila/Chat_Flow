import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Loader, LogIn } from "lucide-react";

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center ">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-3">
            Welcome Back
          </h1>
          <p className="text-base-content/70 text-lg">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-control w-full">
                <label className="label pb-1">
                  <span className="label-text text-base font-medium">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full h-12 text-base"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label pb-1">
                  <span className="label-text text-base font-medium">Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full h-12 text-base"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <label className="label pt-1.5">
                  <Link
                    to="/forgot-password"
                    className="label-text-alt link link-hover text-sm"
                  >
                    Forgot password?
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="btn w-full h-12 min-h-0 border-0 bg-gradient-to-r from-purple-600 to-purple-800
                text-white hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-md"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </div>
                )}
              </button>
            </form>

            <div className="divider my-6">OR</div>

            <div className="text-center">
              <p className="text-base-content/70 text-base">
                Don't have an account?{" "}
                <Link to="/signup" className="link link-primary font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-base-content/70">
          <p>
            By logging in, you agree to our{" "}
            <Link to="/terms" className="link link-hover">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="link link-hover">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
