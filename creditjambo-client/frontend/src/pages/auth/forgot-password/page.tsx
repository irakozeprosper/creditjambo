import { useFormik } from "formik";
import * as Yup from "yup";

const ForgotPassword = () => {
    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Email is required"),
        }),
        onSubmit: (values) => {
            console.log(values);
        },
    });

    return (
        <div className="bg-slate-100 dark:bg-slate-900 h-screen">
            <div className="w-full max-w-md mx-auto p-6">
                <div className="mt-7 rounded-xl shadow-lg border-2 border-indigo-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="p-4 sm:p-7">
                        <div className="text-center">
                            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Forgot password?</h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Remember your password?
                                <a
                                    className="text-blue-600 decoration-2 hover:underline font-medium"
                                    href="/login"
                                >
                                    Login here
                                </a>
                            </p>
                        </div>

                        <div className="mt-5">
                            <form onSubmit={formik.handleSubmit}>
                                <div className="grid gap-y-4">
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-bold ml-1 mb-2 text-gray-800 dark:text-white"
                                        >
                                            Email address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                required
                                            />
                                        </div>
                                        {formik.touched.email && formik.errors.email && (
                                            <p className="text-xs text-red-600 mt-2">{formik.errors.email}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-offset-gray-800"
                                    >
                                        Reset password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
