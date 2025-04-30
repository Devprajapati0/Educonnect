import React from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Pricing Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            One powerful plan to connect your entire educational community.
          </p>
        </div>

        {/* Single Plan Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-2">EduConnect Plan</h2>
          <p className="text-gray-500 mb-6">Everything you need for your school communication</p>

          <div className="flex justify-center items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold">$499</span>
            <span className="text-gray-500">/ month</span>
          </div>

          {/* Features List */}
          <ul className="text-left space-y-4 mb-8">
            {[
              "Unlimited users and messages",
              "Secure messaging platform",
              "Role-based permissions",
              "Video conferencing integration",
              "LMS system support",
              "Priority customer support",
              "Custom branding options"
            ].map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-1" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Call to Action */}
          <Link
            href="/signup"
            className="inline-block w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  );
}