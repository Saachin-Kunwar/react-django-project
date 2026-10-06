import {
    Navigate,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>ProductHub Dashboard</h1>

            <h2>
                Welcome, {user.username}
            </h2>

            <p>
                Email: {user.email}
            </p>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

function App() {
    return (
        <Routes>

            {/* Public Routes */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* Protected Routes */}

            <Route element={<ProtectedRoute />}>

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

            </Route>

        </Routes>
    );
}

export default App;