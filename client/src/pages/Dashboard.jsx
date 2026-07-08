import { ArrowLeft, Check, Rocket, Share2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import { MdDelete } from "react-icons/md";

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user)
  const navigate = useNavigate()

  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState(null)
  const [openDeleteId, setOpenDeleteId] = useState(null);
  const [displayDeleteButton, setDisplayDeleteButton] = useState(false);

  useEffect(() => {
    const handleGetAllWebsites = async () => {
      setLoading(true)
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
        setWebsites(result.data.websites)
      } catch (error) {
        console.error(error)
        setError(error.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    handleGetAllWebsites()
  }, [])

  const handleDeploy = async (id) => {
    try {
      const result = await axios.get(`${serverUrl}/api/website/deploy/${id}`, { withCredentials: true })

      setWebsites((prev) =>
        prev.map((w) =>
          w._id === id ? { ...w, deployed: true, deployUrl: result.data.url } : w
        )
      )

      window.open(result.data.url, "_blank")
    } catch (error) {
      console.log(error)
    }
  }

  const handleCopy = async (site) => {
    await navigator.clipboard.writeText(site.deployUrl)
    setCopiedId(site._id)

    setTimeout(() => setCopiedId(null), 2000)
  }

  const deleteItem = async (id) => {
    try {
      setOpenDeleteId(null)
      await axios.post(serverUrl + "/api/website/delete/" + id, {}, { withCredentials: true })

      const result = await axios.get(serverUrl + "/api/website/get-all", { withCredentials: true });
      setWebsites(result.data.websites)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='min-h-screen bg-[#050505] text-white'>
      <div className='sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10'>
        {/* Header */}
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button onClick={() => navigate("/")} className='p-2 rounded-lg hover:bg-white/10 transition cursor-pointer'>
              <ArrowLeft size={16} />
            </button>
            <h1 className='text-lg font-semibold'>Home</h1>
          </div>
          <button onClick={() => navigate("/generate")} className='px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition cursor-pointer'>
            + New Website
          </button>
        </div>
        {/* Body */}
        <div className='max-w-7xl mx-auto px-6 py-10'>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className='mb-10'
          >
            <p className='text-sm text-zinc-400 mb-1'>Welcome Back</p>
            <h1 className='text-3xl font-bold'>{userData?.name}</h1>
          </motion.div>

          {loading && (
            <div className='mt-24 text-center text-zinc-400'>Loading Your Websites...</div>
          )}

          {error && !loading && (
            <div className='mt-24 text-center text-red-400'>{error}</div>
          )}

          {websites.length === 0 && !loading && (
            <div className="mt-24 text-center">
              <p className="text-zinc-400">You have no websites yet</p>
              <button
                onClick={() => navigate("/generate")}
                className="mt-4 px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition cursor-pointer"
              >
                + Create Your First Website
              </button>
            </div>
          )}

          {websites.length > 0 && !loading && !error && (
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8'>
              {websites.map((w, i) => {
                const copied = (copiedId === w._id)

                return <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  onClick={() => navigate(`/editor/${w._id}`)}
                  className='rounded-2xl bg-white/5 border border-white/25 overflow-hidden hover:bg-white/15 transition flex flex-col'
                >
                  <div className='relative h-40 bg-black'>
                    <iframe srcDoc={w.latestCode} className='absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white' sandbox='allow-scripts allow-same-origin allow-forms' />
                    <div className='absolute inset-0 bg-black/10' />
                  </div>

                  <div className='p-5 flex flex-col gap-4 flex-1'>
                    <h3 className='text-base font-semibold line-clamp-2'>{w.title}</h3>
                    <p className='text-xs text-zinc-400'>Last update {" "}
                      {new Date(w.updatedAt).toLocaleDateString()}
                    </p>

                    {!w.deployed ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeploy(w._id)
                        }}
                        className='mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition cursor-pointer'
                      ><Rocket size={14} /> Deploy</button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(w)
                        }}
                        className={`mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer 
                                    ${copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/10 hover:bg-white/20 border border-white/10"}
                                  `}
                      >
                        {copied ?
                          (
                            <>
                              <Check size={14} />
                              Link Copied
                            </>
                          ) : (
                            <>
                              < Share2 size={14} />
                              Share Link
                            </>)
                        }
                      </motion.button>
                    )}

                    {displayDeleteButton && (
                      <div className='mt-auto text-red-600 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white hover:scale-105 transition cursor-pointer' onClick={(e) => { e.stopPropagation(); setOpenDeleteId(w._id) }}>
                        Delete Website{" "}
                        <MdDelete size={16} />

                        {openDeleteId === w._id && (
                          <div onClick={(e) => e.stopPropagation} className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-default bg-white text-center shadow-lg rounded p-3 z-50'>
                            <p className='text-black font-serif text-[1.2rem]'>Are you sure?</p>
                            <div className='flex gap-2 mt-2 justify-center'>
                              <button
                                className='bg-red-600 rounded px-3 py-1 text-white cursor-pointer'
                                onClick={(e) => { e.stopPropagation(); deleteItem(w._id) }}
                              >
                                Delete
                              </button>
                              <button
                                className='bg-black rounded px-3 py-1 text-white cursor-pointer'
                                onClick={(e) => { e.stopPropagation(); setOpenDeleteId(null) }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {!displayDeleteButton && (
                      <div className='flex justify-center mt-2'>
                        <p className='w-fit text-xs underline hover:text-blue-400 text-blue-500 cursor-pointer' onClick={(e) => { e.stopPropagation(); setDisplayDeleteButton(true) }}>More options</p>
                      </div>
                    )}

                    {displayDeleteButton && (
                      <p className='text-xs hover:text-underline hover:text-blue-400 text-blue-500 mt-2 cursor-pointer' onClick={(e) => { e.stopPropagation(); setDisplayDeleteButton(false) }}>Less options</p>
                    )}
                  </div>
                </motion.div>
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
