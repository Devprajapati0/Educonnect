import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { useForgotPasswordMutation } from '../../store/api/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
    subdomain: '',
  });

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await forgotPassword(data).unwrap();
    //   console.log(response);

      if (response.success) {
        toast.success(response.message || "Password reset successful");
        setData({ email: '', password: '', subdomain: '' });
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reset password");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-sm text-gray-600 mt-1">
            Enter your email and new password to reset your account
          </p>
        </div>

        <form className="space-y-5" onSubmit={submitHandler}>
          {/* Subdomain */}
          <div>
            <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">
              Subdomain
            </label>
            <div className="relative mt-1">
              <Globe className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                id="subdomain"
                name="subdomain"
                type="text"
                required
                value={data.subdomain}
                onChange={handleChange}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="your-institution"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={data.email}
                onChange={handleChange}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="example@domain.com"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={data.password}
                onChange={handleChange}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              <>
                Reset Password
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;