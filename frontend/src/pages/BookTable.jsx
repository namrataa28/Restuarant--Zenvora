import React, { useContext, useState } from "react";
import api from "../lib/api";
import { AppContext } from "../context/AppContext";

const BookTable = () => {
  const { user, navigate } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    numberOfPeople: 2,
    date: "",
    time: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (!user) {
        navigate("/login");
        return;
      }

      const payload = {
        ...formData,
        numberOfPeople: Number(formData.numberOfPeople),
      };

      const res = await api.post("/booking/create", payload);
      if (res.data?.success) {
        setSuccess("Table booked successfully!");
        setFormData({ name: "", phone: "", numberOfPeople: 2, date: "", time: "", note: "" });
      } else {
        setError(res.data?.message || "Booking failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center space-y-2 mb-10">
        <span className="text-gold-500 font-serif tracking-widest text-xs uppercase font-semibold">
          Reservation Desk
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white font-serif">Book a Table</h1>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Reserve a premier dining space for your upcoming experience.
        </p>
      </div>

      {!user ? (
        <div className="bg-gold-500/5 border border-gold-500/20 text-gray-200 rounded-3xl p-8 text-center space-y-4 max-w-2xl mx-auto">
          <p className="text-lg">Please sign in to make a table reservation.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gold-500 text-black px-8 py-3 rounded-full font-bold hover:bg-gold-600 transition-all shadow-[0_4px_15px_rgba(212,175,55,0.25)]"
          >
            Login to Account
          </button>
        </div>
      ) : (
        <div className="bg-[#0B0B0B]/80 border border-gold-900/20 rounded-3xl p-6 md:p-10 max-w-3xl mx-auto shadow-2xl">
          <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block mb-2">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={onChange}
                className="w-full bg-[#050505] border border-gold-900/30 rounded-2xl p-4 text-white outline-none focus:border-gold-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block mb-2">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={onChange}
                className="w-full bg-[#050505] border border-gold-900/30 rounded-2xl p-4 text-white outline-none focus:border-gold-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block mb-2">Number of Guests</label>
              <input
                type="number"
                name="numberOfPeople"
                value={formData.numberOfPeople}
                onChange={onChange}
                min={1}
                className="w-full bg-[#050505] border border-gold-900/30 rounded-2xl p-4 text-white outline-none focus:border-gold-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={onChange}
                className="w-full bg-[#050505] border border-gold-900/30 rounded-2xl p-4 text-white outline-none focus:border-gold-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block mb-2">Time Slot</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={onChange}
                className="w-full bg-[#050505] border border-gold-900/30 rounded-2xl p-4 text-white outline-none focus:border-gold-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block mb-2">Special Request (optional)</label>
              <input
                name="note"
                value={formData.note}
                onChange={onChange}
                placeholder="Seating choice / celebration note"
                className="w-full bg-[#050505] border border-gold-900/30 rounded-2xl p-4 text-white outline-none focus:border-gold-500 transition-colors text-sm"
              />
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-full bg-gold-500 hover:bg-gold-600 text-black font-bold transition-all shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)] disabled:opacity-45"
              >
                {loading ? "Creating Reservation..." : "Confirm Table Reservation"}
              </button>
            </div>

            {error && <div className="md:col-span-2 text-red-400 text-sm font-medium text-center">{error}</div>}
            {success && <div className="md:col-span-2 text-green-400 text-sm font-medium text-center">{success}</div>}
          </form>
        </div>
      )}
    </div>
  );
};

export default BookTable;
