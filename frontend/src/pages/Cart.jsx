import React, { useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { AppContext } from "../context/AppContext";
import { formatMoney } from "../lib/ui";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";

const Cart = () => {
  const { user, navigate } = useContext(AppContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCart = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/cart/get");
      setCart(res.data?.cart || { items: [] });
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const totalAmount = useMemo(() => {
    const items = cart?.items || [];
    return items.reduce((sum, it) => sum + (it.menuItem?.price || 0) * (it.quantity || 0), 0);
  }, [cart]);

  const updateQty = async (menuItemId, delta) => {
    const item = (cart?.items || []).find((x) => x.menuItem?._id === menuItemId);
    if (!item) return;
    const nextQty = Math.max(1, (item.quantity || 0) + delta);

    setError("");
    try {
      if (delta > 0) {
        await api.post("/cart/add", { menuId: menuItemId, quantity: delta });
      } else {
        await api.delete(`/cart/remove/${menuItemId}`);
        await api.post("/cart/add", { menuId: menuItemId, quantity: nextQty });
      }
      await loadCart();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update cart");
    }
  };

  const removeItem = async (menuItemId) => {
    setError("");
    try {
      await api.delete(`/cart/remove/${menuItemId}`);
      await loadCart();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to remove");
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gold-500/5 border border-gold-500/20 text-gray-200 rounded-3xl p-8 text-center space-y-4">
          <p className="text-lg">Authentication is required to view your cart.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gold-500 text-black px-8 py-3 rounded-full font-bold hover:bg-gold-600 transition-all shadow-[0_4px_15px_rgba(212,175,55,0.25)]"
          >
            Login to Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-10">
        <ShoppingBag className="text-gold-500" size={28} />
        <h1 className="text-3xl md:text-4xl font-bold text-white font-serif">Your Cart</h1>
      </div>

      {error && <div className="mt-4 text-red-400 text-sm font-medium">{error}</div>}

      {loading && !cart ? (
        <div className="mt-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="mt-6 grid lg:grid-cols-3 gap-8">
          
          {/* Cart items list */}
          <div className="lg:col-span-2 space-y-4">
            {(cart?.items || []).length === 0 ? (
              <div className="bg-[#0B0B0B]/85 border border-gold-900/10 rounded-3xl p-8 text-center space-y-4">
                <p className="text-gray-500 text-sm">Your order cart is empty.</p>
                <Link
                  to="/menu"
                  className="inline-block text-gold-500 border border-gold-500/30 hover:border-gold-500 px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              cart.items.map((it) => (
                <div
                  key={it.menuItem?._id}
                  className="bg-[#0B0B0B]/60 border border-gold-900/10 rounded-3xl p-5 flex flex-col sm:flex-row gap-4 items-center justify-between hover:border-gold-500/10 transition-colors"
                >
                  <div className="flex gap-4 items-center w-full sm:w-auto">
                    {it.menuItem?.image && (
                      <img
                        src={it.menuItem.image}
                        alt={it.menuItem.name}
                        className="w-20 h-20 object-cover rounded-2xl border border-gold-900/10 shrink-0"
                      />
                    )}
                    <div className="space-y-1">
                      <h3 className="text-white font-bold font-serif text-lg">{it.menuItem?.name}</h3>
                      <div className="text-gold-500 font-serif text-sm font-medium">
                        {formatMoney(it.menuItem?.price || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between sm:justify-end w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-gold-900/10">
                    {/* Qty selectors */}
                    <div className="flex items-center gap-3 bg-[#050505] border border-gold-900/20 rounded-full px-3 py-1.5">
                      <button
                        onClick={() => updateQty(it.menuItem._id, -1)}
                        className="text-gray-400 hover:text-gold-500 p-0.5"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-bold text-xs w-6 text-center">{it.quantity}</span>
                      <button
                        onClick={() => updateQty(it.menuItem._id, 1)}
                        className="text-gray-400 hover:text-gold-500 p-0.5"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-white font-serif font-bold text-lg w-24 text-right">
                      {formatMoney((it.menuItem?.price || 0) * (it.quantity || 0))}
                    </div>

                    <button
                      onClick={() => removeItem(it.menuItem._id)}
                      className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/5 rounded-full transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary Box */}
          <div className="lg:col-span-1">
            <div className="bg-[#0B0B0B]/90 border border-gold-900/25 rounded-3xl p-6 space-y-6 shadow-xl sticky top-28">
              <h2 className="text-xl font-bold text-white font-serif tracking-wide border-b border-gold-900/10 pb-4">
                Bill Summary
              </h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-white font-semibold">{formatMoney(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Taxes & Fees</span>
                  <span className="text-gold-500">Complimentary</span>
                </div>
                <div className="border-t border-gold-900/10 my-2 pt-4 flex items-center justify-between">
                  <span className="text-gray-300 font-bold">Total Amount</span>
                  <span className="text-gold-500 font-serif font-bold text-2xl">
                    {formatMoney(totalAmount)}
                  </span>
                </div>
              </div>

              <button
                disabled={(cart?.items || []).length === 0}
                onClick={() => navigate("/checkout")}
                className="w-full h-14 rounded-full bg-gold-500 hover:bg-gold-600 text-black font-bold transition-all shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
