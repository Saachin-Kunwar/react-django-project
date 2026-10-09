import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-10 text-center shadow-2xl">
                <h1 className="text-4xl font-bold text-white">
                    ProductHub
                </h1>

                <p className="mt-4 text-slate-400">
                    Tailwind CSS is working!
                </p>

                <button className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500">
                    Let's Build
                </button>
            </div>
        </div>
    );
}

export default App;