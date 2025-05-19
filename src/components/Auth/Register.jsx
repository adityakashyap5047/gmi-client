import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";

    if (form.confirmPassword !== form.password)
      errs.confirmPassword = "Passwords do not match";

    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length === 0) {
    setIsSubmitting(true);
    setSuccessMsg("");
    try {
      const res = await axios.post(
        import.meta.env.VITE_PUBLIC_API_URL + "/api/auth/register",
        form
      );

      if (res.status !== 201) {
        setErrors({ server: "Registration failed. Please try again." });
        setForm({ email: "", password: "", confirmPassword: "" });
        setIsSubmitting(false);
        return;
      }

      // success path
      setForm({ email: "", password: "", confirmPassword: "" });
      setSuccessMsg("Registration successful! You can now login.");
      setErrors({});
      navigate("/login");

    } catch (error) {
      console.log("Registration error:", error);
      setErrors({ server: "Registration failed. Please try again." });
      setForm({ email: "", password: "", confirmPassword: "" });
    }

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
          Create Account
        </h2>

        {errors.server && (
          <p className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center">
            {errors.server}
          </p>
        )}

        {successMsg && (
          <p className="bg-green-100 text-green-800 p-2 mb-4 rounded text-center">
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

        <div className="mb-4">
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

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-white font-semibold mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md bg-white/70 focus:outline-none ${
              errors.confirmPassword ? "border-2 border-red-500" : "border border-transparent"
            }`}
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-3 rounded-md shadow-md disabled:opacity-60"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </motion.div>
  );
}
