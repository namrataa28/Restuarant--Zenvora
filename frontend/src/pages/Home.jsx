import React from "react";
import gourmetDish from "../assets/gourmet_dish.png";
import { Link } from "react-router-dom";
import { Star, ShieldCheck, Zap, CalendarDays, Lock } from "lucide-react";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* Admin Button */}
      <div className="absolute top-4 right-4 z-10">
        <Link
          to="/admin/login"
          className="flex items-center gap-2 bg-[#0B0B0B]/85 border border-gold-900/30 hover:border-gold-500/60 text-gold-500 hover:text-white px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] cursor-pointer"
        >
          <Lock size={12} />
          Admin Portal
        </Link>
      </div>

      {/* Hero Section */}
      <div className="mt-8 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-gold-500 font-serif tracking-widest text-sm uppercase block font-semibold">
            Welcome to Zenvora
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight font-serif">
            A Symphony of <br />
            <span className="text-gold-500">Fine Dining</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Embark on a culinary voyage where fine craftsmanship meets rich flavors. Fresh, organic ingredients styled into masterpieces by our award-winning chefs.
          </p>

          <div className="pt-2 flex gap-4">
            <Link
              to="/menu"
              className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-4 rounded-full font-bold transition-all shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.45)] hover:-translate-y-0.5 duration-300"
            >
              Explore Menu
            </Link>
            <Link
              to="/book_table"
              className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-0.5 duration-300"
            >
              Book a Table
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-6 grid grid-cols-3 gap-4">
            <div className="bg-[#0B0B0B]/80 border border-gold-900/20 rounded-2xl p-4 text-center">
              <div className="text-gold-500 font-bold text-2xl font-serif">4.9★</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">Rating</div>
            </div>
            <div className="bg-[#0B0B0B]/80 border border-gold-900/20 rounded-2xl p-4 text-center">
              <div className="text-gold-500 font-bold text-2xl font-serif">20-30m</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">Delivery</div>
            </div>
            <div className="bg-[#0B0B0B]/80 border border-gold-900/20 rounded-2xl p-4 text-center">
              <div className="text-gold-500 font-bold text-2xl font-serif">Organic</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">Ingredients</div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-gold-500/20 to-transparent blur-lg"></div>
          <img
            src={gourmetDish}
            alt="Gourmet Dish Presentation"
            className="relative w-full h-[480px] object-cover rounded-3xl border border-gold-900/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          />
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mt-24 border-t border-gold-900/10 pt-16">
        <div className="text-center space-y-2 mb-12">
          <span className="text-gold-500 font-serif tracking-widest text-xs uppercase font-semibold">
            Our Pillars
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">
            Why Choose Zenvora
          </h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            We hold ourselves to the highest standards of culinary execution and guest service.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Exceptional Taste",
              desc: "Carefully curated ingredients prepared by master chefs to create distinct flavor profiles.",
              icon: <Star size={24} className="text-gold-500" />,
            },
            {
              title: "Premium Standards",
              desc: "Highest hygiene and safety protocols. All items sourced from certified organic local farms.",
              icon: <ShieldCheck size={24} className="text-gold-500" />,
            },
            {
              title: "Seamless Reservations",
              desc: "Book your favorite table instantly with our real-time seating reservation system.",
              icon: <CalendarDays size={24} className="text-gold-500" />,
            },
          ].map((x, idx) => (
            <div
              key={idx}
              className="bg-[#0B0B0B]/40 border border-gold-900/10 rounded-3xl p-8 hover:border-gold-500/20 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-4"
            >
              <div className="w-12 h-12 bg-gold-500/5 rounded-2xl flex items-center justify-center border border-gold-500/10">
                {x.icon}
              </div>
              <h3 className="text-white font-semibold text-xl font-serif">{x.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{x.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
