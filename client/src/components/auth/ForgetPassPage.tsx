"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { forgetPass } from '@/store/slice/authSlice';
import { toast } from 'react-toastify';

interface ForgotPassInput {
    email: string;
}

const ForgetPassPage = ({ setEmail }: { setEmail: React.Dispatch<React.SetStateAction<string>> }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ForgotPassInput>();

    const dispatch = useDispatch<AppDispatch>();
    const { authLoading } = useSelector((state: RootState) => state.auth);

    const onSubmit = async (data: ForgotPassInput) => {
        try {
            await dispatch(forgetPass(data)).unwrap();
            setEmail(data.email);
            toast.success("OTP sent successfully!");
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
            
            {/* Left Side: Branding Section */}
            <div className="hidden md:flex md:w-1/2 bg-orange-600 items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative Shapes */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500 rounded-full opacity-40 animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-700 rounded-full opacity-40" />
                
                <div className="relative z-10 text-white max-w-sm">
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                        <span className="text-orange-600 font-black text-3xl">L</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-4">
                        LABOR <br/>LEDGER
                    </h1>
                    <p className="text-orange-100 text-lg font-medium opacity-90 leading-relaxed">
                        Don't worry! It happens. Enter your details to recover your account access and get back to managing your workforce.
                    </p>
                </div>
            </div>

            {/* Right Side: Form Section */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-slate-50 md:bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo (Only shows on small screens) */}
                    <div className="md:hidden flex flex-col items-center mb-8">
                         <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            LABOR <span className="text-orange-600">LEDGER</span>
                        </h2>
                    </div>

                    <div className="mb-10 text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Forgot Password?
                        </h2>
                        <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                            Enter the email address associated with your account. We will send a <span className="text-orange-600 font-bold">6-digit OTP</span> to verify your identity.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 tracking-wide ml-1">
                                Registered Email
                            </label>
                            <div className="relative">
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Please enter a valid email address"
                                        }
                                    })}
                                    type="email"
                                    className={`w-full text-black px-5 py-4 rounded-xl border transition-all outline-none bg-gray-50 focus:ring-4 ${
                                        errors.email 
                                        ? 'border-red-400 focus:ring-red-50' 
                                        : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
                                    }`}
                                    placeholder="e.g. admin@laborledger.com"
                                />
                            </div>
                            {errors.email?.message && (
                                <p className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-red-500 rounded-full inline-block"></span>
                                    {String(errors.email.message)}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={authLoading}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg uppercase tracking-widest flex items-center justify-center gap-2 ${
                                authLoading 
                                ? 'bg-orange-400 cursor-not-allowed' 
                                : 'bg-orange-600 cursor-pointer hover:bg-orange-700 shadow-orange-200 active:scale-[0.97]'
                            }`}
                        >
                            {authLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                "Send OTP Code"
                            )}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                        <Link
                            href="/login"
                            className="text-sm font-bold text-gray-400 hover:text-orange-600 transition-all inline-flex items-center gap-2 group"
                        >
                            <svg 
                                className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassPage;