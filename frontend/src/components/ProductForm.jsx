import { useState } from "react";
import { createProduct } from "../api/productApi";

function ProductForm({ onProductCreated }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const product = await createProduct({
                name: formData.name,
                description: formData.description,
                price: formData.price,
                stock: formData.stock,
            });

            setFormData({
                name: "",
                description: "",
                price: "",
                stock: "",
            });

            onProductCreated(product);

        } catch (error) {
            console.error(
                "Create product error:",
                error
            );

            const data = error.response?.data;

            if (data) {
                setError(
                    JSON.stringify(data)
                );
            } else {
                setError(
                    "Failed to create product."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: "30px" }}>
            <h2>Add Product</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>
                        Product Name
                    </label>
                    <br />

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>
                        Description
                    </label>
                    <br />

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter product description"
                    />
                </div>

                <br />

                <div>
                    <label>
                        Price
                    </label>
                    <br />

                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>
                        Stock
                    </label>
                    <br />

                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="Enter stock"
                        min="0"
                        required
                    />
                </div>

                <br />

                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Add Product"}
                </button>

            </form>
        </div>
    );
}

export default ProductForm;