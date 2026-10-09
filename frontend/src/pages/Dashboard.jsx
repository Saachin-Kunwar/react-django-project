
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Boxes,
    Wallet,
    Search,
    Plus,
    Pencil,
    Trash2,
    LogOut,
    CircleUserRound,
    ArrowUpRight,
    RefreshCw,
    X,
} from "lucide-react";

import ProductForm from "../components/ProductForm";
import { useAuth } from "../context/AuthContext";
import { getProducts, deleteProduct } from "../api/productApi";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [productToEdit, setProductToEdit] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const loadProducts = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getProducts();
            setProducts(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load products. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) return products;

        return products.filter((product) =>
            `${product.name || ""} ${product.description || ""}`
                .toLowerCase()
                .includes(query)
        );
    }, [products, searchTerm]);

    const totalStock = products.reduce(
        (total, product) => total + Number(product.stock || 0),
        0
    );

    const inventoryValue = products.reduce(
        (total, product) =>
            total + Number(product.price || 0) * Number(product.stock || 0),
        0
    );

    const handleCreated = (product) => {
        setProducts((current) => [product, ...current]);
        setShowForm(false);
    };

    const handleUpdated = (updatedProduct) => {
        setProducts((current) =>
            current.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );
        setProductToEdit(null);
        setShowForm(false);
    };

    const handleEdit = (product) => {
        setProductToEdit(product);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleAdd = () => {
        setProductToEdit(null);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
            return;
        }

        setDeletingId(product.id);
        setError("");

        try {
            await deleteProduct(product.id);
            setProducts((current) =>
                current.filter((item) => item.id !== product.id)
            );
            if (productToEdit?.id === product.id) {
                setProductToEdit(null);
                setShowForm(false);
            }
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to delete this product. Please try again."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate("/login", { replace: true });
        }
    };

    const initials = (user?.username || user?.email || "U")
        .slice(0, 1)
        .toUpperCase();

    const statCards = [
        {
            label: "Total products",
            value: products.length.toLocaleString(),
            detail: "Products in your inventory",
            icon: Package,
            iconStyle: "bg-indigo-500/10 text-indigo-400",
        },
        {
            label: "Total stock",
            value: totalStock.toLocaleString(),
            detail: "Units available",
            icon: Boxes,
            iconStyle: "bg-cyan-500/10 text-cyan-400",
        },
        {
            label: "Inventory value",
            value: `Rs. ${inventoryValue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
            })}`,
            detail: "Price × stock quantity",
            icon: Wallet,
            iconStyle: "bg-emerald-500/10 text-emerald-400",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-800 bg-slate-900/80 lg:flex">
                <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-950/50">
                        <Package size={22} />
                    </div>
                    <div>
                        <p className="text-lg font-bold tracking-tight text-white">
                            ProductHub
                        </p>
                        <p className="text-xs text-slate-500">
                            Inventory workspace
                        </p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Workspace
                    </p>
                    <div className="flex items-center gap-3 rounded-xl bg-indigo-500/10 px-3 py-3 text-sm font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20">
                        <LayoutDashboard size={19} />
                        Dashboard
                    </div>
                    <div className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400">
                        <Package size={19} />
                        My Products
                    </div>
                </nav>

                <div className="border-t border-slate-800 p-4">
                    <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-800/60 p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 font-bold text-indigo-300">
                            {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-white">
                                {user?.username || "User"}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                        <LogOut size={18} />
                        Sign out
                    </button>
                </div>
            </aside>

            <main className="min-h-screen lg:ml-64">
                <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
                    <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-8 lg:px-10">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 lg:hidden">
                                <Package size={21} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">
                                    Workspace / Overview
                                </p>
                                <h1 className="text-lg font-semibold text-white">
                                    Dashboard
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="hidden max-w-40 truncate text-sm text-slate-400 sm:block">
                                {user?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2.5 text-sm text-slate-300 transition hover:border-red-500/40 hover:text-red-300 lg:hidden"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                            <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 font-semibold text-indigo-300 sm:flex">
                                {initials}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:px-10">
                    <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="mb-2 text-sm font-medium text-indigo-400">
                                YOUR INVENTORY, SIMPLIFIED
                            </p>
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Welcome back, {user?.username || "there"}.
                            </h2>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                                Manage your products, monitor stock and keep your inventory organized.
                            </p>
                        </div>

                        <button
                            onClick={handleAdd}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:-translate-y-0.5 hover:bg-indigo-500"
                        >
                            <Plus size={18} />
                            Add product
                        </button>
                    </section>

                    {showForm && (
                        <section className="mb-8" id="product-form">
                            <ProductForm
                                productToEdit={productToEdit}
                                onProductCreated={handleCreated}
                                onProductUpdated={handleUpdated}
                                onCancelEdit={() => {
                                    setProductToEdit(null);
                                    setShowForm(false);
                                }}
                            />
                        </section>
                    )}

                    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {statCards.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-slate-700 hover:bg-slate-900"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-400">
                                                {stat.label}
                                            </p>
                                            <p className="mt-3 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className={`rounded-xl p-3 ${stat.iconStyle}`}>
                                            <Icon size={22} />
                                        </div>
                                    </div>
                                    <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                                        <ArrowUpRight size={15} />
                                        {stat.detail}
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    {error && (
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                            <p>{error}</p>
                            <button
                                onClick={loadProducts}
                                className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 hover:bg-red-500/10"
                            >
                                <RefreshCw size={15} />
                                Retry
                            </button>
                        </div>
                    )}

                    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
                        <div className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    My products
                                </h3>
                                <p className="mt-1 text-sm text-slate-400">
                                    {products.length} {products.length === 1 ? "product" : "products"} in your inventory
                                </p>
                            </div>

                            <div className="relative w-full sm:max-w-xs">
                                <Search
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-10 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        aria-label="Clear search"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                                <RefreshCw size={28} className="animate-spin text-indigo-400" />
                                <p className="mt-4 text-sm text-slate-400">
                                    Loading your products...
                                </p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="px-6 py-20 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                                    <Package size={30} />
                                </div>
                                <h4 className="mt-5 text-lg font-semibold text-white">
                                    Your inventory starts here
                                </h4>
                                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                                    Add your first product to start tracking stock and inventory value.
                                </p>
                                <button
                                    onClick={handleAdd}
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
                                >
                                    <Plus size={17} />
                                    Add your first product
                                </button>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <Search size={28} className="mx-auto text-slate-500" />
                                <h4 className="mt-4 font-semibold text-white">
                                    No matching products
                                </h4>
                                <p className="mt-2 text-sm text-slate-400">
                                    Try another search term.
                                </p>
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="mt-4 text-sm font-medium text-indigo-400 hover:text-indigo-300"
                                >
                                    Clear search
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-6">
                                {filteredProducts.map((product) => (
                                    <article
                                        key={product.id}
                                        className="group flex min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5 transition duration-200 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-black/10"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-500/10 bg-indigo-500/10 text-indigo-400">
                                                <Package size={23} />
                                            </div>
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                Number(product.stock) > 0
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : "bg-amber-500/10 text-amber-400"
                                            }`}>
                                                {Number(product.stock) > 0 ? "In stock" : "Out of stock"}
                                            </span>
                                        </div>

                                        <h4 className="mt-5 break-words text-base font-semibold text-white">
                                            {product.name}
                                        </h4>
                                        <p className="mt-2 min-h-10 break-words text-sm leading-5 text-slate-400">
                                            {product.description || "No description provided."}
                                        </p>

                                        <div className="my-5 grid grid-cols-2 gap-3 border-y border-slate-800 py-4">
                                            <div className="min-w-0">
                                                <p className="text-xs text-slate-500">Price</p>
                                                <p className="mt-1 break-words font-semibold text-white">
                                                    Rs. {Number(product.price || 0).toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-slate-500">Stock quantity</p>
                                                <p className="mt-1 font-semibold text-white">
                                                    {Number(product.stock || 0).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300"
                                            >
                                                <Pencil size={15} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product)}
                                                disabled={deletingId === product.id}
                                                aria-label={`Delete ${product.name}`}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                                            >
                                                <Trash2 size={15} />
                                                <span className="hidden sm:inline">
                                                    {deletingId === product.id ? "Deleting..." : "Delete"}
                                                </span>
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    <footer className="py-8 text-center text-xs text-slate-600">
                        ProductHub · Inventory management made simple
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;