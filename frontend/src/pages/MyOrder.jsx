import React, { useContext, useEffect, useState } from "react";
import api from "../lib/api";
import { AppContext } from "../context/AppContext";
import { formatMoney } from "../lib/ui";
import { Receipt, Calendar, ArrowRight } from "lucide-react";

const MyOrder = () => {
  const { user, navigate } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/order/my-orders");
        setOrders(res.data?.orders || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gold-500/5 border border-gold-500/20 text-gray-200 rounded-3xl p-8 text-center space-y-4 max-w-2xl mx-auto">
          <p className="text-lg">Please sign in to view your orders.</p>
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white font-serif mb-2">My Orders</h1>
      <p className="text-gray-500 text-sm mb-8">Review your past culinary orders and current order status.</p>

      {error && <div className="mt-4 text-red-400 text-sm font-medium">{error}</div>}

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-[#0B0B0B]/80 border border-gold-900/10 rounded-3xl p-8 text-center text-gray-500 text-sm">
              No orders found. Enjoy our delicious menu items today!
            </div>
          ) : (
            orders.map((o) => (
              <div
                key={o._id}
                className="bg-[#0B0B0B]/60 border border-gold-900/15 rounded-3xl p-6 hover:border-gold-500/20 transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gold-900/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white font-bold font-serif text-lg">
                      <Receipt size={18} className="text-gold-500" />
                      Order ID: <span className="text-gray-300 font-mono text-sm">{o._id}</span>
                    </div>
                    <div className="text-gray-500 text-xs flex items-center gap-1.5">
                      <Calendar size={12} />
                      Ordered on: {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-block px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-[#050505] border border-gold-900/20 text-gold-500">
                      {o.status || "Placed"}
                    </span>
                    <div className="text-gold-500 font-serif font-bold text-xl">
                      {formatMoney(o.totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3 pt-2">
                  {(o.items || []).map((it, idx) => (
                    <div
                      key={it.menuItem?._id || idx}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <div className="text-gray-300 flex items-center gap-2">
                        <ArrowRight size={12} className="text-gold-900/50" />
                        <span className="font-medium text-white">{it.menuItem?.name || "Gourmet Dish"}</span>
                        <span className="text-gray-500 text-xs">× {it.quantity}</span>
                      </div>
                      <div className="text-gray-400 font-mono text-xs">
                        {formatMoney((it.menuItem?.price || 0) * (it.quantity || 0))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrder;
