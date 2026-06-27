import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import { ArrowLeft, Code, Code2, MessageSquare, Monitor, Rocket, Send, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import Editor from '@monaco-editor/react'

const WebsiteEditor = () => {
    const { id } = useParams()
    const navigate = useNavigate();
    const [website, setwebsite] = useState(null)
    const [error, setError] = useState("")
    const [code, setCode] = useState("")
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const iframeRef = useRef(null)

    const [updateLoading, setUpdateLoading] = useState(false)
    const thinkingSteps = [
        "Understanding your request...",
        "Planning layout changes...",
        "Improving responsiveness...",
        "Applying animations...",
        "Finalizing update..."
    ]
    const [thinkingIndex, setThinkingIndex] = useState(0)
    const [showCode, setShowCode] = useState(false)
    const [showFullPreview, setShowFullPreview] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [deployed, setDeployed] = useState(false)

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, { withCredentials: true })

                setwebsite(result.data)
                setCode(result.data.latestCode)
                setMessages(result.data.conversation)
            } catch (error) {
                console.log(error)
                setError(error.response?.data?.message || "Something went wrong")
            }
        }

        handleGetWebsite()
    }, [id]);

    useEffect(() => {
        if (!iframeRef || !code) return;

        const blob = new Blob([code], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        iframeRef.current.src = url

        return () => URL.revokeObjectURL(url)
    }, [code]);

    useEffect(() => {
        const interval = setInterval(() => {
            setThinkingIndex((i) => (i + 1) % thinkingSteps.length)
        }, 2000)

        return () => clearInterval(interval)
    }, [updateLoading])

    if (error) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-red-400'>
                {error}
            </div>
        )
    }

    if (!website) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-white'>
                Loading...
            </div>
        )
    }

    const handleUpdate = async () => {
        setUpdateLoading(true)
        const userPrompt = prompt
        setPrompt("")
        setMessages((m) => [...m, { role: "user", content: userPrompt }])
        try {
            const result = await axios.post(`${serverUrl}/api/website/update/${id}`, { prompt: userPrompt }, { withCredentials: true })

            setMessages((m) => [...m, { role: "ai", content: result.data.message }])
            setCode(result.data.code)
        } catch (error) {
            console.log(error)
        } finally {
            setUpdateLoading(false)
        }
    }

    const handleDeploy = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/website/deploy/${website._id}`, { withCredentials: true })
            
            setDeployed(true)
            window.open(`${result.data.url}`, "_blank")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='h-screen w-screen flex bg-black text-white overflow-hidden'>
            <div className='flex-1 flex flex-col'>
                <div className='h-14 px-4 flex justify-between items-center border-b border-white/20 bg-black/80'>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <h1 className="text-lg font-semibold">Live Preview</h1>
                    </div>
                    <div className='flex gap-2'>
                        {!website.deployed && !deployed && (<button onClick={handleDeploy} className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition cursor-pointer'><Rocket size={14} /> Deploy</button>)}
                        <button onClick={() => setShowChat(true)} className='p-2 lg:hidden'><MessageSquare size={18} /></button>
                        <button onClick={() => setShowCode(!showCode)} className='p-2 cursor-pointer'><Code2 size={18} /></button>
                        <button onClick={() => setShowFullPreview(true)} className='p-2 cursor-pointer'><Monitor size={18} /></button>
                    </div>
                </div>
                <div className='flex h-screen w-screen'>
                    <aside className='hidden lg:flex w-[380px] flex-col border-r border-white/30 bg-black/80'>
                        <Header />
                        <>
                            <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
                                {messages.map((m, i) => (
                                    <div
                                        key={i}
                                        className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"
                                            }`}
                                    >
                                        <div
                                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user"
                                                ? "bg-white text-black"
                                                : "bg-black/5 border border-white/40 text-zinc-200"
                                                }`}
                                        >
                                            {m.content}
                                        </div>
                                    </div>
                                ))}

                                {updateLoading && (
                                    <div className='mx-w-[85%] mr-auto'>
                                        <div className='px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/25 text-zinc-400 italic'>{thinkingSteps[thinkingIndex]}</div>
                                    </div>
                                )}
                            </div>

                            <div className='p-3 border-t border-white/30'>
                                <div className='flex gap-2'>
                                    <input placeholder="Describe Changes..." onChange={(e) => setPrompt(e.target.value)} value={prompt} className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/25 text-sm outline-none' />
                                    <button onClick={handleUpdate} disabled={updateLoading} className='px-4 py-3 rounded-2xl disabled:bg-gray-500 bg-white text-black cursor-pointer disabled:cursor-not-allowed'><Send size={20} /></button>
                                </div>
                            </div>
                        </>
                    </aside>
                    <iframe ref={iframeRef} className="flex-1 w-full bg-white" sandbox='allow-scripts allow-same-origin allow-forms' />
                </div>
            </div>

            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className='fixed inset-0 z-[9999] bg-[#1e1e1e] flex flex-col'
                    >
                        <Header onClose={() => setShowChat(false)} />
                        <>
                            <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
                                {messages.map((m, i) => (
                                    <div
                                        key={i}
                                        className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"
                                            }`}
                                    >
                                        <div
                                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user"
                                                ? "bg-white text-black"
                                                : "bg-black/5 border border-white/40 text-zinc-200"
                                                }`}
                                        >
                                            {m.content}
                                        </div>
                                    </div>
                                ))}

                                {updateLoading && (
                                    <div className='mx-w-[85%] mr-auto'>
                                        <div className='px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/25 text-zinc-400 italic'>{thinkingSteps[thinkingIndex]}</div>
                                    </div>
                                )}
                            </div>

                            <div className='p-3 border-t border-white/30'>
                                <div className='flex gap-2'>
                                    <input placeholder="Describe Changes..." onChange={(e) => setPrompt(e.target.value)} value={prompt} className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/25 text-sm outline-none' />
                                    <button onClick={handleUpdate} disabled={updateLoading} className='px-4 py-3 rounded-2xl disabled:bg-gray-500 bg-white text-black cursor-pointer disabled:cursor-not-allowed'><Send size={20} /></button>
                                </div>
                            </div>
                        </>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className='fixed inset-y-0 right-0 w-full lg:w-[45%] z-[9999] bg-[#1e1e1e] flex flex-col'
                    >
                        <div className='h-12 px-4 flex justify-between items-center border-b border-white/25 bg-[#1e1e1e]'>
                            <span className='text-sm font-medium'>index.html</span>
                            <button onClick={() => setShowCode(false)} className='cursor-pointer'><X size={18} /></button>
                        </div>
                        <Editor
                            theme='vs-dark'
                            value={code}
                            language='html'
                            onChange={(v) => setCode(v)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showFullPreview && (
                    <motion.div
                        className='fixed inset-0 z-[9999] bg-black'
                    >
                        <iframe className='w-full h-full bg-white' sandbox='allow-scripts allow-same-origin allow-forms' srcDoc={code} />
                        <button onClick={() => setShowFullPreview(false)} className='absolute top-4 right-4 p-2 bg-black/70 rounded-lg cursor-pointer'><X /></button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

    function Header({ onClose }) {
        return (
            <div className='h-14 px-4 flex items-center justify-between border-b border-white/10'>
                <span className='font-semibold truncate'>{website.title}</span>
                {onClose && <button className='lg:hidden cursor-pointer' onClick={onClose} ><X size={18} color='white' /></button>}
            </div>
        )
    }
}

export default WebsiteEditor
