import { useNavigate } from "react-router-dom"
import { motion } from 'motion/react'
import { useState } from "react"
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "../redux/userSlice.js"
import { ArrowLeft, Check, Coins, Currency } from "lucide-react"
import LoginModel from "../components/LoginModel.jsx"

const Pricing = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const [openLogin, setOpenLogin] = useState(false)
    const [loading, setLoading] = useState(false)

    const plans = [
        {
            id: "free",
            name: "Free",
            price: "₹0",
            credits: 100,
            description: "Perfect to explore GenWeb.ai",
            features: [
                "AI website generation",
                "Responsive HTML output",
                "Basic animations",
            ],
            free: true,
            popular: false,
            button: "Get Started"
        },
        {
            id: "pro",
            name: "Pro",
            price: "₹499",
            credits: 500,
            description: "For serious creators & freelancers",
            features: [
                "Everything in Free",
                "Faster Generation",
                "Edit & regenerate",
            ],
            free: false,
            popular: true,
            button: "Upgrade to Pro"
        },
        {
            id: "enterprise",
            name: "Enterprise",
            price: "₹1499",
            credits: 1000,
            description: "For teams & power users",
            features: [
                "Unlimited interactions",
                "Highest priority",
                "Team collaboration",
                "Dedicated support",
            ],
            free: false,
            popular: false,
            button: "Contact Sales"
        },
    ]

    const handlePayment = async (plan) => {
        setLoading(true)
        try {
            if (!userData) {
                setOpenLogin(true)
            }

            const amount =
                plan.id === "pro" ? 499 :
                    plan.id === "enterprise" ? 1499 : 0

            if(amount == 0){
                setLoading(false);
                navigate("/")
                return
            }

            const result = await axios.post(serverUrl + "/api/payment/order", {
                planId: plan.id,
                amount,
                credits: plan.credits
            }, { withCredentials: true })

            const options = {
                key: import.meta.env.VITE_RAZORPAY_ID_KEY,
                amount: result.data.amount,
                currency: "INR",
                name: "GenWeb.ai",
                description: `${plan.name} - ${plan.credits} Credits`,
                order_id: result.data.id,

                handler: async function (response) {
                    const verifypay = await axios.post(serverUrl + "/api/payment/verify", response, { withCredentials: true })
                    dispatch(setUserData(verifypay.data.user))
                    alert("Payment Successful 🎉 Credits Added!")
                    navigate("/")
                },
                theme: {
                    color: "#8b5cf6"
                },
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='relative min-h-screen overflow-hidden bg-[#050505] text-white px-6 pt-16 pb-24'>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px]" />
            </div>

            <div className='relative z-10 gap-4 max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                <button onClick={() => navigate("/")} className='p-2 rounded-lg hover:bg-white/10 transition cursor-pointer'>
                    <ArrowLeft size={16} />
                </button>
                <h1 className='text-lg font-semibold'>Pricing</h1>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-4xl mx-auto text-center mb-14"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple transparent pricing</h1>
                <p className="text-zinc-400 text-lg">Buy credits once. Build anytime.</p>
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.12 }}
                        whileHover={{ y: -14, scale: 1.03 }}
                        className={`relative rounded-3xl p-8 border backdrop-blur-xl transition-all
                       ${p.popular ? "border-indigo-500 bg-gradient-to-b from-indigo-500/20 to-transparent shadow-2xl shadow-indigo-500/30"
                                : "border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-white/10"
                            }`}
                    >
                        {p.popular && (
                            <span className="absolute top-5 right-5 px-3 py-1 text-xs rounded-full bg-indigo-500">Most Popular</span>
                        )}

                        <h3 className="text-xl font-semibold">{p.name}</h3>
                        <p className="text-zinc-400 text-sm mb-6">{p.description}</p>

                        <div className="flex items-end gap-1 mb-4">
                            <span className="text-4xl font-bold">{p.price}</span>
                            <span className="text-sm text-zinc-400 mb-1">/one-time</span>
                        </div>

                        <div className="flex items-center gap-2 mb-8">
                            <Coins size={18} className="text-yellow-400" />
                            <span className="font-semibold">{p.credits} Credits</span>
                        </div>

                        <ul className="space-y-3 mb-10">
                            {p.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                                    <Check size={16} className="text-green-400" />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            disabled={loading}
                            onClick={() => handlePayment(p)}
                            className={`w-full py-3 rounded-xl font-semibold transition
                                ${p.popular
                                    ? "bg-indigo-500 hover:bg-indigo-600"
                                    : "bg-white/15 hover:bg-white/25"
                                } disabled:opacity-60 disabled:cursor-not-allowed
                                ${p.free
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                        >
                            {loading ? "Processing..." : p.button}
                        </motion.button>
                    </motion.div>
                ))}
            </div>

            {openLogin && (
                <LoginModel open={openLogin} onClose={() => setOpenLogin(false)} />
            )}
        </div>
    )
}

export default Pricing
