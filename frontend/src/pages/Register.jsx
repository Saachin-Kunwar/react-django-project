
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Package,
    UserRound,
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    LoaderCircle,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import api from "../api/axios";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        setError("");
        setSuccess("");
    };

    const getApiError = (data) => {
        if (!data) {
            return "Registration failed. Please try again.";
        }

        const messages = [];

        for (const field of ["username", "email", "password"]) {
            const value = data[field];

            if (value) {
                const details = Array.isArray(value)
                    ? value.join(" ")
                    : String(value);

                messages.push(
                    `${field.charAt(0).toUpperCase() + field.slice(1)}: ${details}`
                );
            }
        }

        if (messages.length > 0) {
            return messages.join(" ");
        }

        if (data.detail) return data.detail;

        return "Registration failed. Please check your details.";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError("");
        setSuccess("");

        const username = formData.username.trim();
        const email = formData.email.trim();

        if (!username || !email || !formData.password) {
            setError("Please complete all required fields.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await api.post("/auth/register/", {
                username,
                email,
                password: formData.password,
            });

            setSuccess(
                "Account created successfully! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1200);
        } catch (err) {
            if (!err.response) {
                setError(
                    "Cannot connect to the server. Please check that Django is running."
                );
            } else if (err.response.status >= 500) {
                setError(
                    "A server error occurred. Please try again shortly."
                );
            } else {
                setError(getApiError(err.response.data));
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60";

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-950/50">
                        <Package size={29} />
                    </div>

                    <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">
                        Create your account
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Get started with your ProductHub workspace
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Username
                            </label>

                            <div className="relative">
                                <UserRound
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                    className={inputClass}
                                    required
                                    maxLength={150}
                                    disabled={loading}
                                />
                            </div>
                        </div>

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
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="At least 8 characters"
                                    className={inputClass}
                                    required
                                    minLength={8}
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
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Confirm password
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="new-password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Enter password again"
                                    className={inputClass}
                                    required
                                    disabled={loading}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (prev) => !prev
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                >
                                    {showConfirmPassword ? (
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

                        {success && (
                            <div
                                role="status"
                                aria-live="polite"
                                className="flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm text-emerald-300"
                            >
                                <CheckCircle2
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />
                                <p>{success}</p>
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
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 border-t border-slate-800 pt-6 text-center">
                        <p className="text-sm text-slate-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-indigo-400 hover:text-indigo-300"
                            >
                                Sign in
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

export default Register;