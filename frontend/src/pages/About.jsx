import React from "react";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold text-white">About Us</h1>
      <p className="text-gray-400 mt-3">
        We&apos;re a modern restaurant focused on taste, freshness, and great service.
        From family favorites to chef&apos;s specials, every dish is prepared with care.
      </p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-black/40 border border-gray-800 rounded-2xl p-6">
          <div className="text-white font-semibold text-lg">Our Story</div>
          <p className="text-gray-300 mt-2 text-sm leading-relaxed">
            Started with a passion for good food and welcoming hospitality. Today, we
            continue to serve delicious meals made from quality ingredients.
          </p>
        </div>
        <div className="bg-black/40 border border-gray-800 rounded-2xl p-6">
          <div className="text-white font-semibold text-lg">What We Value</div>
          <ul className="text-gray-300 mt-2 text-sm space-y-2">
            <li>• Freshness in every bite</li>
            <li>• Consistency in quality</li>
            <li>• Friendly and fast service</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;

