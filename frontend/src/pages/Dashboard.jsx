import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductForm from "../components/ProductForm";
import { useAuth } from "../context/AuthContext";
import {
    getProducts,
    deleteProduct,
} from "../api/productApi";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Product currently being edited
    const [productToEdit, setProductToEdit] =
        useState(null);

    // Product currently being deleted
    const [deletingProductId, setDeletingProductId] =
        useState(null);

    // Create Product
    const handleProductCreated = (product) => {
        setProducts((currentProducts) => [
            product,
            ...currentProducts,
        ]);
    };

    // Update Product
    const handleProductUpdated = (
        updatedProduct
    ) => {
        setProducts((currentProducts) =>
            currentProducts.map((product) =>
                product.id === updatedProduct.id
                    ? updatedProduct
                    : product
            )
        );

        setProductToEdit(null);
    };

    // Delete Product
    const handleDeleteProduct = async (product) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            setDeletingProductId(product.id);

            await deleteProduct(product.id);

            // Remove deleted product from UI
            setProducts((currentProducts) =>
                currentProducts.filter(
                    (currentProduct) =>
                        currentProduct.id !==
                        product.id
                )
            );
        } catch (error) {
            console.error(
                "DELETE PRODUCT ERROR:",
                error
            );

            setError(
                error.response?.data?.detail ||
                error.response?.data?.details ||
                `Failed to delete product. Status: ${
                    error.response?.status ||
                    "Unknown"
                }`
            );
        } finally {
            setDeletingProductId(null);
        }
    };

    // Load Products
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setError("");

                const data = await getProducts();

                setProducts(data);
            } catch (error) {
                console.error(
                    "PRODUCT API ERROR:",
                    error
                );

                setError(
                    error.response?.data?.details ||
                    `Failed to load products. Status: ${
                        error.response?.status ||
                        "Unknown"
                    }`
                );
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    // Logout
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

            {/* Add / Edit Product */}
            <ProductForm
                productToEdit={productToEdit}
                onProductCreated={
                    handleProductCreated
                }
                onProductUpdated={
                    handleProductUpdated
                }
                onCancelEdit={() => {
                    setProductToEdit(null);
                }}
            />

            <hr />

            <h2>My Products</h2>

            {/* Error */}
            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {/* Loading */}
            {loading && (
                <p>Loading products...</p>
            )}

            {/* Empty State */}
            {!loading &&
                !error &&
                products.length === 0 && (
                    <p>
                        You don't have any
                        products yet.
                    </p>
                )}

            {/* Product List */}
            {!loading &&
                !error &&
                products.length > 0 && (
                    <div>
                        {products.map(
                            (product) => (
                                <div
                                    key={
                                        product.id
                                    }
                                    style={{
                                        border:
                                            "1px solid #ccc",
                                        padding:
                                            "15px",
                                        marginBottom:
                                            "10px",
                                        borderRadius:
                                            "8px",
                                    }}
                                >
                                    <h3>
                                        {
                                            product.name
                                        }
                                    </h3>

                                    <p>
                                        {
                                            product.description
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Price:
                                        </strong>{" "}
                                        Rs.{" "}
                                        {
                                            product.price
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Stock:
                                        </strong>{" "}
                                        {
                                            product.stock
                                        }
                                    </p>

                                    {/* Edit Button */}
                                    <button
                                        onClick={() => {
                                            setProductToEdit(
                                                product
                                            );
                                        }}
                                    >
                                        Edit
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() =>
                                            handleDeleteProduct(
                                                product
                                            )
                                        }
                                        disabled={
                                            deletingProductId ===
                                            product.id
                                        }
                                        style={{
                                            marginLeft:
                                                "10px",
                                        }}
                                    >
                                        {deletingProductId ===
                                        product.id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                )}
        </div>
    );
}

export default Dashboard;