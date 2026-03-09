import React from 'react'
import Link from 'next/link'
import { Search, History, ArrowRight, CreditCard, DollarSign, ReceiptText } from 'lucide-react'

const PaymentHistoryNotFound = () => {
    return (
        <div className="w-full py-6 font-sans bg-white pt-24">
            <div className="max-w-4xl mx-auto">

                <div className="bg-white rounded-[3rem] p-16 border border-slate-400 shadow-sm flex flex-col items-center text-center relative overflow-hidden">

                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200 rounded-bl-[5rem] z-0"></div>

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto border-4 border-white shadow-sm">
                            <ReceiptText size={44} strokeWidth={1.2} className="text-slate-400" />
                        </div>

                        <div className="space-y-3 mb-10">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                                No <span className="text-amber-500">Payments</span> Yet
                            </h2>
                            <p className="text-slate-500 font-bold text-sm max-w-sm mx-auto leading-relaxed">
                                This section is currently empty. Once a payment is recorded, the transaction details and receipts will appear here.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <div className="flex items-center gap-2 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                                <Search size={16} className="text-amber-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Check later</span>
                            </div>

                            <Link
                                href="/supervisor/workers"
                                className="flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-3xl font-black text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                            >
                                Go to Dashboard <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Informative Footer - Simple & Clean */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <StatMini label="Status" value="No Dues" color="text-emerald-500" />
                    <StatMini label="Records" value="0 Items" color="text-slate-400" />
                    <StatMini label="History" value="Clean" color="text-blue-500" />
                    <StatMini label="Type" value="Digital" color="text-purple-500" />
                </div>

            </div>
        </div>
    )
}

const StatMini = ({ label, value, color }: any) => (
    <div className="bg-white p-4 rounded-3xl border border-slate-100 text-center shadow-sm">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-xs font-black ${color}`}>{value}</p>
    </div>
)

export default PaymentHistoryNotFound