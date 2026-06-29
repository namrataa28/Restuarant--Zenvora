import React, { useContext, useEffect, useState } from "react";
import api from "../lib/api";
import { AppContext } from "../context/AppContext";
import { formatMoney } from "../lib/ui";
import {
  LogOut,
  Calendar,
  ShoppingBag,
  PlusCircle,
  Trash2,
  Settings,
  TrendingUp,
  FolderOpen
} from "lucide-react";

const AdminDashboard = () => {
  const { admin, setAdmin, navigate } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("orders");

  // State lists
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);

  // Loaders
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // New Menu Item Form State
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  // Redirect if not admin
  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  // Load tab data
  useEffect(() => {
    if (!admin) return;

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        if (activeTab === "orders") {
          const res = await api.get("/order/orders");
          setOrders(res.data?.orders || []);
        } else if (activeTab === "bookings") {
          const res = await api.get("/booking/bookings");
          setBookings(res.data?.bookings || []);
        } else if (activeTab === "menu") {
          const [menuRes, catRes] = await Promise.all([
            api.get("/menu/all"),
            api.get("/category/all"),
          ]);
          setMenuItems(menuRes.data?.menuItems || []);
          setCategories(catRes.data?.categories || []);
          if (catRes.data?.categories?.length > 0) {
            setNewItem((p) => ({ ...p, category: catRes.data.categories[0]._id }));
          }
        }
      } catch (err) {
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, admin]);

  // Handle Order Status Update
  const handleOrderStatusUpdate = async (orderId, nextStatus) => {
    try {
      await api.put(`/order/update-status/${orderId}`, { status: nextStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: nextStatus } : o))
      );
    } catch {
      setError("Failed to update order status.");
    }
  };

  // Handle Booking Status Update
  const handleBookingStatusUpdate = async (bookingId, nextStatus) => {
    try {
      await api.put(`/booking/update-status/${bookingId}`, { status: nextStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: nextStatus } : b))
      );
    } catch {
      setError("Failed to update booking status.");
    }
  };

  // Handle Menu Item Delete
  const handleMenuDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await api.delete(`/menu/delete/${id}`);
      setMenuItems((prev) => prev.filter((item) => item._id !== id));
    } catch {
      setError("Failed to delete menu item.");
    }
  };

  // Handle Menu Item Form Changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewItem((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewItem((p) => ({ ...p, image: e.target.files[0] }));
  };

  // Add Menu Item Submit
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!newItem.image) {
      setError("Image file is required.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("description", newItem.description);
    formData.append("price", Number(newItem.price));
    formData.append("category", newItem.category);
    formData.append("image", newItem.image);

    try {
      const res = await api.post("/menu/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success) {
        setSuccess("Menu item added successfully!");
        setMenuItems((p) => [res.data.menuItem, ...p]);
        setNewItem({
          name: "",
          description: "",
          price: "",
          category: categories[0]?._id || "",
          image: null,
        });
        // Clear file input
        const fileInput = document.getElementById("menu-file-input");
        if (fileInput) fileInput.value = "";
      } else {
        setError(res.data?.message || "Failed to add menu item.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Error adding menu item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    setAdmin(null);
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col md:flex-row">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-[#050505] border-r md:border-b-0 border-b border-gold-900/20 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-widest text-gold-500 font-serif">CONTROL</h2>
            <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">
              Zenvora Administration
            </span>
          </div>

          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 w-full justify-start ${
                activeTab === "orders"
                  ? "bg-gold-500 text-black shadow-[0_4px_15px_rgba(212,175,55,0.2)]"
                  : "text-gray-400 hover:text-gold-500 hover:bg-gold-500/5"
              }`}
            >
              <TrendingUp size={18} />
              Orders
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 w-full justify-start ${
                activeTab === "bookings"
                  ? "bg-gold-500 text-black shadow-[0_4px_15px_rgba(212,175,55,0.2)]"
                  : "text-gray-400 hover:text-gold-500 hover:bg-gold-500/5"
              }`}
            >
              <Calendar size={18} />
              Reservations
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 w-full justify-start ${
                activeTab === "menu"
                  ? "bg-gold-500 text-black shadow-[0_4px_15px_rgba(212,175,55,0.2)]"
                  : "text-gray-400 hover:text-gold-500 hover:bg-gold-500/5"
              }`}
            >
              <FolderOpen size={18} />
              Menu Editor
            </button>
          </nav>
        </div>

        <div className="border-t border-gold-900/10 pt-6 mt-6 md:mt-0 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-gray-300">Logged in as</div>
            <div className="text-[10px] text-gray-500 truncate max-w-[140px]">{admin}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-red-500/10 text-red-400 transition-colors"
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {error && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl mb-6 font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/5 border border-green-500/20 text-green-400 text-sm p-4 rounded-2xl mb-6 font-medium">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm mt-3">Loading panel database...</p>
          </div>
        ) : (
          <div>
            {/* Orders Panel Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold font-serif">Customer Orders</h1>
                  <p className="text-gray-500 text-sm">View purchase logs and manage order delivery status.</p>
                </div>

                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="bg-[#0B0B0B] border border-gold-900/15 rounded-3xl p-8 text-center text-gray-500">
                      No customer orders logged.
                    </div>
                  ) : (
                    orders.map((o) => (
                      <div
                        key={o._id}
                        className="bg-[#0B0B0B]/60 border border-gold-900/10 rounded-3xl p-6 flex flex-col gap-4"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold-900/10 pb-4 gap-2">
                          <div>
                            <div className="text-white font-bold text-sm">
                              Order ID: <span className="font-mono text-gray-400">{o._id}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              User: {o.user?.email || "Guest"} • {new Date(o.createdAt).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">Address: {o.address}</div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <span className="text-gold-500 font-serif font-bold text-lg">
                              {formatMoney(o.totalAmount)}
                            </span>
                            <select
                              value={o.status || "Pending"}
                              onChange={(e) => handleOrderStatusUpdate(o._id, e.target.value)}
                              className="bg-[#050505] border border-gold-900/30 text-xs font-bold text-gold-500 px-3 py-1.5 rounded-full outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </div>

                        {/* Order Items detail */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(o.items || []).map((it, idx) => (
                            <div key={it.menuItem?._id || idx} className="flex gap-3 items-center">
                              {it.menuItem?.image && (
                                <img
                                  src={it.menuItem.image}
                                  alt={it.menuItem.name}
                                  className="w-10 h-10 object-cover rounded-xl border border-gold-900/10 shrink-0"
                                />
                              )}
                              <div>
                                <div className="text-gray-200 text-sm font-medium">
                                  {it.menuItem?.name || "Deleted Item"}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Quantity: {it.quantity} • {formatMoney(it.menuItem?.price || 0)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Bookings Panel Tab */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold font-serif">Table Reservations</h1>
                  <p className="text-gray-500 text-sm">Monitor table bookings and confirm seating schedules.</p>
                </div>

                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="bg-[#0B0B0B] border border-gold-900/15 rounded-3xl p-8 text-center text-gray-500">
                      No table reservations currently booked.
                    </div>
                  ) : (
                    bookings.map((b) => (
                      <div
                        key={b._id}
                        className="bg-[#0B0B0B]/60 border border-gold-900/10 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      >
                        <div className="space-y-1">
                          <h3 className="text-white font-bold font-serif text-lg">{b.name}</h3>
                          <div className="text-gray-500 text-xs">
                            Phone: {b.phone} • Guests: {b.numberOfPeople}
                          </div>
                          <div className="text-gold-500/80 text-xs font-semibold">
                            Date: {b.date} • Time Slot: {b.time}
                          </div>
                          {b.note && <div className="text-gray-600 text-xs italic">Request: "{b.note}"</div>}
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-gold-900/10 w-full sm:w-auto justify-end">
                          <select
                            value={b.status || "Booked"}
                            onChange={(e) => handleBookingStatusUpdate(b._id, e.target.value)}
                            className="bg-[#050505] border border-gold-900/30 text-xs font-bold text-gold-500 px-3 py-1.5 rounded-full outline-none"
                          >
                            <option value="Booked">Booked</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Menu Editor Panel Tab */}
            {activeTab === "menu" && (
              <div className="grid lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Columns - Menu items editor list */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold font-serif">Menu Catalog</h1>
                    <p className="text-gray-500 text-sm">Add, preview, or remove items from the restaurant catalog.</p>
                  </div>

                  <div className="space-y-4">
                    {menuItems.map((item) => (
                      <div
                        key={item._id}
                        className="bg-[#0B0B0B]/60 border border-gold-900/10 rounded-3xl p-4 flex justify-between items-center gap-4"
                      >
                        <div className="flex gap-4 items-center">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-2xl border border-gold-900/10 shrink-0"
                            />
                          )}
                          <div>
                            <h4 className="text-white font-bold text-sm leading-snug">{item.name}</h4>
                            <span className="text-[10px] text-gold-500 bg-gold-500/5 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider block mt-1 w-max">
                              {item.category?.name || "Gourmet"}
                            </span>
                            <span className="text-gray-300 font-serif font-bold text-xs mt-1 block">
                              {formatMoney(item.price)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleMenuDelete(item._id)}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/5 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Add Menu Item Form */}
                <div className="lg:col-span-1 bg-[#0B0B0B]/85 border border-gold-900/20 rounded-3xl p-6 space-y-6 shadow-xl">
                  <h2 className="text-xl font-bold text-white font-serif tracking-wide border-b border-gold-900/10 pb-4 flex items-center gap-2">
                    <PlusCircle className="text-gold-500" size={20} />
                    New Menu Item
                  </h2>

                  <form onSubmit={handleAddMenuItem} className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block mb-2">Item Name</label>
                      <input
                        name="name"
                        value={newItem.name}
                        onChange={handleFormChange}
                        className="w-full bg-[#050505] border border-gold-900/30 rounded-2xl p-3 text-white outline-none focus:border-gold-500 transition-colors text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block mb-2">Description</label>
                      <textarea
                        name="description"
                        value={newItem.description}
                        onChange={handleFormChange}
                        className="w-full bg-[#050505] border border-gold-900/30 rounded-2xl p-3 text-white outline-none focus:border-gold-500 transition-colors text-sm"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block mb-2">Price (INR)</label>
                      <input
                        type="number"
                        name="price"
                        value={newItem.price}
                        onChange={handleFormChange}
                        className="w-full bg-[#050505] border border-gold-900/30 rounded-2xl p-3 text-white outline-none focus:border-gold-500 transition-colors text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block mb-2">Category</label>
                      <select
                        name="category"
                        value={newItem.category}
                        onChange={handleFormChange}
                        className="w-full bg-[#050505] border border-gold-900/30 rounded-2xl p-3 text-white outline-none focus:border-gold-500 transition-colors text-sm"
                      >
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block mb-2">Item Image</label>
                      <input
                        id="menu-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full bg-[#050505] border border-gold-900/30 rounded-2xl p-3 text-white outline-none focus:border-gold-500 transition-colors text-xs"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-12 rounded-full bg-gold-500 hover:bg-gold-600 text-black font-bold transition-all shadow-[0_4px_15px_rgba(212,175,55,0.2)] disabled:opacity-40"
                    >
                      {submitting ? "Uploading Item..." : "Publish Menu Item"}
                    </button>
                  </form>
                </div>

              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
