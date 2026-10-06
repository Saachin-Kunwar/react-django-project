import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { useAuth } from "../context/AuthContext";
import { getProducts } from "../api/productApi";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleProductCreated = (product) => {
        setProducts((currentProducts) => [product, ...currentProducts]);
    };

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setError("");

                const data = await getProducts();

                setProducts(data);
            } catch (error) {
                console.error("PRODUCT API ERROR:", error);

                setError(
                    error.response?.data?.details ||
                    `Failed to load products. Status: ${
                        error.response?.status || "Unknown"
                    }`
                );
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            console.error(
                "Logout failed:",
                error
            );
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

            <hr />

            <ProductForm onProductCreated={handleProductCreated} />

            <h2>My Products</h2>

            {loading && (
                <p>Loading products...</p>
            )}

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {!loading &&
                !error &&
                products.length === 0 && (
                    <p>
                        You don't have any products yet.
                    </p>
                )}

            {!loading &&
                products.length > 0 && (
                    <div>
                        {products.map((product) => (
                            <div
                                key={product.id}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "15px",
                                    marginBottom: "10px",
                                }}
                            >
                                <h3>
                                    {product.name}
                                </h3>

                                <p>
                                    {product.description}
                                </p>

                                <p>
                                    Price: Rs.{" "}
                                    {product.price}
                                </p>

                                <p>
                                    Stock:{" "}
                                    {product.stock}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
        </div>
    );
}

export default Dashboard;