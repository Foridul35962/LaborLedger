"use client";

import { resetPass } from '@/store/slice/authSlice';
import { AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

interface ResetInputs {
    password: string;
    confirmPassword: string;
}

const ResetPass = ({ email }: { email: string }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<ResetInputs>();

    const passwordValue = watch("password", "");

    // Your specific validation logic
    const alphabetValidate = /[a-zA-Z]/.test(passwordValue);
    const numberValidate = /\d/.test(passwordValue);
    const lengthValidate = passwordValue.length >= 8;
    const allValid = alphabetValidate && numberValidate && lengthValidate;

    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    const onSubmit = async (data: ResetInputs) => {
        if (allValid) {
            try {
                await dispatch(resetPass({ email, password: data.password })).unwrap()
                toast.success("Password Changes Successfully")
                router.push('/login')
            } catch (error: any) {
                toast.error(error.message)
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">

            {/* Left Side: Branding & Info */}
            <div className="hidden md:flex md:w-1/2 bg-orange-600 items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500 rounded-full opacity-50" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-700 rounded-full opacity-50" />

                <div className="relative z-10 text-white max-w-sm">
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                        <span className="text-orange-600 font-black text-3xl">L</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-4">LABOR <br />LEDGER</h1>
                    <p className="text-orange-100 text-lg font-medium opacity-90">
                        Secure your account. A strong password ensures your labor data and payroll remain protected.
                    </p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-20">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900">Reset Password</h2>
                        <p className="text-gray-500 mt-2">
                            Setting a new password for <span className="text-orange-600 font-semibold">{email}</span>
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 tracking-wide">New Password</label>
                            <input
                                {...register("password", { required: true })}
                                type="password"
                                className="w-full px-4 py-4 rounded-xl border text-black border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none bg-gray-50"
                                placeholder="Create a strong password"
                            />

                            {/* Visual Strength Indicator */}
                            <div className="flex gap-1 mt-2">
                                <div className={`h-1.5 flex-1 rounded-full transition-colors ${lengthValidate ? 'bg-orange-500' : 'bg-gray-200'}`} />
                                <div className={`h-1.5 flex-1 rounded-full transition-colors ${alphabetValidate ? 'bg-orange-500' : 'bg-gray-200'}`} />
                                <div className={`h-1.5 flex-1 rounded-full transition-colors ${numberValidate ? 'bg-orange-500' : 'bg-gray-200'}`} />
                            </div>

                            {/* Requirements Checklist */}
                            <ul className="grid grid-cols-2 gap-2 pt-2">
                                <li className={`text-xs flex items-center gap-1.5 ${lengthValidate ? 'text-green-600' : 'text-gray-400'}`}>
                                    {lengthValidate ? '✓' : '○'} 8+ Characters
                                </li>
                                <li className={`text-xs flex items-center gap-1.5 ${alphabetValidate ? 'text-green-600' : 'text-gray-400'}`}>
                                    {alphabetValidate ? '✓' : '○'} Includes Letters
                                </li>
                                <li className={`text-xs flex items-center gap-1.5 ${numberValidate ? 'text-green-600' : 'text-gray-400'}`}>
                                    {numberValidate ? '✓' : '○'} Includes Numbers
                                </li>
                            </ul>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 tracking-wide">Confirm Password</label>
                            <input
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (val) => watch('password') === val || "Passwords don't match"
                                })}
                                type="password"
                                className={`w-full px-4 py-4 rounded-xl border text-black transition-all outline-none bg-gray-50 focus:ring-4 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-50' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
                                    }`}
                                placeholder="Repeat your password"
                            />
                            {errors.confirmPassword?.message && (
                                <p className="text-xs text-red-500 font-medium">{String(errors.confirmPassword.message)}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!allValid}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-xl uppercase tracking-widest mt-4 ${allValid
                                ? 'bg-orange-600 cursor-pointer hover:bg-orange-700 shadow-orange-200 active:scale-95'
                                : 'bg-gray-500 cursor-not-allowed opacity-70'
                                }`}
                        >
                            Confirm New Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPass;