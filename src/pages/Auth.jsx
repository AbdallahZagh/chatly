import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { loginSchema } from "../schemas/loginSchema";
import { signupSchema } from "../schemas/signupSchema";
import { useAppStore } from "../store/useAppStore";
import { useAuth } from "../hooks/useAuth";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);
  const { signup, login } = useAuth();

  const schema = isSignup ? signupSchema : loginSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, submitCount },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // 🔔 Show validation errors in toast (only after submit)
  useEffect(() => {
    if (submitCount === 0) return;

    Object.values(errors).forEach((err) => {
      if (err?.message) {
        toast.error(err.message);
      }
    });
  }, [errors, submitCount]);

  const onSubmit = async (data) => {
    try {
      if (isSignup) {
        // signup flow
        await signup({ email: data.email, password: data.password, username: data.username, displayName: data.displayName });
        toast.success('Account created successfully!');
        navigate('/chats');
      } else {
        await login({ email: data.email, password: data.password });
        toast.success('Welcome back!');
        navigate('/chats');
      }
    } catch(e) {
      console.log(e)
      toast.error("Something went wrong");
    }
  };

  const toggleMode = () => {
    reset();
    setIsSignup((prev) => !prev);
  };

  return (
    <div className="w-full h-screen bg-[#1f1219] flex items-center justify-center overflow-hidden">
      <div className="relative w-[70%] h-[75%] border border-[#f2e8ed] bg-[#f2e8ed] rounded-4xl overflow-hidden">

        {/* LEFT PANEL (SWITCH PANEL) */}
        <motion.div
          animate={{ x: isSignup ? "100%" : "0%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[50%] h-full bg-[#2f1a25] text-[#f2e8ed]
                     flex flex-col items-center justify-center text-center p-10 z-20 rounded-3xl"
        >
          <h2 className="text-5xl mb-4">
            {isSignup ? "Welcome Back" : "Hello Friend"}
          </h2>

          <p className="text-lg font-thin max-w-xs">
            {isSignup
              ? "Already have an account? Login to continue"
              : "Join our platform and start your journey"}
          </p>

          <button
            onClick={toggleMode}
            className="mt-10 w-full border-2 py-2.5 rounded-lg
                       hover:bg-[#f2e8ed] hover:text-[#2f1a25]
                       transition duration-300"
          >
            {isSignup ? "Sign In" : "Register"}
          </button>
        </motion.div>

        {/* RIGHT PANEL (FORM PANEL) */}
      <motion.div
  animate={{ x: isSignup ? "-100%" : "0%" }}
  transition={{ duration: 0.6, ease: "easeInOut" }}
  className="
    absolute top-0 right-0 w-1/2 h-full
    p-10
    text-[#27161F]
    flex flex-col
    overflow-y-auto
    scrollbar-left
  "
>
  <h2 className={`text-5xl ${isSignup ? "mb-8" : "mb-14"}`}>
    {isSignup ? "Create Account" : "Sign In"}
  </h2>

  <form
    onSubmit={handleSubmit(onSubmit)}
    className={`flex flex-col ${isSignup ? "gap-5" : "gap-6"}`}
  >
    {/* EMAIL */}
    <div>
      <label className="text-xl font-medium">Email</label>
      <input
        type="email"
        {...register("email")}
        className={`w-full mt-2 p-2 rounded-lg border
          ${errors.email ? "border-red-500" : "border-[#2f1a25]"}
          focus:outline-none focus:ring-2 focus:ring-[#2f1a25]`}
      />
    </div>

    {/* SIGNUP FIELDS */}
    {isSignup && (
      <>
        <div>
          <label className="text-xl font-medium">Display name</label>
          <input
            type="text"
            {...register("displayName")}
            className={`w-full mt-2 p-2 rounded-lg border
              ${errors.displayName ? "border-red-500" : "border-[#2f1a25]"}
              focus:outline-none focus:ring-2 focus:ring-[#2f1a25]`}
          />
        </div>

        <div>
          <label className="text-xl font-medium">Username</label>
          <input
            type="text"
            {...register("username")}
            className={`w-full mt-2 p-2 rounded-lg border
              ${errors.username ? "border-red-500" : "border-[#2f1a25]"}
              focus:outline-none focus:ring-2 focus:ring-[#2f1a25]`}
          />
        </div>
      </>
    )}

    {/* PASSWORD */}
    <div>
      <label className="text-xl font-medium">Password</label>
      <input
        type="password"
        {...register("password")}
        className={`w-full mt-2 p-2 rounded-lg border
          ${errors.password ? "border-red-500" : "border-[#2f1a25]"}
          focus:outline-none focus:ring-2 focus:ring-[#2f1a25]`}
      />
    </div>

    {/* CONFIRM PASSWORD */}
    {isSignup && (
      <div>
        <label className="text-xl font-medium">Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword")}
          className={`w-full mt-2 p-2 rounded-lg border
            ${errors.confirmPassword ? "border-red-500" : "border-[#2f1a25]"}
            focus:outline-none focus:ring-2 focus:ring-[#2f1a25]`}
        />
      </div>
    )}

    {/* SUBMIT */}
    <button
      type="submit"
      disabled={isSubmitting}
      className="
        mt-10 w-full bg-[#2f1a25] text-white py-3 rounded-lg
        hover:bg-[#27161F] transition disabled:opacity-50
      "
    >
      {isSubmitting
        ? "Please wait..."
        : isSignup
        ? "Create Account"
        : "Sign In"}
    </button>
  </form>
</motion.div>


      </div>
    </div>
  );
};

export default Auth;
