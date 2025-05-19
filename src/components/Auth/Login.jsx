import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const {setUser} = useUser();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Basic validation
  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
    )
      errs.email = "Invalid email address";

    if (!form.password) errs.password = "Password is required";

    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setErrorMsg("");
      try {
        const res = await axios.post(import.meta.env.VITE_PUBLIC_API_URL + "/api/auth/login", form);
        if (res.status === 200) {
          setUser(res.data?.user);
          setSuccessMsg("Login successful!");
          navigate("/")
        } else {
          setErrorMsg("Invalid email or password");
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrorMsg("Invalid email or password");
      }
      setForm({ email: "", password: "" });
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white/20 backdrop-blur-md rounded-lg p-8 max-w-md w-full shadow-lg"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Login to Your Account
        </h2>

        {errorMsg && (
          <p className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center">
            {errorMsg}
          </p>
        )}

        {successMsg && (
          <p className="bg-green-100 text-green-700 p-2 mb-4 rounded text-center">
            {successMsg}
          </p>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-white font-semibold mb-1">
            Email
          </label>
          <input
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md bg-white/70 focus:outline-none ${
              errors.email ? "border-2 border-red-500" : "border border-transparent"
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-white font-semibold mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md bg-white/70 focus:outline-none ${
              errors.password ? "border-2 border-red-500" : "border border-transparent"
            }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-3 rounded-md shadow-md disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </motion.div>
  );
}