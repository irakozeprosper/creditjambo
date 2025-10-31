import { useState } from "react";
import { Sun, Moon, Eye, EyeOff } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTheme } from "../../../hooks/use-theme";
import useLogin from "../../../hooks/useLogin";
import loginImage from "../../../assets/loginImage.png";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { theme, setTheme } = useTheme();
    const { handleLogin, loading, error } = useLogin();

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").max(28, "Password is too long").required("Password is required"),
    });

    return (
        <div className="flex min-h-screen w-full flex-wrap items-stretch bg-white dark:bg-gray-800 max-md:pb-20 max-md:pt-32">
            <div className="grow md:flex md:w-1/2 md:flex-col md:items-center md:justify-center md:py-10">
                <div className="w-full px-4 text-center text-xs lg:w-1/2">
                    <button
                        className="mb-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    >
                        <Sun
                            size={20}
                            className="dark:hidden"
                        />
                        <Moon
                            size={20}
                            className="hidden dark:block"
                        />
                    </button>
                    <h1 className="mb-8 text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h1>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">Access your account to explore our amazing features.</p>
                    <Formik
                        initialValues={{ email: "", password: "", remember: false }}
                        validationSchema={validationSchema}
                        onSubmit={({ email, password }) => {
                            handleLogin({ email, password });
                        }}
                    >
                        {() => (
                            <Form className="flex flex-col gap-2">
                                <div className="relative">
                                    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-200 mb-3">
                                        Email Address
                                    </label>
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        className="block w-full px-4 py-3 border border-gray-300 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-200 mb-3">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Your password"
                                            className="block w-full px-4 py-3 border border-gray-300 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between gap-2 my-2">
                                    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-200">
                                        <Field
                                            type="checkbox"
                                            name="remember"
                                        />
                                        Remember me
                                    </label>
                                    <a
                                        className="text-indigo-600 dark:text-indigo-400"
                                        href="/forgot-password"
                                    >
                                        Forgot Password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-500"
                                >
                                    {loading ? "Signing in..." : "Sign in"}
                                </button>

                                {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
                            </Form>
                        )}
                    </Formik>

                    <div className="text-gray-600 dark:text-gray-400 mt-4">
                        By proceeding, you acknowledge and accept our
                        <a
                            className="font-medium text-indigo-600 underline"
                            href="/terms"
                        >
                            {" "}
                            Terms and Conditions
                        </a>
                        and
                        <a
                            className="font-medium text-indigo-600 underline"
                            href="/privacy-policy"
                        >
                            {" "}
                            Privacy Policy
                        </a>
                        .
                    </div>
                </div>
            </div>

            <div
                className="hidden md:flex md:w-1/2 flex-col justify-center bg-cover bg-center"
                style={{
                    backgroundImage: "url(https://img.freepik.com/free-vector/gray-neural-network-illustration_53876-78764.jpg?size=626&ext=jpg)",
                }}
            >
                <img
                    className="translate-x-[27%] rounded-[36px] shadow-lg"
                    src={loginImage}
                    alt="Service Dashboard Mockup"
                />
            </div>
        </div>
    );
}
