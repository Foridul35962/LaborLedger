"use client";

import { login } from '@/store/slice/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface LoginFormInput {
    email: string;
    password: string;
}

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormInput>();
    const router = useRouter();

    const { authLoading } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = async (data: LoginFormInput) => {
        try {
            await dispatch(login(data)).unwrap();
            router.push('/');
            toast.success('Login successful');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">

            {/* Left Side: Branding & Welcome Section */}
            <div className="hidden md:flex md:w-1/2 bg-orange-600 items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute -top-10 -left-10 w-72 h-72 bg-orange-500 rounded-full opacity-30" />
                <div className="absolute bottom-20 right-10 w-48 h-48 bg-orange-700 rounded-full opacity-40 animate-pulse" />

                <div className="relative z-10 text-white max-w-sm">
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                        <span className="text-orange-600 font-black text-3xl">L</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-4 uppercase">
                        Welcome <br />Back
                    </h1>
                    <p className="text-orange-100 text-lg font-medium opacity-90 leading-relaxed">
                        Log in to **Labor Ledger** to manage your workforce, track real-time hours, and streamline your payroll operations.
                    </p>
                </div>
            </div>

            {/* Right Side: Login Form Section */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-slate-50 md:bg-white">
                <div className="w-full max-w-md">

                    {/* Header */}
                    <div className="mb-10 text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Sign In
                        </h2>
                        <p className="text-gray-500 mt-2 text-sm">
                            Please enter your credentials to access your dashboard.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 tracking-wide ml-1">
                                Email Address
                            </label>
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                type="email"
                                className={`w-full px-5 py-4 text-black rounded-xl border transition-all outline-none bg-gray-50 focus:ring-4 ${errors.email
                                        ? 'border-red-400 focus:ring-red-50'
                                        : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
                                    }`}
                                placeholder="worker@ledger.com"
                            />
                            {errors.email?.message && (
                                <p className="text-xs text-red-500 font-medium ml-1 italic">{String(errors.email.message)}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-gray-700 tracking-wide">
                                    Password
                                </label>
                                <Link href="/forget-pass" className="text-xs font-bold text-orange-600 hover:text-orange-700">
                                    Forgot Password?
                                </Link>
                            </div>
                            <input
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Minimum 8 characters required" }
                                })}
                                type="password"
                                className={`w-full text-black px-5 py-4 rounded-xl border transition-all outline-none bg-gray-50 focus:ring-4 ${errors.password
                                        ? 'border-red-400 focus:ring-red-50'
                                        : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
                                    }`}
                                placeholder="••••••••"
                            />
                            {errors.password?.message && (
                                <p className="text-xs text-red-500 font-medium ml-1 italic">{String(errors.password.message)}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center px-1">
                            <input
                                id="remember-me"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600 font-medium cursor-pointer select-none">
                                Keep me logged in
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={authLoading}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-xl uppercase tracking-widest flex items-center justify-center gap-2 ${authLoading
                                    ? 'bg-orange-400 cursor-not-allowed'
                                    : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200 active:scale-[0.97]'
                                }`}
                        >
                            {authLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </>
                            ) : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}