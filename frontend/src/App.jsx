import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";


function AuthLogoutListener() {
    const { logout } = useAuth();

    useEffect(() => {
        const handleAuthLogout = () => {
            console.log(
                "Authentication expired. Logging out..."
            );

            logout();
        };

        window.addEventListener(
            "auth:logout",
            handleAuthLogout
        );

        return () => {
            window.removeEventListener(
                "auth:logout",
                handleAuthLogout
            );
        };
    }, [logout]);

    return null;
}


function Dashboard() {
    const {
        user,
        loading,
        isAuthenticated,
        logout,
    } = useAuth();

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return (
        <div style={{ padding: "40px" }}>
            <h1>
                ProductHub Dashboard
            </h1>

            <h2>
                Welcome, {user.username}
            </h2>

            <p>
                Email: {user.email}
            </p>

            <button onClick={logout}>
                Logout
            </button>
        </div>
    );
}


function App() {
    return (
        <>
            <AuthLogoutListener />

            <Routes>

                {/* Home */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Protected Dashboard */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

            </Routes>
        </>
    );
}

export default App;