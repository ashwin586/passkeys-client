import React from "react";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { authInterface, AuthComponentProps } from "@/types/interface";
import Link from "next/link";

const AuthComponent: React.FC<AuthComponentProps> = ({
  mode,
  submitHandler,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<authInterface>();
  return (
    <div className="auth__container glossy_container">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="auth__form__container"
      >
        <h1 className="text-3xl font-bold">Welcome to Vault</h1>
        {mode === "login" ? (
          <h1 className="text-xl font-bold">Login</h1>
        ) : (
          <h1 className="text-xl font-bold">Register</h1>
        )}

        <TextField
          id="email"
          type="text"
          label="Email"
          variant="filled"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          autoComplete="off"
          sx={{
            mb: 2,
            "& .MuiFilledInput-root": {
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.15)",
            },
            "& .MuiFilledInput-root:hover": {
              backgroundColor: "rgba(255,255,255,0.08)",
            },
            "& .MuiFilledInput-root:before": {
              borderBottom: "none !important",
            },
            "& .MuiFilledInput-root:after": {
              borderBottom: "none !important",
            },
            "& .MuiInputLabel-root": {
              color: "#cbd5e1",
            },
            "& input": {
              color: "white",
            },
          }}
        />
        {errors.email && <p className="alert__err">{errors.email.message}</p>}
        <TextField
          id="password"
          label="Password"
          type="password"
          variant="filled"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          sx={{
            mb: 2,
            "& .MuiFilledInput-root": {
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.15)",
            },
            "& .MuiFilledInput-root:hover": {
              backgroundColor: "rgba(255,255,255,0.08)",
            },
            "& .MuiFilledInput-root:before": {
              borderBottom: "none !important",
            },
            "& .MuiFilledInput-root:after": {
              borderBottom: "none !important",
            },
            "& .MuiInputLabel-root": {
              color: "#cbd5e1",
            },
            "& input": {
              color: "white",
            },
          }}
        />
        {errors.password && (
          <p className="alert__err">{errors.password.message}</p>
        )}
        {mode === "login" && (
          <div className="text-start w-100">
            <a href="/forgotpassword" className="text-blue-400">
              Forgot password?
            </a>
          </div>
        )}
        <button type="submit" className="auth_btn">
          {mode === "login" ? "Login" : "Register"}
        </button>
        <div>
          {mode === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-blue-400">
                Register
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-400">
                Login
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthComponent;
