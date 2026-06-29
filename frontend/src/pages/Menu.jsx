import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";
import { formatMoney } from "../lib/ui";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [menuRes, catRes] = await Promise.all([
          api.get("/menu/all"),
          api.get("/category/all"),
        ]);
        setMenuItems(menuRes.data?.menuItems || []);
        setCategories(catRes.data?.categories || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load menu");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredItems = selectedCategory === "All"
    ? menuItems
    : menuItems.filter(item => item.category?.name === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center space-y-2 mb-10">
        <span className="text-gold-500 font-serif tracking-widest text-xs uppercase font-semibold">
          Epicurean Selections
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white font-serif">Our Menu</h1>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Indulge in a fine selection of artisanal dishes crafted to perfection.
        </p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold border transition-all duration-300 ${
            selectedCategory === "All"
              ? "bg-gold-500 text-black border-gold-500 shadow-[0_2px_15px_rgba(212,175,55,0.25)]"
              : "border-gold-900/30 text-gray-400 hover:text-gold-500 hover:border-gold-500"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold border transition-all duration-300 ${
              selectedCategory === cat.name
                ? "bg-gold-500 text-black border-gold-500 shadow-[0_2px_15px_rgba(212,175,55,0.25)]"
                : "border-gold-900/30 text-gray-400 hover:text-gold-500 hover:border-gold-500"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {error && <div className="mt-6 text-red-400 text-center font-medium">{error}</div>}

      {loading ? (
        <div className="mt-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm mt-3">Curating delicacies...</p>
        </div>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-[#0B0B0B]/60 border border-gold-900/10 rounded-3xl overflow-hidden hover:border-gold-500/20 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)] group flex flex-col h-full"
            >
              {item.image && (
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#050505]/80 border border-gold-500/20 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-gold-500">
                    {item.category?.name || "Gourmet"}
                  </div>
                </div>
              )}
              <div className="p-6 flex flex-col flex-1 space-y-4 justify-between">
                <div className="space-y-2">
                  <h3 className="text-white font-bold text-xl font-serif leading-snug group-hover:text-gold-500 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gold-900/10">
                  <div className="text-gold-500 font-bold font-serif text-lg">
                    {formatMoney(item.price)}
                  </div>
                  <Link
                    to={`/menu-details/${item._id}`}
                    className="text-black bg-gold-500 hover:bg-gold-600 px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-[0_2px_10px_rgba(212,175,55,0.15)]"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
