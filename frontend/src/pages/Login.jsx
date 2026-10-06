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

        // Clear previous error when user starts typing
        if (error) {
            setError("");
        }
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

            // Login successful
            navigate("/dashboard");

        } catch (error) {

            console.log("LOGIN ERROR:", error);
            console.log(
                "STATUS:",
                error.response?.status
            );
            console.log(
                "DATA:",
                error.response?.data
            );

            // 400 - Bad Request
            if (error.response?.status === 400) {
                setError(
                    error.response?.data?.detail ||
                    "Invalid email or password."
                );

            // 401 - Unauthorized
            } else if (error.response?.status === 401) {
                setError(
                    "Invalid email or password."
                );

            // 403 - Forbidden
            } else if (error.response?.status === 403) {
                setError(
                    "You do not have permission to login."
                );

            // 500+ - Server Error
            } else if (error.response?.status >= 500) {
                setError(
                    "Server error. Please try again later."
                );

            // Network Error
            } else if (!error.response) {
                setError(
                    "Cannot connect to server. Please check your connection."
                );

            // Other errors
            } else {
                setError(
                    "Login failed. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                padding: "40px",
            }}
        >

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

                {/* Error Message */}
                {error && (
                    <div
                        style={{
                            color: "red",
                            backgroundColor: "#ffe6e6",
                            border: "1px solid red",
                            padding: "10px",
                            marginBottom: "15px",
                            borderRadius: "5px",
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Login Button */}
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