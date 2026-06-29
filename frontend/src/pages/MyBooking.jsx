import React, { useContext, useEffect, useState } from "react";
import api from "../lib/api";
import { AppContext } from "../context/AppContext";
import { CalendarDays, Users, Clock } from "lucide-react";

const MyBooking = () => {
  const { user, navigate } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/booking/my-bookings");
        setBookings(res.data?.bookings || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load bookings");
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
          <p className="text-lg">Please sign in to view your bookings.</p>
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
      <h1 className="text-3xl md:text-4xl font-bold text-white font-serif mb-2">My Bookings</h1>
      <p className="text-gray-500 text-sm mb-8">View your reserved table slots and schedule.</p>

      {error && <div className="mt-4 text-red-400 text-sm font-medium">{error}</div>}

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="bg-[#0B0B0B]/80 border border-gold-900/10 rounded-3xl p-8 text-center text-gray-500 text-sm">
              You do not have any bookings scheduled yet.
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b._id}
                className="bg-[#0B0B0B]/60 border border-gold-900/15 rounded-3xl p-6 hover:border-gold-500/20 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-3">
                  <h3 className="text-white font-bold font-serif text-xl">{b.name}</h3>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-gold-500" />
                      {b.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-gold-500" />
                      {b.time}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users size={14} className="text-gold-500" />
                      {b.numberOfPeople} People
                    </span>
                  </div>

                  {b.note && (
                    <div className="text-gray-500 text-xs italic bg-[#050505] p-3 rounded-xl border border-gold-900/5">
                      Request: "{b.note}"
                    </div>
                  )}
                </div>

                <div className="w-full md:w-auto text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-gold-900/10">
                  <span className="inline-block px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold bg-gold-500/5 border border-gold-500/30 text-gold-500">
                    {b.status || "Confirmed"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyBooking;
