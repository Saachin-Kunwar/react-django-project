
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Package,
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    LoaderCircle,
    AlertCircle,
    ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError("");

        const email = formData.email.trim();

        if (!email || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);

        try {
            await login(email, formData.password);

            navigate("/dashboard", { replace: true });
        } catch (err) {
            const status = err.response?.status;
            const data = err.response?.data;

            if (!err.response) {
                setError(
                    "Unable to connect to the server. Check that Django is running."
                );
            } else if (status === 400 || status === 401) {
                setError("Invalid email or password. Please try again.");
            } else if (status === 403) {
                setError(
                    data?.detail ||
                    "Access denied. Please check your account."
                );
            } else if (status >= 500) {
                setError("Server error. Please try again shortly.");
            } else {
                setError(
                    data?.detail ||
                    "Login failed. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-950/50">
                        <Package size={29} />
                    </div>

                    <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Sign in to continue to ProductHub
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Email address
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={inputClass}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-slate-300"
                                >
                                    Password
                                </label>
                            </div>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className={`${inputClass} pr-12`}
                                    required
                                    disabled={loading}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                aria-live="polite"
                                className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-300"
                            >
                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 border-t border-slate-800 pt-6 text-center">
                        <p className="text-sm text-slate-400">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-indigo-400 hover:text-indigo-300"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-600">
                    ProductHub · Inventory management made simple
                </p>
            </div>
        </main>
    );
}

export default Login;