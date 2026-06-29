import React, { useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { AppContext } from "../context/AppContext";
import { formatMoney } from "../lib/ui";
import { ArrowLeft, ShoppingBag } from "lucide-react";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { user, navigate } = useContext(AppContext);
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await api.get("/cart/get");
        setCart(res.data?.cart || null);
      } catch {
        setCart(null);
      }
    };
    loadCart();
  }, []);

  const totalAmount = useMemo(() => {
    const items = cart?.items || [];
    return items.reduce((sum, it) => sum + (it.menuItem?.price || 0) * (it.quantity || 0), 0);
  }, [cart]);

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!address.trim()) {
        setError("Delivery address is required");
        setLoading(false);
        return;
      }

      if (paymentMethod === "Razorpay") {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          setError("Failed to load Razorpay SDK. Please check your internet connection.");
          setLoading(false);
          return;
        }

        let keyRes;
        try {
          keyRes = await api.get("/order/razorpay-key");
        } catch (err) {
          setError("Failed to fetch Razorpay configuration. Please try again.");
          setLoading(false);
          return;
        }
        const keyId = keyRes.data?.key;

        let orderRes;
        try {
          orderRes = await api.post("/order/create-razorpay-order");
        } catch (err) {
          setError(err?.response?.data?.message || "Failed to create order. Please try again.");
          setLoading(false);
          return;
        }

        if (!orderRes.data?.success || !orderRes.data?.order) {
          setError(orderRes.data?.message || "Failed to create order. Please try again.");
          setLoading(false);
          return;
        }

        const rzpOrder = orderRes.data.order;

        const options = {
          key: keyId,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: "Gourmet Restaurant",
          description: "Order Payment",
          order_id: rzpOrder.id,
          handler: async function (response) {
            setLoading(true);
            try {
              const verifyRes = await api.post("/order/verify-razorpay-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                address,
              });
              if (verifyRes.data?.success) {
                navigate("/my-orders");
              } else {
                setError(verifyRes.data?.message || "Payment verification failed");
              }
            } catch (verifyErr) {
              setError(verifyErr?.response?.data?.message || "Payment verification failed");
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: {
            color: "#D4AF37",
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const res = await api.post("/order/place", { address, paymentMethod });
        if (res.data?.success) {
          navigate("/my-orders");
        } else {
          setError(res.data?.message || "Failed to place order");
          setLoading(false);
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to place order");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Back button */}
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center gap-2 text-gray-400 hover:text-gold-500 transition-colors mb-8 text-sm uppercase tracking-wider font-semibold"
      >
        <ArrowLeft size={16} />
        Back to Cart
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-white font-serif mb-2">Checkout</h1>
      <p className="text-gray-500 text-sm mb-8">Confirm your delivery details and order summary.</p>

      {!user && (
        <div className="bg-gold-500/5 border border-gold-500/20 text-gray-200 rounded-3xl p-6 mb-8 text-center">
          Login is required to place your order.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left - Delivery form */}
        <div className="bg-[#0B0B0B]/80 border border-gold-900/20 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white font-serif border-b border-gold-900/10 pb-4">
            Delivery Details
          </h2>
          <form onSubmit={placeOrder} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block mb-2">
                Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#050505] border border-gold-900/30 rounded-2xl p-4 text-white outline-none focus:border-gold-500 transition-colors text-sm"
                rows={4}
                placeholder="Flat/House No, Building, Street Name, City, Pincode"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-[#050505] border border-gold-900/30 rounded-2xl p-4 text-white outline-none focus:border-gold-500 transition-colors text-sm"
              >
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="Razorpay">Pay Online (Razorpay)</option>
              </select>
            </div>

            {error && <div className="text-red-400 text-sm font-medium pt-2">{error}</div>}

            <button
              type="submit"
              disabled={loading || !cart || (cart.items?.length || 0) === 0}
              className="w-full h-14 rounded-full bg-gold-500 hover:bg-gold-600 text-black font-bold transition-all shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)] disabled:opacity-40"
            >
              {loading ? "Processing..." : `Place Order • ${formatMoney(totalAmount)}`}
            </button>
          </form>
        </div>

        {/* Right - Order summary */}
        <div className="bg-[#0B0B0B]/80 border border-gold-900/20 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white font-serif border-b border-gold-900/10 pb-4">
            Order Summary
          </h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {!cart || (cart.items?.length || 0) === 0 ? (
              <div className="text-gray-500 text-sm">Your cart is empty.</div>
            ) : (
              cart.items.map((it) => (
                <div key={it.menuItem?._id} className="flex gap-4 items-center justify-between">
                  <div className="flex gap-3 items-center">
                    {it.menuItem?.image && (
                      <img
                        src={it.menuItem.image}
                        alt={it.menuItem.name}
                        className="w-12 h-12 object-cover rounded-xl border border-gold-900/10 shrink-0"
                      />
                    )}
                    <div>
                      <div className="text-white font-semibold text-sm">{it.menuItem?.name}</div>
                      <div className="text-gray-500 text-xs">
                        {it.quantity} × {formatMoney(it.menuItem?.price || 0)}
                      </div>
                    </div>
                  </div>
                  <div className="text-white font-serif font-bold text-sm">
                    {formatMoney((it.menuItem?.price || 0) * (it.quantity || 0))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gold-900/10 pt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-white font-semibold">{formatMoney(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery charges</span>
              <span className="text-gold-500">Free</span>
            </div>
            <div className="border-t border-gold-900/10 my-2 pt-4 flex items-center justify-between">
              <span className="text-gray-300 font-bold">Total Amount</span>
              <span className="text-gold-500 font-serif font-bold text-xl">
                {formatMoney(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
