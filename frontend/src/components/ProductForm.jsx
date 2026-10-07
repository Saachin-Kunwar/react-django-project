import { useEffect, useState } from "react";

import {
    createProduct,
    updateProduct,
} from "../api/productApi";


function ProductForm({
    productToEdit,
    onProductCreated,
    onProductUpdated,
    onCancelEdit,
}) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Fill form when editing
    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name || "",
                description:
                    productToEdit.description || "",
                price: productToEdit.price || "",
                stock: productToEdit.stock ?? "",
            });
        } else {
            setFormData({
                name: "",
                description: "",
                price: "",
                stock: "",
            });
        }

        setError("");
    }, [productToEdit]);


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
            const productData = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                stock: formData.stock,
            };


            // EDIT
            if (productToEdit) {
                const updatedProduct =
                    await updateProduct(
                        productToEdit.id,
                        productData
                    );

                onProductUpdated(
                    updatedProduct
                );

                return;
            }


            // CREATE
            const newProduct =
                await createProduct(
                    productData
                );

            setFormData({
                name: "",
                description: "",
                price: "",
                stock: "",
            });

            onProductCreated(
                newProduct
            );

        } catch (error) {
            console.error(
                "Product save error:",
                error
            );

            const data =
                error.response?.data;

            if (data) {
                setError(
                    JSON.stringify(data)
                );
            } else {
                setError(
                    "Failed to save product."
                );
            }
        } finally {
            setLoading(false);
        }
    };


    const handleCancel = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
        });

        setError("");

        onCancelEdit();
    };


    return (
        <div
            style={{
                marginBottom: "30px",
            }}
        >

            <h2>
                {productToEdit
                    ? "Edit Product"
                    : "Add Product"}
            </h2>


            <form
                onSubmit={handleSubmit}
            >

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
                        value={
                            formData.description
                        }
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
                    <p
                        style={{
                            color: "red",
                        }}
                    >
                        {error}
                    </p>
                )}


                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : productToEdit
                        ? "Update Product"
                        : "Add Product"}
                </button>


                {productToEdit && (
                    <button
                        type="button"
                        onClick={
                            handleCancel
                        }
                        style={{
                            marginLeft: "10px",
                        }}
                    >
                        Cancel
                    </button>
                )}

            </form>

        </div>
    );
}


export default ProductForm;