import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle login
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(
                formData.email,
                formData.password
            );

            // Login successful → Dashboard
            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>ProductHub Login</h1>

            <form onSubmit={handleSubmit}>

                {/* Email */}
                <div>
                    <label htmlFor="email">
                        Email
                    </label>

                    <br />

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <br />

                {/* Password */}
                <div>
                    <label htmlFor="password">
                        Password
                    </label>

                    <br />

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <br />

                {/* Error message */}
                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                {/* Login button */}
                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Logging in..."
                        : "Login"}
                </button>

            </form>
        </div>
    );
}

export default Login;