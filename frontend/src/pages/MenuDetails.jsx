import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import { AppContext } from "../context/AppContext";
import { formatMoney } from "../lib/ui";
import { ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";

const MenuDetails = () => {
  const { id } = useParams();
  const { user, navigate } = useContext(AppContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/menu/all");
        const found = (res.data?.menuItems || []).find((x) => x._id === id);
        setItem(found || null);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load item");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    setError("");
    try {
      const res = await api.post("/cart/add", { menuId: id, quantity });
      if (res.data?.success) {
        navigate("/cart");
      } else {
        setError(res.data?.message || "Failed to add to cart");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm mt-3">Loading delicacy details...</p>
      </div>
    );
  }

  if (error) return <div className="max-w-5xl mx-auto px-4 py-20 text-red-400 text-center font-medium">{error}</div>;
  if (!item) return <div className="max-w-5xl mx-auto px-4 py-20 text-gray-500 text-center font-medium">Item not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Back link */}
      <button
        onClick={() => navigate("/menu")}
        className="flex items-center gap-2 text-gray-400 hover:text-gold-500 transition-colors mb-8 text-sm uppercase tracking-wider font-semibold"
      >
        <ArrowLeft size={16} />
        Back to Menu
      </button>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left - Image */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-gold-500/20 to-transparent blur-md"></div>
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="relative w-full h-[460px] object-cover rounded-2xl border border-gold-900/10 shadow-2xl"
            />
          ) : (
            <div className="relative w-full h-[460px] bg-[#0F0F0F] rounded-2xl border border-gold-900/10 flex items-center justify-center">
              <span className="text-gray-600">No Image Available</span>
            </div>
          )}
        </div>

        {/* Right - Product Details */}
        <div className="bg-[#0B0B0B]/80 border border-gold-900/20 rounded-3xl p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-gold-500 font-serif tracking-widest text-xs uppercase block font-semibold">
              {item.category?.name || "Gourmet Specialty"}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-serif leading-tight">
              {item.name}
            </h1>
          </div>

          <div className="text-gold-500 font-bold font-serif text-3xl">
            {formatMoney(item.price)}
          </div>

          <p className="text-gray-400 text-sm leading-relaxed border-t border-b border-gold-900/10 py-6">
            {item.description}
          </p>

          {/* Quantity Controls */}
          {item.isAvailable && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm font-medium">Quantity</span>
              <div className="flex items-center gap-4 bg-[#050505] border border-gold-900/30 rounded-full px-4 py-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-gray-400 hover:text-gold-500 transition-colors p-1"
                >
                  <Minus size={16} />
                </button>
                <div className="text-white font-bold text-sm w-8 text-center">{quantity}</div>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-gray-400 hover:text-gold-500 transition-colors p-1"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          {error && <div className="text-red-400 text-sm font-medium">{error}</div>}

          <button
            onClick={addToCart}
            disabled={adding || !item.isAvailable}
            className="w-full h-14 rounded-full bg-gold-500 hover:bg-gold-600 text-black font-bold transition-all shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} />
            {adding ? "Adding..." : item.isAvailable ? "Add to Order" : "Currently Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuDetails;
