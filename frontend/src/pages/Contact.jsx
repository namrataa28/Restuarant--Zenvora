import React from "react";

const Contact = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold text-white">Contact</h1>
      <p className="text-gray-400 mt-3">Reach out for bookings, orders, or support.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-black/40 border border-gray-800 rounded-2xl p-6">
          <div className="text-white font-semibold text-lg">Visit Us</div>
          <div className="text-gray-300 text-sm mt-2 leading-relaxed">
            123 Restaurant Street
            <br />
            Your City, India
          </div>
          <div className="text-gray-300 text-sm mt-4">
            Phone: <span className="text-white">+91 98765 43210</span>
          </div>
          <div className="text-gray-300 text-sm mt-1">
            Email: <span className="text-white">support@restaurant.com</span>
          </div>
        </div>

        <div className="bg-black/40 border border-gray-800 rounded-2xl p-6">
          <div className="text-white font-semibold text-lg">Send a message</div>
          <div className="text-gray-300 text-sm mt-2">Frontend form (no backend endpoint in current repo).</div>
          <div className="mt-4 space-y-3">
            <input className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none" placeholder="Your name" />
            <input className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none" placeholder="Email" />
            <textarea rows={4} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none" placeholder="Message" />
            <button className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

