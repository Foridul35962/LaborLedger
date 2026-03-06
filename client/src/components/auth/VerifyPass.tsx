"use client";

import { resendOtp, verifyForgetPass } from '@/store/slice/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface VerifyOtpInput {
    otp: string;
}

const VerifyPass = ({ email, setIsVerified }: {
    email: string,
    setIsVerified: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const { authLoading } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch<AppDispatch>()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<VerifyOtpInput>();

    // Timer Logic
    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleResend = async () => {
        try {
            await dispatch(resendOtp({ email })).unwrap()
            setTimeLeft(60);
            setCanResend(false);
            toast.success("New OTP sent to your email");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const onSubmit = async (data: VerifyOtpInput) => {
        if (String(data.otp).length !== 6) {
            toast.error("OTP must be 6 digits");
            return;
        }
        try {
            await dispatch(verifyForgetPass({ email, otp: data.otp })).unwrap()
            setIsVerified(true);
        } catch (error: any) {
            toast.error(error.message)
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
            
            {/* Left Side: Branding Section */}
            <div className="hidden md:flex md:w-1/2 bg-orange-600 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500 rounded-full opacity-40 animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-700 rounded-full opacity-40" />
                
                <div className="relative z-10 text-white max-w-sm">
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                        <span className="text-orange-600 font-black text-3xl">L</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-4">SECURITY<br/>FIRST</h1>
                    <p className="text-orange-100 text-lg font-medium opacity-90 leading-relaxed">
                        We take your data seriously. Please enter the verification code to prove your identity and reset your password.
                    </p>
                </div>
            </div>

            {/* Right Side: Form Section */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-slate-50 md:bg-white">
                <div className="w-full max-w-md">
                    
                    <div className="mb-10 text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Verify <span className="text-orange-600">OTP</span>
                        </h2>
                        <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                            A 6-digit code has been sent to:<br/>
                            <span className="text-gray-900 font-bold block mt-1">{email || "your email"}</span>
                        </p>
                    </div>

                    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                        {/* OTP Input */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700 tracking-wide uppercase ml-1">
                                Enter 6-Digit Code
                            </label>
                            <input
                                {...register("otp", { required: "OTP is required" })}
                                type="number"
                                onInput={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    if (target.value.length > 6) target.value = target.value.slice(0, 6);
                                }}
                                className={`w-full text-black text-center tracking-[0.6em] md:tracking-[0.8em] text-3xl font-black px-4 py-5 rounded-2xl border transition-all outline-none bg-gray-50 focus:ring-8 ${
                                    errors.otp 
                                    ? 'border-red-400 focus:ring-red-50' 
                                    : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
                                } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                placeholder="000000"
                            />
                            {errors.otp?.message && (
                                <p className="text-xs text-red-500 font-medium ml-1 italic">{String(errors.otp.message)}</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={authLoading}
                                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-xl uppercase tracking-widest flex items-center justify-center gap-2 ${
                                    authLoading 
                                    ? 'bg-orange-400 cursor-not-allowed' 
                                    : 'bg-orange-600 cursor-pointer hover:bg-orange-700 shadow-orange-200 active:scale-[0.97]'
                                }`}
                            >
                                {authLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : "Verify & Proceed"}
                            </button>

                            {/* Resend Section */}
                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-500">Didn't receive the code?</p>
                                {canResend ? (
                                    <button
                                        onClick={handleResend}
                                        type="button"
                                        disabled={authLoading}
                                        className="mt-2 text-sm font-extrabold cursor-pointer disabled:cursor-not-allowed text-orange-600 hover:text-orange-700 transition-all underline underline-offset-4 decoration-2"
                                    >
                                        Resend New OTP
                                    </button>
                                ) : (
                                    <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Resend in</span>
                                        <span className="text-sm font-black text-orange-600">{timeLeft}s</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyPass;