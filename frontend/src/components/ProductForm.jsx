import { useEffect, useState } from "react";
import { PackagePlus, Save, X, AlertCircle } from "lucide-react";
import { createProduct, updateProduct } from "../api/productApi";

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

    useEffect(() => {
        setFormData(
            productToEdit
                ? {
                    name: productToEdit.name || "",
                    description: productToEdit.description || "",
                    price: productToEdit.price ?? "",
                    stock: productToEdit.stock ?? "",
                }
                : { name: "", description: "", price: "", stock: "" }
        );
        setError("");
    }, [productToEdit]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
            };

            if (productToEdit) {
                const updated = await updateProduct(productToEdit.id, data);
                onProductUpdated(updated);
            } else {
                const created = await createProduct(data);
                setFormData({
                    name: "",
                    description: "",
                    price: "",
                    stock: "",
                });
                onProductCreated(created);
            }
        } catch (err) {
            const details = err.response?.data;
            setError(
                details
                    ? Object.entries(details)
                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
                        .join(" | ")
                    : "Unable to save the product. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const fieldClass =
        "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

    return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                    {productToEdit ? <Save size={21} /> : <PackagePlus size={21} />}
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        {productToEdit ? "Edit product" : "Add a product"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                        {productToEdit
                            ? "Update your product information."
                            : "Add an item to your inventory."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="text-sm font-medium text-slate-300">
                        Product name
                    </label>
                    <input
                        className={fieldClass}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Wireless Headphones"
                        required
                        maxLength={200}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-300">
                        Description
                    </label>
                    <textarea
                        className={`${fieldClass} min-h-24 resize-y`}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your product..."
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium text-slate-300">
                            Price (Rs.)
                        </label>
                        <input
                            className={fieldClass}
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-300">
                            Stock quantity
                        </label>
                        <input
                            className={fieldClass}
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            min="0"
                            step="1"
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                        <AlertCircle size={18} className="shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save size={17} />
                        {loading
                            ? "Saving..."
                            : productToEdit
                                ? "Save changes"
                                : "Add product"}
                    </button>

                    {productToEdit && (
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    name: "",
                                    description: "",
                                    price: "",
                                    stock: "",
                                });
                                setError("");
                                onCancelEdit();
                            }}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                        >
                            <X size={17} />
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}

export default ProductForm;